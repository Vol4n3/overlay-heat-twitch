import {PhysicBall2} from '../../physics/physic-ball2';
import {Item2Scene, ItemSystem, Scene2d} from '../../core/scene2d';
import {PI2} from '../../../utils/number.utils';

export class Pico extends PhysicBall2 implements Item2Scene, ItemSystem {
  constructor(x: number, y: number) {
    super({x, y}, 10);
  }

  isStatic = true;
  sceneId: number = 0;
  scenePriority: number = 0;
  isUpdated: boolean = true;

  draw2d(scene: Scene2d, time: number): void {
    const {ctx} = scene;
    ctx.translate(this.x, this.y)
    ctx.rotate(this.r);
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, PI2);
    ctx.fillStyle = "red";
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
  }
}