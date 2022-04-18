import {Scene2d, Scene2DItem} from '../core/scene2d';
import {Segment2} from '../geometry/segment2';

export class HoopSegment extends Segment2 implements Scene2DItem {
  sceneId: number = 0;
  scenePriority: number = 0;

  draw({ctx}: Scene2d, time: number): void {
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.strokeStyle = "red";
    ctx.globalAlpha = 0.20;
    ctx.lineWidth = 10;
    ctx.stroke()
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
  }

}