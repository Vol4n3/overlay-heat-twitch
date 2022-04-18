import {Scene2d, Scene2DItem} from '../core/scene2d';
import {CanCollide} from '../core/collider';
import {PhysicBall2} from '../physics/physic-ball2';
import {PI2} from '../../utils/number.utils';
import {Rectangle2} from '../geometry/rectangle2';

export class BasketBall extends PhysicBall2 implements Scene2DItem, CanCollide {
  constructor(x: number, y: number, private texture?: null | CanvasPattern) {
    super(x, y, 30);
    this.gravity.y = 0.5;
  }

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

  sceneId: number = 0;
  scenePriority: number = 0;

  draw({ctx}: Scene2d, time: number): void {
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, PI2);
    if (this.texture) {
      ctx.fillStyle = this.texture;
      ctx.globalAlpha = 0.75;
    }
    ctx.fill();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
    const {width, height} = scene.canvas;
    this.applyPhysics();
    this.bounceBoundary(new Rectangle2(0, -5000, width, height), {x: 0.8, y: 0.8});
  }
}