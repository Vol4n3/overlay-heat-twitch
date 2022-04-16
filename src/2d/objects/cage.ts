import {Rectangle2} from '../geometry/rectangle2';
import {Scene2d, Scene2DItem} from '../core/scene2d';
import {Ballon} from './ballon';
import {CanCollide} from '../core/collider';

export class Cage extends Rectangle2 implements Scene2DItem, CanCollide {

  collisionId: number = 0;

  detection(item: CanCollide): void {
    if (item instanceof Ballon) {
      item.detectGoal(this)
    }

  }

  sceneId: number = 0;
  scenePriority: number = 0;

  draw({ctx}: Scene2d) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.stroke();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
  }
}