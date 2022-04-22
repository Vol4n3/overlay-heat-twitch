import {PhysicBall2} from '../physics/physic-ball2';
import {HoopSegment} from './hoop-segment';
import {Item2Scene, Scene2d} from '../core/scene2d';
import {PI2} from '../../utils/number.utils';
import {Segment2} from '../geometry/segment2';
import {Rectangle2} from '../geometry/rectangle2';

export class BasketBall extends PhysicBall2 implements Item2Scene {
  constructor(
    x: number,
    y: number,
    public hoopSegment: HoopSegment,
    private texture?: null | CanvasPattern) {
    super({x, y}, 30);
    this.gravity.y = 0.4;
  }

  onPanier: ((owner: string) => void) | null = null;
  public owner = "";
  sceneId: number = 0;
  scenePriority: number = 0;

  draw2d(scene: Scene2d, time: number): void {
    const {ctx} = scene;

    ctx.translate(-this.r, -this.r);
    ctx.translate(this.x, this.y)
    ctx.translate(this.r, this.r);

    ctx.rotate(this.rotation);
    ctx.translate(-this.r, -this.r);


    ctx.beginPath();
    ctx.arc(this.r, this.r, this.r, 0, PI2);
    if (this.texture) {
      ctx.fillStyle = this.texture;
      ctx.globalAlpha = 0.75;
    }
    ctx.fill();
    ctx.closePath();
    scene.writeText({
      fillStyle: "white",
      y: this.r,
      x: this.r,
      textBaseline: "middle",
      textAlign: "center",
      text: this.owner
    })
  }

  update(scene: Scene2d, time: number): void {
    const {width, height} = scene.canvas;
    this.bounceBoundary(new Rectangle2(this.r, -5000, width - this.r, height - this.r), {
      x: 0.9,
      y: 0.6
    });
    this.applyPhysics();

    const intersection = this.hoopSegment.intersect(new Segment2(this, {
      x: this.x + this.velocity.x,
      y: this.y + this.velocity.y
    }));
    if (intersection) {
      if (this.velocity.y > 0) {
        if (this.onPanier !== null) {
          this.onPanier(this.owner)
        }
      }
    }
  }
}