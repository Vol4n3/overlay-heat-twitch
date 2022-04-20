import {Scene2d, Scene2DItem} from '../core/scene2d';
import {CanCollide} from '../core/collider';
import {PhysicBall2} from '../physics/physic-ball2';
import {PI2} from '../../utils/number.utils';
import {Rectangle2} from '../geometry/rectangle2';
import {Hoop} from './hoop';
import {HoopSegment} from './hoop-segment';
import {Segment2} from '../geometry/segment2';

export class BasketBall extends PhysicBall2 implements Scene2DItem, CanCollide {
  constructor(
    x: number,
    y: number,
    public hoopSegment: HoopSegment,
    private texture?: null | CanvasPattern) {
    super(x, y, 30);
    this.gravity.y = 0.5;
  }

  onPanier: ((owner: string) => void) | null = null;
  public owner = "";
  collisionId: number = 0;

  detection(item: CanCollide): void {
    if (item instanceof BasketBall) {
      const collision = this.isCollisionToCircle(item);
      if (collision) {
        this.circleCollisionResponse(item);
      }
      return;
    }
    if (item instanceof Hoop) {
      const collision = this.isCollisionToCircle(item);
      if (collision) {
        this.circleCollisionResponse(item);
      }
      return;
    }
  }

  sceneId: number = 0;
  scenePriority: number = 0;

  draw(scene: Scene2d, time: number): void {
    const {ctx} = scene;
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, PI2);
    if (this.texture) {
      ctx.fillStyle = this.texture;
      ctx.globalAlpha = 0.75;
    }
    ctx.fill();
    ctx.closePath();
    scene.writeText({
      fillStyle: "white",
      y: 0,
      x: 0,
      textBaseline: "middle",
      textAlign: "center",
      text: this.owner
    })
  }

  update(scene: Scene2d, time: number): void {
    const {width, height} = scene.canvas;
    const intersection = this.hoopSegment.intersect(new Segment2(this.position, {
      x: this.position.x + this.velocity.x,
      y: this.position.y + this.velocity.y
    }));
    if (intersection) {
      if (this.velocity.y > 0) {
        if (this.onPanier !== null) {
          this.onPanier(this.owner)
        }
      }
    }
    this.applyPhysics();
    this.isGrounded = !!this.bounceBoundary(new Rectangle2(this.radius, -5000, width - this.radius, height - this.radius), {
      x: 0.9,
      y: 0.7
    });
  }
}