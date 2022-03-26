import {Drawable, Scene2d, Updatable} from '../scene2d';
import {Circle} from '../shapes/circle';
import {Vector2} from '../geometry/vector2';

const PI2 = Math.PI * 2;
const parts: number[] = [6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5, 20, 1, 18, 4, 13];
const vectorToPoint: number[] = [11, 14, 9, 12, 5, 20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11]
const greenCell = "rgba(5,124,46,0.74)";
const redCell = "rgba(198,3,3,0.6)";
const targetSize = 160;
const scorePadding = 30;
const maxPointsRadius = targetSize - scorePadding;
const greenCenterRadius = 15;
const redCenterRadius = 7;
const extraPointSize = 10;
const maxRadiusDoublePoint = maxPointsRadius;
const maxRadiusTriplePoint = targetSize - 100;

export class DartTarget extends Circle implements Drawable<Scene2d>, Updatable<Scene2d> {
  velocity = new Vector2(0, 0);

  constructor(x: number, y: number) {
    super(x, y, targetSize);
  }

  draw({ctx}: Scene2d, time: number): void {
    this.drawCircle(ctx);
    this.writeNumbers(ctx);
    this.drawCones(ctx);
    this.drawGreenCenter(ctx);
    this.drawCenter(ctx);
    this.drawExtraPoint(ctx, maxRadiusDoublePoint);
    this.drawExtraPoint(ctx, maxRadiusTriplePoint);
  }

  drawCenter(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = redCell;
    ctx.arc(this.x, this.y, redCenterRadius, 0, PI2)
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  drawCircle(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, PI2);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  drawCones(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    parts.forEach((_, index) => {
      ctx.beginPath();
      ctx.fillStyle = index % 2 ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";
      ctx.moveTo(this.x, this.y);
      const offset = Math.PI / 4;
      ctx.arc(this.x, this.y,
        maxPointsRadius,
        (Math.PI / 10) * index + offset,
        offset + (Math.PI / 10) * (index + 1));
      ctx.fill();
      ctx.closePath();
    });
    ctx.restore();
  }

  drawExtraPoint(ctx: CanvasRenderingContext2D, position: number): void {
    parts.forEach((_, index) => {
      ctx.save();
      ctx.beginPath();
      const offset = Math.PI / 20;
      const counter = Math.PI / 10;
      const min = (counter * index - offset);
      const max = (counter * (index + 1) - offset);
      ctx.fillStyle = index % 2 ? redCell : greenCell;
      ctx.arc(this.x, this.y,
        position,
        min, max
      );
      ctx.arc(this.x, this.y,
        position - extraPointSize,
        max,
        min,
        true);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black"
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    })
  }

  drawGreenCenter(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = greenCell;
    ctx.arc(this.x, this.y, greenCenterRadius, 0, PI2)
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  getScore(vector: Vector2): number {
    const length = vector.length
    if (length > maxPointsRadius) {
      return 0;
    }
    if (length < redCenterRadius) {
      return 50
    }
    if (length < greenCenterRadius) {
      return 25
    }
    const indexPoint = Math.round((vector.angle + Math.PI + (Math.PI / 2)) / (Math.PI / 10) - 5);
    const score = vectorToPoint[indexPoint];
    if (length < maxRadiusDoublePoint && length > (maxRadiusDoublePoint - extraPointSize)) {
      return score * 2;
    }
    if (length < maxRadiusTriplePoint && length > (maxRadiusTriplePoint - extraPointSize)) {
      return score * 3;
    }
    return score;
  }

  update(scene: Scene2d, time: number): void {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if (time % 300 < 1) {
      this.velocity.x += Math.random() * 6 - 3;
      this.velocity.y += Math.random() * 6 - 3;
      this.velocity.x = this.velocity.x > 3 ? 3 : this.velocity.x;
      this.velocity.y = this.velocity.y > 3 ? 3 : this.velocity.y;
      this.velocity.x = this.velocity.x < -3 ? -3 : this.velocity.x;
      this.velocity.y = this.velocity.y < -3 ? -3 : this.velocity.y;
    }
    if (this.x > (scene.ctx.canvas.width - targetSize) || this.x < targetSize) {
      this.velocity.x *= -1
      if (this.x > (scene.ctx.canvas.width - targetSize)) {
        this.x = (scene.ctx.canvas.width - targetSize)
      }
      if (this.x < targetSize) {
        this.x = targetSize
      }
    }
    if (this.y > (scene.ctx.canvas.height - targetSize) || this.y < targetSize) {
      this.velocity.y *= -1
      if (this.y > (scene.ctx.canvas.height - targetSize)) {
        this.y = (scene.ctx.canvas.height - targetSize)
      }
      if (this.y < targetSize) {
        this.y = targetSize
      }
    }
  }

  writeNumbers(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "16px Arial";
    parts.forEach((num, index) => {
      const x = this.x + Math.cos((Math.PI / 10) * index) * (this.radius - 15);
      const y = this.y + Math.sin((Math.PI / 10) * index) * (this.radius - 15);
      ctx.fillText(num.toString(10), x, y);
    })
    ctx.closePath();
    ctx.restore();
  }

}