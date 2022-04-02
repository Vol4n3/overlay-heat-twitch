import {Vector2} from '../geometry/vector2';
import {Scene2d, Scene2DItem} from '../scene2d';

export class Segment implements Scene2DItem {
  constructor(public p1: Vector2, public p2: Vector2) {
  }

  draw({ctx}: Scene2d, time: number): void {
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
  }


}