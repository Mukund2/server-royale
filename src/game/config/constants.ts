export const GAME_WIDTH = 430;
export const GAME_HEIGHT = 760;

// Arena zones
export const ENEMY_SPAWN_Y = 40;
export const PLAYER_DEPLOY_MIN_Y = 350;
export const PLAYER_DEPLOY_MAX_Y = 560;

// Lane centers
export const LANE_0_X = GAME_WIDTH / 4;       // ~107
export const LANE_1_X = (GAME_WIDTH * 3) / 4; // ~322

// Tower positions
export const TOWER_0_X = LANE_0_X;
export const TOWER_0_Y = 590;
export const TOWER_1_X = LANE_1_X;
export const TOWER_1_Y = 590;
export const MAIN_SERVER_X = GAME_WIDTH / 2;
export const MAIN_SERVER_Y = 650;

// Tower HP
export const LANE_TOWER_HP = 1000;
export const MAIN_SERVER_HP = 2000;

// Budget
export const STARTING_BUDGET = 5;
export const MAX_BUDGET = 10;
export const BASE_REGEN_RATE = 1;       // per second
export const SLOW_REGEN_RATE = 0.7;     // after wave 5
export const CRISIS_REGEN_RATE = 0.5;   // after wave 10

// Waves
export const WAVE_INTERVAL = 20000;     // ms between waves
export const STARTING_ENEMY_BUDGET = 5;
export const ENEMY_BUDGET_SCALE = 2;    // +2 per wave

// Card hand
export const HAND_SIZE = 4;
export const DECK_SIZE = 8;

// HUD
export const HUD_Y = 680;
export const CARD_TRAY_Y = 700;

// Combat
export const MELEE_RANGE = 30;
