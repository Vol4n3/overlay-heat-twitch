import {Circle} from '../shapes/circle';
import {Drawable, Scene2d, Updatable} from '../scene2d';
import {Vector2} from '../geometry/vector2';
import {Starship} from './starship';

export class Asteroid extends Circle implements Drawable<Scene2d>, Updatable<Scene2d> {
  constructor(x: number, y: number, private starship: Starship, private owner: string, private touchedListener: Function) {
    super(x, y, 50);
    this.velocity = new Vector2(Math.random() * 10 - 5, Math.random() * 10 - 5);
  }

  draw({ctx}: Scene2d, time: number): void {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(100,100,100,0.5)";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  update({ctx: {canvas: {width, height}}}: Scene2d, time: number): void {
    this.position.translateFrom(this.velocity);
    this.position.teleportBoundary(0, width, 0, height);
    const vectorCheck = this.position.createFromVectorDiff(this.starship.position);
    if (vectorCheck.length < (this.radius + this.starship.radius)) {
      this.starship.isTouched();
      if (this.touchedListener) {
        this.touchedListener();
      }
    }
  }
}