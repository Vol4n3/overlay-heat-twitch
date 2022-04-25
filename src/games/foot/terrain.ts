import {Item2Scene, Scene2d} from '../../2d/core/scene2d';

const padding = 50;

export class Terrain implements Item2Scene {
  sceneId: number = 0;
  scenePriority: number = 0;
  isUpdated: boolean = true;
  draw2d(scene: Scene2d, time: number): void {
    const {ctx, canvas} = scene;
    const {width, height} = canvas;
    const w = width - padding;
    const h = height - padding;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.5
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(w, padding);
    ctx.lineTo(w, h);
    ctx.lineTo(padding, h);
    ctx.lineTo(padding, padding)
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(width / 2, padding);
    ctx.lineTo(width / 2, h)
    ctx.stroke();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
  }

}