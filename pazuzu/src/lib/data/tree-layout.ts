// SVG coordinates for each skill node in the Ward Tree visualization
// Organized by branch, left-to-right: Foundation, Stillness, Impulse (top row)
// World, Body, Voice (bottom row)
// x, y positions for a 440x600 viewBox

export interface TreeNode {
  skillId: string;
  x: number;
  y: number;
}

export interface TreeConnection {
  from: string;
  to: string;
}

const COL1 = 75;  // Foundation
const COL2 = 220; // Stillness
const COL3 = 365; // Impulse
const COL4 = 75;  // World
const COL5 = 220; // Body
const COL6 = 365; // Voice

export const TREE_NODES: TreeNode[] = [
  // Foundation branch (top-left)
  { skillId: 'marker', x: COL1, y: 50 },
  { skillId: 'name', x: COL1 - 35, y: 120 },
  { skillId: 'eyecontact', x: COL1 + 35, y: 120 },
  { skillId: 'handtarget', x: COL1, y: 190 },

  // Stillness branch (top-center)
  { skillId: 'capturingcalm', x: COL2, y: 50 },
  { skillId: 'tethsettle', x: COL2 - 35, y: 120 },
  { skillId: 'findit', x: COL2 + 35, y: 120 },
  { skillId: 'matplace', x: COL2, y: 190 },
  { skillId: 'relaxation', x: COL2, y: 260 },

  // Impulse branch (top-right)
  { skillId: 'wait', x: COL3, y: 50 },
  { skillId: 'leaveit', x: COL3, y: 120 },
  { skillId: 'dropit', x: COL3, y: 190 },

  // World branch (bottom-left)
  { skillId: 'looseleash', x: COL4, y: 345 },
  { skillId: 'stranger', x: COL4, y: 415 },
  { skillId: 'recall', x: COL4, y: 485 },
  { skillId: 'emergencyrecall', x: COL4 - 35, y: 555 },
  { skillId: 'doormanners', x: COL4 + 35, y: 555 },

  // Body branch (bottom-center)
  { skillId: 'touchaccept', x: COL5, y: 345 },
  { skillId: 'nailpaw', x: COL5 - 35, y: 415 },
  { skillId: 'mouthear', x: COL5 + 35, y: 415 },
  { skillId: 'coopcare', x: COL5, y: 485 },

  // Voice branch (bottom-right)
  { skillId: 'alertbark', x: COL6, y: 345 },
  { skillId: 'interrupter', x: COL6, y: 415 },
  { skillId: 'engagedisengage', x: COL6 - 35, y: 485 },
  { skillId: 'quietcue', x: COL6 + 35, y: 485 },
];

export const TREE_CONNECTIONS: TreeConnection[] = [
  // Foundation
  { from: 'marker', to: 'name' },
  { from: 'marker', to: 'eyecontact' },
  { from: 'marker', to: 'handtarget' },

  // Stillness
  { from: 'capturingcalm', to: 'tethsettle' },
  { from: 'capturingcalm', to: 'matplace' },
  { from: 'marker', to: 'findit' },
  { from: 'tethsettle', to: 'matplace' },
  { from: 'matplace', to: 'relaxation' },

  // Impulse
  { from: 'wait', to: 'leaveit' },
  { from: 'leaveit', to: 'dropit' },

  // Cross-branch connections (Foundation → others)
  { from: 'marker', to: 'capturingcalm' },
  { from: 'marker', to: 'wait' },
  { from: 'marker', to: 'interrupter' },
  { from: 'eyecontact', to: 'looseleash' },
  { from: 'eyecontact', to: 'relaxation' },
  { from: 'eyecontact', to: 'leaveit' },
  { from: 'eyecontact', to: 'recall' },
  { from: 'name', to: 'looseleash' },
  { from: 'name', to: 'recall' },
  { from: 'handtarget', to: 'looseleash' },

  // Stillness → others
  { from: 'capturingcalm', to: 'touchaccept' },
  { from: 'capturingcalm', to: 'stranger' },
  { from: 'capturingcalm', to: 'alertbark' },
  { from: 'matplace', to: 'alertbark' },

  // World
  { from: 'looseleash', to: 'stranger' },
  { from: 'stranger', to: 'recall' },
  { from: 'recall', to: 'emergencyrecall' },
  { from: 'stranger', to: 'engagedisengage' },

  // Body
  { from: 'touchaccept', to: 'nailpaw' },
  { from: 'touchaccept', to: 'mouthear' },
  { from: 'touchaccept', to: 'coopcare' },

  // Voice
  { from: 'alertbark', to: 'engagedisengage' },
  { from: 'interrupter', to: 'quietcue' },
  { from: 'alertbark', to: 'quietcue' },

  // Impulse → World
  { from: 'wait', to: 'doormanners' },
];

export const BRANCH_LABELS = [
  { label: 'Foundation', x: COL1, y: 14 },
  { label: 'Stillness', x: COL2, y: 14 },
  { label: 'Impulse', x: COL3, y: 14 },
  { label: 'World', x: COL4, y: 310 },
  { label: 'Body', x: COL5, y: 310 },
  { label: 'Voice', x: COL6, y: 310 },
];
