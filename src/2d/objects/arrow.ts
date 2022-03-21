import {Circle} from '../shapes/circle';
import {Drawable, Scene2d, Updatable} from '../scene2d';
import {Vector2} from '../geometry/vector2';
import {DartTarget} from './dart-target';

export class Arrow extends Circle implements Drawable<Scene2d>, Updatable<Scene2d> {
  public onTouched: () => Promise<number> = () => {
    return new Promise<number>(resolve => {
      const refInterval = setInterval(() => {
        if(this.isMissed){
          clearInterval(refInterval);
          return;
        }
        if (this.isTouched) {
          if(!this.targetVector){
            clearInterval(refInterval);
            return
          }
          resolve(DartTarget.getScore(this.targetVector));
          clearInterval(refInterval);
        }
      }, 200)
    })
  };
  private isMissed: boolean = false;
  private isTouched: boolean = false;
  private targetVector: Vector2 | null = null;

  draw({ctx}: Scene2d, time: number): void {
    ctx.save()
    ctx.beginPath()
    for (let i = 0; i < 4; i++) {
      ctx.moveTo(this.x, this.y);
      const plume = Vector2.createWithAngleLength(
        ((Math.PI / 2) * i) + this.rotation,
        this.radius)
      ctx.lineTo(this.x + plume.x, this.y + plume.y);
    }
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.isTouched ? "yellow" : "rgba(0,0,0,0.4)";
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  update(scene: Scene2d, time: number): void {
    const target = scene.target;
    if (!target || this.isMissed) {
      return;
    }
    if (this.isTouched && this.targetVector) {
      this.x = target.x + this.targetVector.x;
      this.y = target.y + this.targetVector.y;
      return;
    }
    if (this.radius > 20) {
      this.rotation += Math.round(Math.random() * 100 - 50) / 100;
      this.radius -= 10;
    } else {
      this.targetVector = new Vector2(this.x - target.x, this.y - target.y);
      if (this.targetVector.length < target.radius && !this.isTouched) {
        this.isTouched = true;
      } else {
        this.isMissed = true;
      }
    }
  }

}