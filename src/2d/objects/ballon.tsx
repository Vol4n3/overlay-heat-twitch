import {Scene2d, Scene2DItem} from '../core/scene2d';
import {Circle2} from '../geometry/circle2';
import {CanCollide} from '../core/collider';
import {PlayerSoccer} from './player-soccer';
import {Vector2} from '../geometry/vector2';

const img = new Image();
let loaded = false;
img.onload = () => {
  loaded = true;
}
img.src = "/overlay-heat-twitch/assets/texture_ballon.jpg";

export class Ballon extends Circle2 implements Scene2DItem, CanCollide {


  collisionId: number = 0;

  detection(item: CanCollide): void {
    if (item instanceof Ballon) {
      return;
    }
    if (item instanceof PlayerSoccer) {
      const collision = this.isCollisionToCircle(item);
      if (collision) {
        const directionBall = new Vector2(this.x - item.x, this.y - item.y);
        if (item.target) {
          directionBall.length = 5 + (item.target.length / 100);
        } else {
          directionBall.length = 2;
        }
        this.velocity = directionBall;
      }
      return;
    }
  }

  sceneId: number = 0;
  scenePriority: number = 0;

  draw({ctx}: Scene2d, time: number) {
    if (this.texture === null) {
      if (loaded) {
        this.texture = ctx.createPattern(img, "repeat");
        this.texture?.setTransform(new DOMMatrix().scale(0.4, 0.4));
      }
    }
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    if (this.texture) {
      ctx.fillStyle = this.texture;
      ctx.globalAlpha = 0.75;
    }
    ctx.fill();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
    this.position.operation('add', this.velocity);

    this.velocity.b.operation("multiply", 0.98);

    const padding = 150;
    this.bounceBoundary(padding, scene.canvas.width - padding, padding, scene.canvas.height - padding)
  }

  private texture: null | CanvasPattern = null
}