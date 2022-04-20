import {IPoint2} from '../types/point.types';

export const PointDistance = (p1: IPoint2, p2: IPoint2): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export const DotProduct = (p1: IPoint2, p2: IPoint2): number => {
  return p1.x * p2.x + p1.y * p2.y;
}
export const AngleTo = (p1: IPoint2, p2: IPoint2): number => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}
export const PointRotate = (origin: IPoint2, rotateAnchor: IPoint2, angle: number): IPoint2 => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = origin.x - rotateAnchor.x;
  const dy = origin.y - rotateAnchor.y;
  return {
    x: dx * cos + dy * sin + rotateAnchor.x,
    y: -dx * sin + dy * cos + rotateAnchor.y
  }
}