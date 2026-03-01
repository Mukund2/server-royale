# Server Royale — Ralph Loop Polish Prompt

You are iteratively polishing Server Royale (at /Users/mukund/server-royale) — a Phaser 3 + Next.js game that's a Clash Royale clone themed around data centers. Your goal is to make it look and feel EXACTLY like Clash Royale but with a data center theme. All art is procedurally generated via Phaser Graphics API (zero external assets).

## WHAT TO FIX (prioritized)

### Visual Polish — Make It Look Like Clash Royale
1. **Arena**: Clash Royale arena has green grass, horizontal river with two bridges, clear lane dividers, enemy/player territory. Current arena is close but needs more detail: cobblestone-style paths in each lane, shimmering river, decorative bushes/trees at edges, small environment details (flowers, rocks, torches). Lush grass with subtle color variation.
2. **Sprites/Units**: Characters need MORE detail and charm — bigger eyes, bouncier proportions, thick black outlines (Supercell style). Add idle bounce animations to all units. Add attack animations (shake/flash). Add death animations (pop/explode with particles). Currently too small and static.
3. **Towers**: Server racks and main server need to look more imposing. Add animated lights (blinking LEDs), smoke/steam effects, defensive aura rings. Main server (king tower) should have glowing crown/star emblem.
4. **Cards in hand**: Need to look MORE like Clash Royale cards — rounded rectangle with character art taking up most of the card face, elixir cost in purple/pink circle top-left, card name at bottom in banner, level star, rarity color border. Satisfying pop/bounce when selected and grayed out overlay when unaffordable.
5. **Elixir/Budget bar**: Should look exactly like Clash Royale's — horizontal bar with 10 segments, purple/pink fill that animates smoothly, elixir drop icon, number display.
6. **Deployment effects**: When a unit is placed, satisfying circle burst + particles. When enemy dies, pop/explosion. When towers take damage, flash red and shake. Need more visual oomph.
7. **Menu Screen**: Should feel like Clash Royale title screen — dramatic, animated background, big shiny BATTLE button, trophy counter area, card deck preview. Needs more visual flair.
8. **Game Over Screen**: Needs Clash Royale victory/defeat feeling — big banner, animated crown collection, stat breakdown with animated counting, replay button.
9. **Wave announcements**: Should feel dramatic — big text that slams in from top, enemy AI taunt in speech bubble banner, red warning effects on screen edges.
10. **Overall feel**: Screen shake on big events, subtle camera zoom on wave start, particle effects everywhere (sparkles, smoke, fire on enemies).

### Gameplay Feel Issues
11. **Deploy feedback**: Deploy should feel punchy — deploy circle pulses, camera kicks, particles burst.
12. **Combat visibility**: Show attack lines/flashes between fighting units. Damage numbers floating up. Health bars above each unit.
13. **Tower defense feel**: Towers should have visible range indicators (subtle circles) and visually shoot at enemies with projectile particles.

### Bug Fixes & Quality
14. **Card tray overlap**: Cards must not overlap HUD elements. Card tray in clean dark panel at bottom.
15. **Responsive**: 430x760 portrait — everything fits with no overflow.
16. **Performance**: Reasonable particle counts. Object pooling. No create/destroy every frame.
17. **Verify it builds**: After EVERY change, run `cd /Users/mukund/server-royale && npx next build` and fix any errors.

## RULES
- Work in /Users/mukund/server-royale
- All art procedurally generated via Phaser Graphics API — NO external image files
- Keep data center theme
- After changes, verify build: `cd /Users/mukund/server-royale && npx next build`
- Commit after each improvement: `cd /Users/mukund/server-royale && git add -A && git commit -m "polish: <description>"`
- Focus on ONE area per iteration, make it great, verify build, commit, move on
- Check git log for previous iterations and build on them — don't redo work
- IMPORTANT: Each iteration, check what's already been done and pick the NEXT unfinished item

## COMPLETION
Output <promise>CLASH ROYALE QUALITY ACHIEVED</promise> when the game visually matches Clash Royale quality with data center theming.
