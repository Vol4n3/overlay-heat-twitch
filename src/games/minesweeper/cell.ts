import {Rectangle2} from '../../2d/geometry/rectangle2';
import {Item2Scene, Scene2d} from '../../2d/core/scene2d';

export class Cell extends Rectangle2 implements Item2Scene {
  constructor(x: number, y: number, size: number, private border: number) {
    super(x, y, size, size);
  }

  public hasMine: boolean = false;
  isUpdated: boolean = true;
  sceneId: number = 0;
  scenePriority: number = 0;

  draw2d(scene: Scene2d, time: number): void {
    const {ctx} = scene;
    ctx.translate(this.x, this.y)
    ctx.beginPath();
    ctx.rect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.fillStyle = this.getColor();
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = "white";
    ctx.lineWidth = this.border;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    if (!this.hasMine && this.nearMineCount !== 0) {
      scene.writeText({
        y: 3, text: '' + this.nearMineCount, x: 0, fillStyle: "white",
        textBaseline: 'middle',
        textAlign: 'center',
        font: (this.h - 4) + "px Arial"
      })
    }

  }

  update(scene: Scene2d, time: number): void {
  }

  public nearMineCount: number = 0;

  getColor(): string {
    if (this.hasMine) {
      return '#ffbb00';
    }
    switch (this.nearMineCount) {
      case 0:
      default:
        return '#ccc';
      case 1:
        return '#009c05'
      case 2:
        return '#009c65'
      case 3:
        return '#006b9c'
      case 4:
        return '#002c9c'
      case 5:
        return '#41009c'
      case 6:
        return '#75009c'
      case 8:
        return '#9c0022'
      case 7:
        return '#9c2200'
    }
  }

  incrementNearMine() {
    this.nearMineCount += 1;
  }

}