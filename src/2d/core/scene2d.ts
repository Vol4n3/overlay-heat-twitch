export interface Scene2DItem {
  draw(scene: Scene2d, time: number): void;

  update(scene: Scene2d, time: number): void;
}

interface WithId<T> {
  id: number
  item: T,
  priority: number;
}

export class Scene2d {
  public readonly canvas: HTMLCanvasElement;
  public readonly ctx: CanvasRenderingContext2D;
  private drawTime: number = 0;
  private items: (WithId<Scene2DItem>)[] = [];
  private refResize = this.resize.bind(this)
  private tickAnimation: number = 0;
  private readonly tickInterval: number = 0;
  private uid: number = 100;
  private updateTime: number = 0;

  constructor(private container: HTMLDivElement, updateInterval: number = 30) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.display = "block";
    this.canvas.style.position = "absolute";
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    container.appendChild(this.canvas);
    window.addEventListener('resize', this.refResize);
    this.resize();
    this.animate();
    this.tickInterval = window.setInterval(this.update.bind(this), updateInterval);
  }

  addItem(item: Scene2DItem, order?: number): number {
    const id = this.uid++;
    this.items.push({item, id, priority: order || id});
    this.items = this.items.sort((a, b) => b.priority - a.priority);
    return id;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.items.forEach(d => {
      this.ctx.save();
      d.item.draw(this, this.drawTime);
      this.ctx.restore();
    });
    this.drawTime++;
    this.tickAnimation = requestAnimationFrame(this.animate.bind(this))
  }

  cleanItems(): void {
    this.items = [];
    this.uid = 100;
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