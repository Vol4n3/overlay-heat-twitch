import {Line} from 'detect-collisions';
import {ItemSystem} from '../core/scene2d';
import {PhysicBall2} from './physic-ball2';
import {IPoint2} from '../../types/point.types';
import {Segment2} from '../geometry/segment2';

export class PhysicWall2 extends Line implements ItemSystem {
  isStatic = true;

  isCollide(other: ItemSystem, overlapV: IPoint2, overlapN: IPoint2): void {
    if (other instanceof PhysicBall2) {
      other.wallResponse(this, overlapV, overlapN);
    }
  }

  get segment(): Segment2 {
    return new Segment2({x: this.minX, y: this.minY}, {x: this.maxX, y: this.maxY});
  }

}