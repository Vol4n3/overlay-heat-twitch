import {Scene2d, Scene2DItem} from '../core/scene2d';
import {CanCollide} from '../core/collider';
import {PhysicBall2} from '../physics/physic-ball2';
import {PI2} from '../../utils/number.utils';
import {BasketBall} from './basket-ball';

export class Hoop extends PhysicBall2 implements Scene2DItem, CanCollide {
  collisionId: number = 0;

  detection(item: CanCollide): void {
    if (item instanceof BasketBall) {
      const collision = this.isCollisionToCircle(item);
      if (collision) {
        this.circleCollisionResponse(item);
      }
      return;
    }
  }

  isStatic = true;
  mass = 3;
  sceneId: number = 0;
  scenePriority: number = 0;

  draw(scene: Scene2d, time: number): void {
    const {ctx} = scene;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, PI2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
  }

}