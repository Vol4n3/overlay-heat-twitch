import {loadImage} from '../../utils/loader.utils';
import {System, Vector} from 'detect-collisions';

export interface Item2Scene {
  sceneId: number;
  scenePriority: number;

  draw2d(scene: Scene2d, time: number): void;

  update(scene: Scene2d, time: number): void;
}

export interface ItemSystem {
  isStatic?: boolean;

  isCollide(other: ItemSystem, overlap: Vector): void;
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
  system = new System();
  fpsInterval;

  constructor(private container: HTMLDivElement, fps: number = 60) {
    this.fpsInterval = 1000 / fps;
    this.then = window.performance.now();
    this.startTime = this.then;
    this.canvas = document.createElement('canvas');
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.display = "block";
    this.canvas.style.position = "absolute";
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    container.appendChild(this.canvas);
    window.addEventListener('resize', this.refResize);
    this.resize();
    this.tickAnimation = requestAnimationFrame(this.animate.bind(this));
  }

  public readonly canvas: HTMLCanvasElement;
  public readonly ctx: CanvasRenderingContext2D;
  private items: Item2Scene[] = [];
  private refResize = this.resize.bind(this)
  private tickAnimation: number = 0;
  private uid: number = 100;
  private loopTime: number = 0;

  addItem(item: Item2Scene, order?: number) {
    const id = this.uid++;
    item.sceneId = id;
    item.scenePriority = order || id;
    this.items.push(item);
    this.items = this.items.sort((a, b) => b.scenePriority - a.scenePriority);
  }

  addMultipleItem(items: Item2Scene[]) {
    items.forEach(i => this.addItem(i))
  }

  async createTexture(url: string, repetition: string | null = null, matrix?: DOMMatrix): Promise<CanvasPattern | null> {
    const image = await loadImage(url);
    const pattern = this.ctx.createPattern(image, repetition)
    if (pattern && matrix) {
      pattern.setTransform(matrix)
    }
    return pattern
  }

  private now: number = 0;
  private elapsed: number = 0;
  private then: number = 0;
  private startTime: number = 0;

  animate(newTime: DOMHighResTimeStamp) {
    this.tickAnimation = requestAnimationFrame(this.animate.bind(this));
    this.now = newTime;
    this.elapsed = this.now - this.then;
    if (this.elapsed > this.fpsInterval) {
      // Get ready for next frame by setting then=now, but...
      // Also, adjust for fpsInterval not being multiple of 16.67
      this.then = this.now - (this.elapsed % this.fpsInterval);
      // draw stuff here
      this.system.checkAll(({a, overlapV, b}) => {
        a.isCollide(b, overlapV);
      });
      this.loopTime++;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.items.forEach(d => {
        d.update(this, this.loopTime);
        this.ctx.save();
        d.draw2d(this, this.loopTime);
        this.ctx.restore();
      });
    }
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
    this.system.clear();
    this.container.removeChild(this.canvas);
    window.removeEventListener('resize', this.refResize);
    window.cancelAnimationFrame(this.tickAnimation);
  }

  getItem(id: number): Item2Scene | undefined {
    return this.items.find(f => f.sceneId === id);
  }

  removeItem(item: Item2Scene): void {
    const findDrawIndex = this.items.findIndex(f => f.sceneId === item.sceneId);
    if (findDrawIndex >= 0) {
      this.items.splice(findDrawIndex, 1);
    }
  }

  resize() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
  }
}