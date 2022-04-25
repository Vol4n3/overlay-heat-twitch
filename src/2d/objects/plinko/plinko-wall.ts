import {PhysicWall2} from '../../physics/physic-wall2';
import {Item2Scene, Scene2d} from '../../core/scene2d';


export class PlinkoWall extends PhysicWall2 implements Item2Scene {
  sceneId: number = 0;
  scenePriority: number = 0;
  isUpdated: boolean = true;

  draw2d(scene: Scene2d, time: number): void {
    const {ctx} = scene;
    ctx.beginPath();
    ctx.moveTo(this.minX, this.minY);
    ctx.lineTo(this.maxX, this.maxY);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    ctx.stroke()
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
  }

}