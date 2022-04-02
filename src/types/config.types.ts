export const SCENES_ID = ["asteroid", "dartTarget"] as const;
export type SceneType = typeof SCENES_ID[number];

export interface ScenesConfig {
  active?: boolean;
  asteroidConfig?: any;
  dartTargetConfig?: any;
  heatId?: string;
  sceneType?: SceneType;
}