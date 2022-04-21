import {OldPhysicBall2} from '../physics/old-physic-ball2';
import {Item2Scene, Scene2d} from '../core/scene2d';
import {CanCollide} from '../core/collider';
import {Asteroid} from './asteroid';
import {PI2} from '../../utils/number.utils';


export class Bullet extends OldPhysicBall2 implements Item2Scene, CanCollide {
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

  draw2d({ctx}: Scene2d, time: number): void {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, PI2);
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