import {Scene2d, Scene2DItem} from '../core/scene2d';
import {Circle2} from '../geometry/circle2';
import {CanCollide} from '../core/collider';

const img = new Image();
let loaded = false;
img.onload = () => {
  loaded = true;
}
img.src = "/overlay-heat-twitch/assets/texture_ballon.jpg";

export class Ballon extends Circle2 implements Scene2DItem, CanCollide {


  collisionId: number = 0;

  detection(item: CanCollide): void {
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
    this.position.operation('add', this.direction);
    this.direction.b.operation("multiply", 0.98);
    this.bounceBoundary(0, scene.canvas.width, 0, scene.canvas.height)
  }

  private texture: null | CanvasPattern = null
}