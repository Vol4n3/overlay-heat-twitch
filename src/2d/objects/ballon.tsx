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

    const padding = 50;
    this.bounceBoundary(padding, scene.canvas.width - padding, padding, scene.canvas.height - padding, 0.9)
  }

  private texture: null | CanvasPattern = null

  playerShoot(player: PlayerSoccer): void {
    const directionBall = new Vector2(this.x - player.x, this.y - player.y);
    const velocityDiff = new Vector2(this.velocity.x - player.calculatedVelocity.x, this.velocity.y - player.calculatedVelocity.y);
    directionBall.length = velocityDiff.length;
    this.velocity = directionBall;
  }
}