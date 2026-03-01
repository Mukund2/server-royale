import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getMistralClient } from '@/lib/mistral';

const ENEMY_UNITS = [
  { id: 'heat-creep', cost: 2, desc: 'Basic melee, 120 HP, 15 DPS' },
  { id: 'ddos-swarm', cost: 3, desc: 'Spawns 5 weak units (30 HP, 8 DPS each)' },
  { id: 'ransomware', cost: 5, desc: 'Tanky 500 HP, DOT damage, slow' },
  { id: 'power-surge', cost: 4, desc: 'Area spell, 150 damage' },
  { id: 'zero-day', cost: 3, desc: 'Fast rusher, 60 HP, 20 DPS, speed 160' },
  { id: 'cryptominer', cost: 4, desc: 'Drains player budget, 200 HP, no damage' },
];

export async function POST(request: NextRequest) {
  try {
    const gameState = await request.json();
    const mistral = getMistralClient();

    if (!mistral) {
      // No API key — use fallback
      return NextResponse.json(generateFallback(gameState));
    }

    const prompt = buildPrompt(gameState);

    const { text } = await generateText({
      model: mistral('mistral-small-latest'),
      system: `You are the AI opponent in Server Royale, a tower defense game. Your goal: destroy the player's servers by choosing strategic attacks.
You have a budget of ${gameState.enemyBudget} to spend on units.

Available units:
${ENEMY_UNITS.map(u => `- ${u.id} (cost: ${u.cost}): ${u.desc}`).join('\n')}

Rules:
- Total cost of attacks must not exceed your budget of ${gameState.enemyBudget}
- Each attack needs: unit id, lane (0 or 1), delay (ms, stagger them 300-1000ms apart)
- For ddos-swarm, specify it once and 5 minis will spawn
- Analyze the player's defenses and pick counters
- Be creative with announcements (short taunt, max 40 chars)

Return ONLY valid JSON, no markdown:
{"attacks":[{"unit":"unit-id","lane":0,"delay":0}],"announcement":"short taunt"}`,
      prompt,
      maxTokens: 500,
      temperature: 0.7,
    });

    // Parse AI response
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const plan = JSON.parse(jsonMatch[0]);
        // Validate and cap budget
        if (plan.attacks && Array.isArray(plan.attacks)) {
          let totalCost = 0;
          const validAttacks = [];
          for (const atk of plan.attacks) {
            const def = ENEMY_UNITS.find(u => u.id === atk.unit);
            if (def && totalCost + def.cost <= gameState.enemyBudget) {
              totalCost += def.cost;
              validAttacks.push({
                unit: atk.unit === 'ddos-swarm' ? 'ddos-mini' : atk.unit,
                lane: atk.lane === 0 ? 0 : 1,
                delay: Math.max(0, Math.min(5000, atk.delay || 0)),
              });
              // Expand ddos-swarm into 5 minis
              if (atk.unit === 'ddos-swarm') {
                for (let i = 1; i < 5; i++) {
                  validAttacks.push({
                    unit: 'ddos-mini',
                    lane: atk.lane === 0 ? 0 : 1,
                    delay: (atk.delay || 0) + i * 300,
                  });
                }
              }
            }
          }
          return NextResponse.json({
            attacks: validAttacks,
            announcement: (plan.announcement || 'Incoming!').slice(0, 60),
          });
        }
      }
    } catch (parseErr) {
      console.warn('Failed to parse AI response:', parseErr);
    }

    // If parsing failed, use fallback
    return NextResponse.json(generateFallback(gameState));

  } catch (error) {
    console.error('Opponent API error:', error);
    return NextResponse.json(generateFallback({ enemyBudget: 5, wave: 1 }));
  }
}

function buildPrompt(state: any): string {
  const lines = [`Wave: ${state.wave}`, `Your budget: ${state.enemyBudget}`];

  if (state.towers) {
    lines.push('Player towers:');
    for (const t of state.towers) {
      lines.push(`  ${t.id}: ${t.hp}/${t.maxHp} HP (lane ${t.lane})`);
    }
  }

  if (state.playerUnits && state.playerUnits.length > 0) {
    lines.push(`Player has ${state.playerUnits.length} units deployed:`);
    const counts: Record<string, number> = {};
    for (const u of state.playerUnits) {
      counts[u.id] = (counts[u.id] || 0) + 1;
    }
    for (const [id, count] of Object.entries(counts)) {
      lines.push(`  ${id}: ${count}`);
    }
    // Lane distribution
    const lane0 = state.playerUnits.filter((u: any) => u.lane === 0).length;
    const lane1 = state.playerUnits.filter((u: any) => u.lane === 1).length;
    lines.push(`  Lane 0: ${lane0} units, Lane 1: ${lane1} units`);
  } else {
    lines.push('Player has no units deployed — rush opportunity!');
  }

  lines.push(`Player budget: ${Math.floor(state.playerBudget || 0)}`);

  return lines.join('\n');
}

function generateFallback(state: any) {
  const budget = state.enemyBudget || 5;
  const attacks: { unit: string; lane: number; delay: number }[] = [];
  let spent = 0;

  const pool = ENEMY_UNITS.filter(u => u.id !== 'power-surge'); // Keep spells rare in fallback

  while (spent < budget) {
    const unit = pool[Math.floor(Math.random() * pool.length)];
    if (spent + unit.cost > budget) break;

    if (unit.id === 'ddos-swarm') {
      for (let i = 0; i < 5; i++) {
        attacks.push({
          unit: 'ddos-mini',
          lane: Math.random() < 0.5 ? 0 : 1,
          delay: attacks.length * 400 + i * 300,
        });
      }
    } else {
      attacks.push({
        unit: unit.id,
        lane: Math.random() < 0.5 ? 0 : 1,
        delay: attacks.length * 500,
      });
    }
    spent += unit.cost;
  }

  const taunts = [
    'Your servers are mine!',
    'Heating up your racks!',
    'Can you handle this?',
    'Overload incoming!',
    'Time to crash!',
  ];

  return {
    attacks,
    announcement: taunts[Math.floor(Math.random() * taunts.length)],
  };
}
