import {Circle2} from '../geometry/circle2';
import {Scene2d, Scene2DItem} from '../core/scene2d';
import {CanCollide} from '../core/collider';
import {Asteroid} from './asteroid';


export class Bullet extends Circle2 implements Scene2DItem, CanCollide {
  constructor(x: number, y: number, public owner: string) {
    super(x, y, 5);
  }

  collisionId: number = 0;

  sceneId: number = 0;
  scenePriority: number = 0;

  detection(item: CanCollide) {
    if (item instanceof Asteroid) {
      item.collideToBullet(this);
    }
  }

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
    this.position.operation("add", this.velocity);
    this.position.teleportBoundary(0, scene.ctx.canvas.width, 0, scene.ctx.canvas.height);
  }
}