import {Circle2} from '../geometry/circle2';
import {Scene2d, Scene2DItem} from '../scene2d';


export class Bullet extends Circle2 implements Scene2DItem {
  draw({ctx}: Scene2d, time: number): void {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.shadowColor = 'yellow';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
    this.position.operation("add", this.direction);
    this.position.teleportBoundary(0, scene.ctx.canvas.width, 0, scene.ctx.canvas.height);
  }
}