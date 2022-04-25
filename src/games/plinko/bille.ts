import {Item2Scene, ItemSystem, Scene2d} from '../../2d/core/scene2d';
import {PhysicBall2} from '../../2d/physics/physic-ball2';
import {PI2} from '../../utils/number.utils';

export class Bille extends PhysicBall2 implements Item2Scene, ItemSystem {
  constructor(x: number, y: number, owner: string) {
    super({x, y}, 20);
    this.gravity.y = 0.5;
  }

  sceneId: number = 0;
  scenePriority: number = 0;
  isUpdated: boolean = true;

  draw2d(scene: Scene2d, time: number): void {
    const {ctx} = scene;
    ctx.translate(this.x, this.y)
    ctx.rotate(this.r);
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, PI2);
    ctx.fillStyle = "grey";
    ctx.fill();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
    this.isUpdated = true;
    this.applyPhysics();
  }

}