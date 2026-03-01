export interface CardDef {
  id: string;
  name: string;
  cost: number;
  type: 'unit' | 'spell';
  texture: string;
  color: number;
  // Unit stats (if type === 'unit')
  hp?: number;
  dps?: number;
  range?: number;      // 0 = melee
  speed?: number;       // pixels/sec, 0 = stationary
  special?: string;
  // Spell stats
  spellEffect?: 'heal' | 'push' | 'overclock';
  spellValue?: number;
  spellDuration?: number;
  // Display
  description: string;
}

export const CARD_DEFS: CardDef[] = [
  {
    id: 'junior-tech',
    name: 'Jr. Tech',
    cost: 2,
    type: 'unit',
    texture: 'junior-tech',
    color: 0x22cc66,
    hp: 100,
    dps: 20,
    range: 0,
    speed: 100,
    description: 'Basic worker. Cheap and cheerful.',
  },
  {
    id: 'senior-engineer',
    name: 'Sr. Engineer',
    cost: 4,
    type: 'unit',
    texture: 'senior-engineer',
    color: 0x3388ff,
    hp: 300,
    dps: 40,
    range: 0,
    speed: 60,
    description: 'Tanky senior. Hard to take down.',
  },
  {
    id: 'ai-bot',
    name: 'AI Bot',
    cost: 3,
    type: 'unit',
    texture: 'ai-bot',
    color: 0xff8833,
    hp: 150,
    dps: 30,
    range: 150,
    speed: 80,
    special: 'glitch',
    description: 'Ranged bot. 15% chance to glitch.',
  },
  {
    id: 'firewall',
    name: 'Firewall',
    cost: 3,
    type: 'unit',
    texture: 'firewall',
    color: 0x888899,
    hp: 400,
    dps: 0,
    range: 0,
    speed: 0,
    special: 'slow',
    description: 'Stationary wall. Slows enemies 50%.',
  },
  {
    id: 'cooling-system',
    name: 'Cooling Sys',
    cost: 4,
    type: 'unit',
    texture: 'cooling-system',
    color: 0x44ddee,
    hp: 50,
    dps: 15,
    range: 100,
    speed: 0,
    special: 'area-dot',
    description: 'Area DOT. 10s lifetime.',
  },
  {
    id: 'emergency-patch',
    name: 'Em. Patch',
    cost: 2,
    type: 'spell',
    texture: 'card-bg',
    color: 0x22cc66,
    spellEffect: 'heal',
    spellValue: 200,
    description: 'Heal a server 200 HP.',
  },
  {
    id: 'load-balancer',
    name: 'Load Bal.',
    cost: 5,
    type: 'spell',
    texture: 'card-bg',
    color: 0x6666ff,
    spellEffect: 'push',
    description: 'Push enemies to the other lane.',
  },
  {
    id: 'overclock',
    name: 'Overclock',
    cost: 1,
    type: 'spell',
    texture: 'card-bg',
    color: 0xffdd22,
    spellEffect: 'overclock',
    spellDuration: 5000,
    description: '+50% speed & dmg to all units, 5s.',
  },
];

export function getCardDef(id: string): CardDef {
  return CARD_DEFS.find(c => c.id === id)!;
}
