import {IPoint2} from './point.types';

export interface HeatApi {
  channel: number,
  id: string;
  message: string;
  type: "system" | "click",
  version: string,
  x: string; // 0 / 1
  y: string; // 0 / 1
}
export interface HeatUser{
  display_name: string;
}

export interface MessageHeat {
  data: string;
}

export interface UserPoint extends IPoint2 {
  userID: string;
}