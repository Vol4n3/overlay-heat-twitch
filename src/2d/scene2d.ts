export interface Scene2DItem {
  draw(scene: Scene2d, time: number): void;

  update(scene: Scene2d, time: number): void;
}

interface WithId<T> {
  id: number
  item: T,
}

export class Scene2d {
  public readonly ctx: CanvasRenderingContext2D;
  public readonly canvas: HTMLCanvasElement;
  private drawTime: number = 0;
  private items: (WithId<Scene2DItem>)[] = [];
  private refResize = this.resize.bind(this)
  private tickAnimation: number = 0;
  private readonly tickInterval: number = 0;
  private uid: number = 0;
  private updateTime: number = 0;

  constructor(private container: HTMLDivElement, updateInterval: number = 30) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    container.appendChild(this.canvas);
    window.addEventListener('resize', this.refResize);
    this.resize();
    this.animate();
    this.tickInterval = window.setInterval(this.update.bind(this), updateInterval);
  }

  addItem(item: Scene2DItem): number {
    const id = this.uid++;
    this.items.push({item, id})
    return id;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.items.forEach(d => {
      d.item.draw(this, this.drawTime);
    });
    this.drawTime++;
    this.tickAnimation = requestAnimationFrame(this.animate.bind(this))
  }

  cleanItems(): void {
    this.items = [];
  }

  destroy() {
    this.container.removeChild(this.canvas);
    window.removeEventListener('resize', this.refResize);
    window.clearInterval(this.tickInterval);
    window.cancelAnimationFrame(this.tickAnimation);
  }

  getItem(id: number): Scene2DItem | undefined {
    return this.items.find(f => f.id === id)?.item;
  }

  removeItem(index: number): void {
    const findDrawIndex = this.items.findIndex(f => f.id === index);
    if (findDrawIndex >= 0) {
      this.items.splice(findDrawIndex, 1);
    }
  }

  resize() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
  }

  update() {
    this.items.forEach(d => {
      d.item.update(this, this.updateTime)
    });
    this.updateTime++;
  }
}