import {Circle} from '../shapes/circle';
import {Drawable, Scene2d, Updatable} from '../scene2d';
import {Vector2} from '../geometry/vector2';
import {Starship} from './starship';

export class Asteroid extends Circle implements Drawable<Scene2d>, Updatable<Scene2d> {
  constructor(public x: number, public y: number, private starship: Starship, private owner: string, private touchedListener: Function) {
    super(x, y, 50);
    this.velocity = new Vector2(Math.random() * 10 - 5, Math.random() * 10 - 5);
  }

  draw({ctx}: Scene2d, time: number): void {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(100,100,100,0.5)";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  update({ctx: {canvas: {width, height}}}: Scene2d, time: number): void {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    const vectorCheck = new Vector2(this.x - this.starship.x, this.y - this.starship.y);

    if (vectorCheck.length < (this.radius + this.starship.radius)) {
      this.starship.isTouched();
      if (this.touchedListener) {
        this.touchedListener();
      }
    }
    this.y = this.y > height ? 0 : this.y;
    this.y = this.y < 0 ? height : this.y;
    this.x = this.x > width ? 0 : this.x;
    this.x = this.x < 0 ? width : this.x;
  }
}