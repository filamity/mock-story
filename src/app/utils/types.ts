export type Conditions = {
  requires: string[];
  bypass: string[];
};

export type Scenario = {
  name: string;
  conditions: Conditions;
  scene: SceneEvent[];
};

export const LEFT = "LEFT";
export const RIGHT = "RIGHT";
export const UP = "UP";
export const DOWN = "DOWN";

export type Direction = typeof LEFT | typeof RIGHT | typeof UP | typeof DOWN;

export const DIRECTIONS = {
  LEFT,
  RIGHT,
  UP,
  DOWN,
};

export type ChoiceOption = {
  text: string;
  scene: SceneEvent[];
};

export type HeroData = {
  position: Vector2;
  facingDirection: Direction;
};

type Main = any;
type Battle = any;

export type Vector2 = {
  x: number;
  y: number;
};

export type BattleActionTarget =
  | "self"
  | "enemy"
  | "playerSingle"
  | "playerAll"
  | "any"
  | "all";

export type BattleAction = {
  name: string;
  description: string;
  targetRequired: boolean;
  targetEnemyByDefault: boolean;
  actionAnimationKey: string;
  effectAnimationKey: string;
  action: (battle: Battle) => void;
  targets: BattleActionTarget;
};

export const LEVELS = [
  "Platform",
  "OutdoorLevel1",
  "CaveLevel1",
  "Room",
  "TitleMenu",
  "Corridor",
  "Kitchen",
  "Bathroom",
  "InterviewRoom",
];

export const LEVELS_MAPS = {
  Platform: "/levels/platform.png",
  OutdoorLevel1: "/levels/outdoor-level-1.png",
  CaveLevel1: "/levels/cave-level-1.png",
  Room: "/levels/room.png",
  TitleMenu: "/levels/title-menu.png",
  Corridor: "/levels/corridor.png",
  Kitchen: "/levels/kitchen.png",
  Bathroom: "/levels/bathroom.png",
  InterviewRoom: "/levels/interview-room.png",
};

export const SCENE_EVENTS = {
  TEXT_BOX: "TEXT_BOX",
  ADD_CG: "ADD_CG", // cutscene graphic
  REMOVE_CG: "REMOVE_CG",
  CHOICE_MENU: "CHOICE_MENU",
  BATTLE: "BATTLE",
  ADD_CHILD: "ADD_CHILD",
  REMOVE_CHILD: "REMOVE_CHILD",
  ADD_FLAG: "ADD_FLAG",
  MOOD: "MOOD",
  WAIT: "WAIT",
  FACE_DIRECTION: "FACE_DIRECTION",
  PERSON_MOVES: "PERSON_MOVES",
  CHANGE_LEVEL: "CHANGE_LEVEL",
  FN: "FN",
};

export const PORTRAITS = {
  portraitHero: "portraitHero",
  portraitInterviewer1: "portraitInterviewer1",
  portraitInterviewer2: "portraitInterviewer2",
  portraitInterviewer3: "portraitInterviewer3",
  portraitInterviewer4: "portraitInterviewer4",
};

export const BATTLE_UNITS = {
  hero: "hero",
  pookie: "pookie",
  piano: "piano",
  train: "train",
};

export type SceneEvent = {
  type: string;
  personName?: string; // used for FACE_DIRECTION, PERSON_MOVES
  imageKey?: string; // used for ADD_CG, REMOVE_CG

  // TEXT_BOX
  strings?: string[];
  portraitKey?: string;

  // ADD_CG
  // + imageKey

  // REMOVE_CG
  // + imageKey

  // CHOICE_MENU
  choiceOptions?: ChoiceOption[];

  // BATTLE
  playerUnits?: string[];
  enemy?: string;
  victoryScene?: SceneEvent[];
  defeatScene?: SceneEvent[];
  runScene?: SceneEvent[];

  // ADD_CHILD
  className?: string;
  x?: number;
  y?: number;
  config?: any;

  // REMOVE_CHILD
  childName?: string;

  // ADD_FLAG
  addsFlag?: string;

  // MOOD (either setTo or changeBy)
  setTo?: number;
  changeBy?: number;

  // FACE_DIRECTION (must pass either direction or targetName to face towards)
  direction?: Direction;
  targetName?: string;
  // + personName

  // PERSON_MOVES (must pass either moveList (set path) or destinationPosition (to pathfind towards)
  moveList?: Direction[];
  destinationPosition?: Vector2;
  walkType?: "walk" | "walkBackwards";
  // + personName

  // WAIT
  time?: number;

  // CHANGE_LEVEL
  levelId?: string;
  heroData?: HeroData;

  // FN
  fn?: (root: Main, nextScene: () => void) => void;
};

export const DEFAULT_SCENE_EVENT_VALUES = {
  TEXT_BOX: {
    strings: [],
    portraitKey: PORTRAITS.portraitHero,
  },
  ADD_CG: {
    imageKey: "",
  },
  REMOVE_CG: {
    imageKey: "",
  },
  CHOICE_MENU: {
    choiceOptions: [],
  },
  BATTLE: {
    playerUnits: [],
    enemy: "",
    victoryScene: [],
    defeatScene: [],
    runScene: [],
  },
  ADD_CHILD: {
    className: "",
    x: 0,
    y: 0,
    config: {},
  },
  REMOVE_CHILD: {
    childName: "",
  },
  ADD_FLAG: {
    addsFlag: "",
  },
  MOOD: {
    setTo: 0,
  },
  FACE_DIRECTION: {
    direction: DIRECTIONS.DOWN,
    personName: "",
  },
  PERSON_MOVES: {
    moveList: [],
    walkType: "walk",
    personName: "",
  },
  WAIT: {
    time: 0,
  },
  CHANGE_LEVEL: {
    levelId: "",
    heroData: {
      position: { x: 0, y: 0 },
      facingDirection: DIRECTIONS.DOWN,
    },
  },
  FN: {
    fn: () => {},
  },
};
