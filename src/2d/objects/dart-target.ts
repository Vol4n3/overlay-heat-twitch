import {Scene2d, Scene2DItem} from '../core/scene2d';
import {Circle2} from '../geometry/circle2';
import {Vector2} from '../geometry/vector2';

const PI2 = Math.PI * 2;
const parts: number[] = [6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5, 20, 1, 18, 4, 13];
const vectorToPoint: number[] = [11, 14, 9, 12, 5, 20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11]
const greenCell = "rgba(5,124,46,0.74)";
const redCell = "rgba(198,3,3,0.6)";
const targetSize = 200;
const scorePadding = 40;
const maxPointsRadius = targetSize - scorePadding;
const greenCenterRadius = 15;
const redCenterRadius = 7;
const extraPointSize = 10;
const maxRadiusDoublePoint = maxPointsRadius;
const maxRadiusTriplePoint = targetSize - 100;

export class DartTarget extends Circle2 implements Scene2DItem {
  velocity = new Vector2(0, 0);

  constructor(x: number, y: number) {
    super(x, y, targetSize);
  }

  sceneId: number = 0;
  scenePriority: number = 0;

  draw({ctx}: Scene2d, time: number): void {
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(this.rotation);
    this.drawCircle(ctx);
    this.writeNumbers(ctx);
    this.drawCones(ctx);
    this.drawGreenCenter(ctx);
    this.drawCenter(ctx);
    this.drawExtraPoint(ctx, maxRadiusDoublePoint);
    this.drawExtraPoint(ctx, maxRadiusTriplePoint);
  }

  update(scene: Scene2d, time: number): void {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.bounceBoundary(targetSize, scene.ctx.canvas.width - targetSize, targetSize, scene.ctx.canvas.height - targetSize);
    if (time % 300 < 1) {
      this.velocity.x += Math.random() * 6 - 3;
      this.velocity.y += Math.random() * 6 - 3;
      this.velocity.b.setRange(-3, 3, -3, 3);
    }

  }

  drawCenter(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = redCell;
    ctx.arc(0, 0, redCenterRadius, 0, PI2)
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  drawCircle(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, PI2);
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
      ctx.moveTo(0, 0);
      const offset = Math.PI / 4;
      ctx.arc(0, 0,
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
      ctx.arc(0, 0,
        position,
        min, max
      );
      ctx.arc(0, 0,
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
    ctx.arc(0, 0, greenCenterRadius, 0, PI2)
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

  writeNumbers(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px Arial";
    parts.forEach((num, index) => {
      const x = Math.cos((Math.PI / 10) * index) * (this.radius - 20);
      const y = Math.sin((Math.PI / 10) * index) * (this.radius - 20);
      ctx.fillText(num.toString(10), x, y);
    })
    ctx.closePath();
    ctx.restore();
  }
}