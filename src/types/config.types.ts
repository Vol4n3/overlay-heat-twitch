export const SCENES_ID = ["asteroid", "dartTarget", "soccer", "basket"] as const;
export type SceneType = typeof SCENES_ID[number];

export interface ScenesConfig {
  active?: boolean;
  asteroidConfig?: any;
  soccerConfig?: any;
  dartTargetConfig?: any;
  heatId?: string;
  channelId?: string;
  password?: string;
  username?: string;
  sceneType?: SceneType;
  isLoading?: boolean;
}