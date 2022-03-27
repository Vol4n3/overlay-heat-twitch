import {Drawable, Scene2d, Updatable} from '../scene2d';
import {Circle} from '../shapes/circle';
import {Vector2} from '../geometry/vector2';
import {EasingFunctions} from '../../utils/easing.utils';
import {AngleKeepRange} from '../../utils/number.utils';

const rotationSpeed = 50;
export class Starship extends Circle implements Drawable<Scene2d>, Updatable<Scene2d> {
  destinationRotation: number | null = null;
  origin: Vector2 | null = null;
  originRotation: number | null = null;
  rotation = 0;
  rotationTime: number | null = null;
  target: Vector2 | null = null;

  constructor(x: number, y: number, public owner: string = "") {
    super(x, y, 50);
  }

  draw({ctx}: Scene2d, time: number): void {
    ctx.save();
    ctx.translate(-this.radius, -this.radius);
    ctx.translate(this.position.x, this.position.y)
    ctx.translate(this.radius, this.radius);
    ctx.rotate(this.rotation);
    ctx.translate(-this.radius, -this.radius);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.radius * 2, this.radius);
    ctx.lineTo(0, this.radius * 2);
    ctx.lineTo(this.radius / 2, this.radius);
    ctx.fillStyle = "rgba(255,0,0,0.5)";
    //ctx.rect(0,0,this.radius * 2,this.radius * 2);
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "26px Arial";
    ctx.fillText(this.owner, this.radius, this.radius);
    ctx.restore();
  }

  isTouched(): void {
    this.owner = "";
    this.velocity = new Vector2(0, 0);
  }

  update(scene: Scene2d, time: number): void {
    const {ctx} = scene;
    const {width, height} = ctx.canvas;
    this.position.translateFrom(this.velocity)
    this.position.teleportBoundary(
      0 - this.radius,
      width + this.radius,
      0 - this.radius,
      height + this.radius);
    this.velocity = Vector2.createFromAngle(this.rotation, 7);

    if (this.target) {
      const vectorDestination = this.target.createFromVectorDiff(this.position);
      this.originRotation = this.rotation;
      this.destinationRotation = AngleKeepRange(vectorDestination.angle - this.originRotation);
      this.rotationTime = time + rotationSpeed;
      this.target = null;
    }
    if (this.destinationRotation !== null && this.originRotation !== null && this.rotationTime !== null) {
      const ratio = ((time - this.rotationTime) / rotationSpeed) + 1;
      if (ratio >= 1) {
        this.destinationRotation = null;
        this.originRotation = null;
        this.rotationTime = null;
      } else {
        this.rotation = this.originRotation + (EasingFunctions.easeInOutCubic(ratio) * this.destinationRotation);
      }
    }
  }

}