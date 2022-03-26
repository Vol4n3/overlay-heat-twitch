export interface Drawable<T> {
  draw(scene: T, time: number): void;
}

export interface Updatable<T> {
  update(scene: T, time: number): void;
}

interface WithId<T> {
  id: number
  item: T,
}

export class Scene2d {
  public readonly ctx: CanvasRenderingContext2D;
  private readonly canvas: HTMLCanvasElement;
  private drawTime: number = 0;
  private drawables: (WithId<Drawable<Scene2d>>)[] = [];
  private refResize = this.resize.bind(this)
  private tickAnimation: number = 0;
  private readonly tickInterval: number = 0;
  private uid: number = 0;
  private updatables: (WithId<Updatable<Scene2d>>)[] = [];
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

  addAll(item: Drawable<Scene2d> & Updatable<Scene2d>): number {
    const id = this.uid++;
    this.drawables.push({item, id})
    this.updatables.push({item, id})
    return id;

  }

  erase(): void {
    this.drawables = [];
    this.updatables = [];
  }

  addDraw(item: Drawable<Scene2d>): number {
    const id = this.uid++;
    this.drawables.push({item, id})
    return id
  }

  addUpdate(item: Updatable<Scene2d>): number {
    const id = this.uid++;
    this.updatables.push({item, id})
    return id;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawables.forEach(d => {
      d.item.draw(this, this.drawTime);
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

  removeAll(index: number): void {
    this.removeDraw(index);
    this.removeUpdate(index);
  }

  removeDraw(index: number): void {
    const findDrawIndex = this.drawables.findIndex(f => f.id === index);
    if (findDrawIndex >= 0) {
      this.drawables.splice(findDrawIndex, 1);
    }
  }

  removeUpdate(index: number): void {
    const findUpdateIndex = this.updatables.findIndex(f => f.id === index);
    if (findUpdateIndex >= 0) {
      this.updatables.splice(findUpdateIndex, 1);
    }
  }

  resize() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
  }

  update() {
    this.updatables.forEach(d => {
      d.item.update(this, this.updateTime)
    });
    this.updateTime++;
  }
}