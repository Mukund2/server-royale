export interface EnemyDef {
  id: string;
  name: string;
  cost: number;
  type: 'unit' | 'spell';
  texture: string;
  color: number;
  hp?: number;
  dps?: number;
  speed?: number;
  special?: string;
  // For swarm types
  count?: number;
  // For spells
  spellDamage?: number;
  spellRadius?: number;
}

export const ENEMY_DEFS: EnemyDef[] = [
  {
    id: 'heat-creep',
    name: 'Heat Creep',
    cost: 2,
    type: 'unit',
    texture: 'heat-creep',
    color: 0xee3333,
    hp: 120,
    dps: 15,
    speed: 80,
  },
  {
    id: 'ddos-swarm',
    name: 'DDoS Swarm',
    cost: 3,
    type: 'unit',
    texture: 'ddos-mini',
    color: 0xff66aa,
    hp: 30,
    dps: 8,
    speed: 100,
    count: 5,
  },
  {
    id: 'ransomware',
    name: 'Ransomware',
    cost: 5,
    type: 'unit',
    texture: 'ransomware',
    color: 0x991111,
    hp: 500,
    dps: 25,
    speed: 40,
    special: 'dot',
  },
  {
    id: 'power-surge',
    name: 'Power Surge',
    cost: 4,
    type: 'spell',
    texture: 'power-surge',
    color: 0xffaa00,
    spellDamage: 150,
    spellRadius: 80,
  },
  {
    id: 'zero-day',
    name: 'Zero-Day',
    cost: 3,
    type: 'unit',
    texture: 'zero-day',
    color: 0xffdd22,
    hp: 60,
    dps: 20,
    speed: 160,
  },
  {
    id: 'cryptominer',
    name: 'Cryptominer',
    cost: 4,
    type: 'unit',
    texture: 'cryptominer',
    color: 0x9944ff,
    hp: 200,
    dps: 0,
    speed: 60,
    special: 'drain',
  },
];

export function getEnemyDef(id: string): EnemyDef {
  return ENEMY_DEFS.find(e => e.id === id)!;
}
