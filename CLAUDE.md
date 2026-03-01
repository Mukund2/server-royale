# Server Royale

Clash Royale-style tower defense game set in a data center.
Built for Mistral AI Worldwide Hackathon 2026 (Feb 28 - Mar 1).

## Tech Stack
- Next.js 14 + Phaser 3.90 + Mistral AI API + Vercel
- All art is procedurally generated (zero external assets)
- TypeScript throughout

## Project Structure
- `src/game/scenes/` - Phaser scenes (Boot, Preload, Menu, Battle, GameOver)
- `src/game/entities/` - Unit and Tower classes
- `src/game/systems/` - BudgetSystem, CombatSystem, WaveSystem, CardSystem
- `src/game/ui/` - HUD, CardHand, CardSprite, FloatingText
- `src/game/config/` - Card/enemy definitions, constants
- `src/app/api/opponent/` - Mistral AI opponent endpoint
- `src/lib/mistral.ts` - Mistral client helper

## Game Design
- 430x760 portrait arena, 2 lanes
- 8-card deck, hand of 4
- Budget regen: 1/sec (slows at wave 5 and 10)
- Waves every 20 seconds, Mistral AI picks attack strategy
- Score = waves survived x uptime % x units deployed

## Running
```bash
npm install
echo "MISTRAL_API_KEY=your_key" > .env.local
npm run dev
```

## Deploy
```bash
vercel
```
