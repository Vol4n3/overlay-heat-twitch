import {Point2} from './point2';
import {Rectangle2} from './rectangle2';

export class Polygon2 {
  constructor(public points: Point2[]) {

  }

  get rect(): Rectangle2 {
    const onlyX = this.points.map(p => p.x);
    const onlyY = this.points.map(p => p.y);
    return new Rectangle2(Math.min(...onlyX), Math.min(...onlyY), Math.max(...onlyX), Math.max(...onlyY))
  }
}