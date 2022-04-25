import {Rectangle2} from '../../2d/geometry/rectangle2';
import {Item2Scene, Scene2d} from '../../2d/core/scene2d';
import {SoccerBall} from './soccerBall';
import {CanCollide} from '../../2d/core/collider';

export class Cage extends Rectangle2 implements Item2Scene, CanCollide {
  isUpdated: boolean = true;

  constructor(x: number, y: number, w: number, h: number, public team: string) {
    super(x, y, w, h);
  }

  collisionId: number = 0;

  detection(item: CanCollide): void {
    if (item instanceof SoccerBall) {
      item.detectGoal(this)
    }

  }

  sceneId: number = 0;
  scenePriority: number = 0;

  draw2d({ctx}: Scene2d) {
    ctx.strokeStyle = this.team;
    ctx.globalAlpha = 0.5
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.stroke();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
  }
}