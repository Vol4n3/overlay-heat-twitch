import {Drawable, Scene2d, Updatable} from '../scene2d';
import {Point} from '../../types/point.types';

export class Ballon implements Drawable<Scene2d>, Point, Updatable<Scene2d> {
  private radius = 50;
  private rand = Math.round(Math.random() * 100000);
  constructor(public x: number, public y: number) {
  }

  draw({ctx}: Scene2d, time: number) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update(_: Scene2d, time: number): void {
    this.x += (Math.cos((time + this.rand) / 1000) * 10)
    this.y += 5;
  }
}