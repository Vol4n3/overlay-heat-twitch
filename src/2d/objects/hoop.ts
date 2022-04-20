import {Item2Scene, Scene2d} from '../core/scene2d';
import {PI2} from '../../utils/number.utils';
import {CollisionCircle} from '../physics/collision-circle';

export class Hoop extends CollisionCircle implements Item2Scene {
  isStatic = true;
  mass = 3;
  sceneId: number = 0;
  scenePriority: number = 0;

  constructor(x: number, y: number, radius: number) {
    super({x, y}, radius);
  }

  draw2d(scene: Scene2d, time: number): void {
    const {ctx} = scene;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, PI2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
  }

}