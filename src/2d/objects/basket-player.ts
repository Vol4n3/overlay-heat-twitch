import {Scene2d, Scene2DItem} from '../core/scene2d';
import {HALF_PI, PI2} from '../../utils/number.utils';
import {PhysicBall2} from '../physics/physic-ball2';

export class BasketPlayer extends PhysicBall2 implements Scene2DItem {


  constructor(x: number, y: number) {
    super(x, y, 50);
  }

  sceneId: number = 0;
  scenePriority: number = 0;

  draw(scene: Scene2d, time: number): void {
    const {ctx} = scene;
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = 0.30;
    ctx.beginPath();
    ctx.ellipse(0, 0,
      this.radius + 10, this.radius - 10, HALF_PI, 0, PI2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
  }
}