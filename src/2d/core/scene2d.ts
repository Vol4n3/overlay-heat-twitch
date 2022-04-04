export interface Scene2DItem {
  sceneId: number;
  scenePriority: number;

  draw(scene: Scene2d, time: number): void;

  update(scene: Scene2d, time: number): void;
}


export type canvasWriteTextConfig = {
  fillStyle?: string | CanvasGradient | CanvasPattern;
  strokeStyle?: string | CanvasGradient | CanvasPattern;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  direction?: CanvasDirection;
  text: string;
  font?: string;
  x: number;
  y: number;
  lineWidth?: number;
}

export class Scene2d {
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

  public readonly canvas: HTMLCanvasElement;
  public readonly ctx: CanvasRenderingContext2D;
  private drawTime: number = 0;
  private items: Scene2DItem[] = [];
  private refResize = this.resize.bind(this)
  private tickAnimation: number = 0;
  private readonly tickInterval: number = 0;
  private uid: number = 100;
  private updateTime: number = 0;

  addItem(item: Scene2DItem, order?: number) {
    const id = this.uid++;
    item.sceneId = id;
    item.scenePriority = order || id;
    this.items.push(item);
    this.items = this.items.sort((a, b) => b.scenePriority - a.scenePriority);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.items.forEach(d => {
      this.ctx.save();
      d.draw(this, this.drawTime);
      this.ctx.restore();
    });
    this.drawTime++;
    this.tickAnimation = requestAnimationFrame(this.animate.bind(this))
  }

  writeText(config: canvasWriteTextConfig) {
    this.ctx.save();
    if (config.fillStyle) this.ctx.fillStyle = config.fillStyle;
    if (config.strokeStyle) this.ctx.strokeStyle = config.strokeStyle;
    if (config.textAlign) this.ctx.textAlign = config.textAlign;
    if (config.direction) this.ctx.direction = config.direction;
    if (config.textBaseline) this.ctx.textBaseline = config.textBaseline;
    if (config.lineWidth) this.ctx.lineWidth = config.lineWidth;
    this.ctx.font = config.font || "26px Arial";
    if (config.fillStyle) this.ctx.fillText(config.text, config.x, config.y);
    if (config.strokeStyle) this.ctx.strokeText(config.text, config.x, config.y);
    this.ctx.restore();
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
    return this.items.find(f => f.sceneId === id);
  }

  removeItem(item: Scene2DItem): void {
    const findDrawIndex = this.items.findIndex(f => f.sceneId === item.sceneId);
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
      d.update(this, this.updateTime)
    });
    this.updateTime++;
  }
}