import {DartTarget} from './objects/dart-target';

export interface Drawable<T> {
  draw(scene: T, time: number): void;
}

export interface Updatable<T> {
  update(scene: T, time: number): void;
}

export class Scene2d {
  public readonly ctx: CanvasRenderingContext2D;
  public target: DartTarget | null = null;
  private readonly canvas: HTMLCanvasElement;
  private drawTime: number = 0;
  private drawables: (Drawable<Scene2d> | null)[] = [];
  private refResize = this.resize.bind(this)
  private tickAnimation: number = 0;
  private readonly tickInterval: number = 0;
  private updatables: (Updatable<Scene2d> | null)[] = [];
  private updateTime: number = 0;

  constructor(private container: HTMLDivElement, updateInterval: number = 1000) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    container.appendChild(this.canvas);
    window.addEventListener('resize', this.refResize);
    this.resize();
    this.animate();
    this.tickInterval = window.setInterval(this.update.bind(this), updateInterval);
  }

  addAll(item: Drawable<Scene2d> & Updatable<Scene2d>): number[] {
    return [
      this.drawables.push(item),
      this.updatables.push(item)
    ]

  }

  addDraw(item: Drawable<Scene2d>): number {
    return this.drawables.push(item)
  }

  addUpdate(item: Updatable<Scene2d>): number {
    return this.updatables.push(item)
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawables.forEach(d => {
      if (d === null) {
        return;
      }
      d.draw(this, this.drawTime);
    });
    this.drawTime++;
    this.tickAnimation = requestAnimationFrame(this.animate.bind(this))
  }

  destroy() {
    this.container.removeChild(this.canvas);
    window.removeEventListener('resize', this.refResize);
    window.clearInterval(this.tickInterval);
    window.cancelAnimationFrame(this.tickAnimation);
  }

  removeAll(index: number[]): void {
    this.drawables[index[0]] = null;
    this.updatables[index[1]] = null;
  }

  removeDraw(index: number): void {
    this.drawables[index] = null;
  }

  removeUpdate(index: number): void {
    this.updatables[index] = null;
  }

  resize() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
  }

  update() {
    this.updatables.forEach(d => {
      if (d === null) {
        return;
      }
      d.update(this, this.updateTime)
    });
    this.updateTime++;
  }
}