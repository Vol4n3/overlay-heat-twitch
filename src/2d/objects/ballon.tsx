import {Scene2d, Scene2DItem} from '../core/scene2d';
import {Circle2} from '../geometry/circle2';
import {CanCollide} from '../core/collider';
import {PlayerSoccer} from './player-soccer';
import {Vector2} from '../geometry/vector2';
import {AngleKeepRange, PI2} from '../../utils/number.utils';

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
        this.playerShoot(item)
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
        this.texture?.setTransform(new DOMMatrix().scale(0.25, 0.25));
      }
    }
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
  }

  playerShoot(player: PlayerSoccer): void {
    const directionBall = new Vector2(this.x - player.x, this.y - player.y);
    const velocityDiff = new Vector2(player.calculatedVelocity.x + this.velocity.x, player.calculatedVelocity.y + this.velocity.y);
    directionBall.length = velocityDiff.length * 0.95;
    this.velocity = directionBall;
  }

  private texture: null | CanvasPattern = null

  update(scene: Scene2d, time: number): void {
    const padding = 50;
    this.bounceBoundary(padding, scene.canvas.width - padding, padding, scene.canvas.height - padding, 0.9);
    this.position.operation('add', this.velocity);
    const roundedX = Math.round(this.velocity.x * 100) / 100;
    this.rotation += AngleKeepRange(((roundedX) / 200));

    this.velocity.b.operation("multiply", 0.99);

  }
}