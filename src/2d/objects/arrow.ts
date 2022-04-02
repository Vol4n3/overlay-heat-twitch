import {Circle2} from '../geometry/circle2';
import {Scene2d, Scene2DItem} from '../scene2d';
import {Vector2} from '../geometry/vector2';
import {DartTarget} from './dart-target';

export class Arrow extends Circle2 implements Scene2DItem {
  constructor(x: number, y: number, private target: DartTarget) {
    super(x, y, 70);
  }

  public onTouched: () => Promise<number> = () => {
    return new Promise<number>(resolve => {
      const refInterval = setInterval(() => {
        if (this.isMissed) {
          clearInterval(refInterval);
          return;
        }
        if (this.isTouched) {
          if(!this.targetVector){
            clearInterval(refInterval);
            return
          }
          resolve(this.target.getScore(this.targetVector));
          clearInterval(refInterval);
        }
      }, 200)
    })
  };
  private isMissed: boolean = false;
  private isTouched: boolean = false;
  private targetVector: Vector2 | null = null;

  draw({ctx}: Scene2d, time: number): void {
    ctx.beginPath()
    for (let i = 0; i < 4; i++) {
      ctx.moveTo(this.position.x, this.position.y);
      const plume = Vector2.createFromAngle(
        ((Math.PI / 2) * i) + this.rotation,
        this.radius)
      ctx.lineTo(this.position.x + plume.x, this.position.y + plume.y);
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.isTouched ? "yellow" : this.isMissed ? "rgba(0,0,0,0.5)" : "yellow";
    ctx.stroke();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
    if ( this.isMissed) {
      return;
    }
    if (this.isTouched && this.targetVector) {
      this.position.x = this.target.position.x + this.targetVector.x;
      this.position.y = this.target.position.y + this.targetVector.y;
      return;
    }
    if (this.radius > 15) {
      this.rotation += Math.round(Math.random() * 100 - 50) / 100;
      this.radius -= 10;
    } else {
      this.targetVector = new Vector2(this.position.x - this.target.position.x, this.position.y - this.target.position.y);
      if (this.targetVector.length < this.target.radius && !this.isTouched) {
        this.isTouched = true;
      } else {
        this.isMissed = true;
      }
    }
  }

}