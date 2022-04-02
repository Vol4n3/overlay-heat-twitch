import {Circle2} from '../geometry/circle2';
import {Scene2d, Scene2DItem} from '../scene2d';
import {Vector2} from '../geometry/vector2';
import {Starship} from './starship';

export class Asteroid extends Circle2 implements Scene2DItem {
  constructor(
    x: number,
    y: number,
    private starship: Starship,
    private owner: string,
    private touchedListener: Function,
    direction: Vector2
  ) {
    super(x, y, 50);
    this.direction = direction;
  }

  draw({ctx}: Scene2d, time: number): void {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(100,100,100,0.5)";
    ctx.fill();
    ctx.closePath();
  }

  update({ctx: {canvas: {width, height}}}: Scene2d, time: number): void {
    this.position.operation('add', this.direction);
    this.position.teleportBoundary(0, width, 0, height);
    const vectorCheck = this.position.distanceTo(this.starship.position);
    if (vectorCheck < (this.radius + this.starship.radius)) {
      this.starship.isTouched();
      if (this.touchedListener) {
        this.touchedListener();
      }
    }
  }
}