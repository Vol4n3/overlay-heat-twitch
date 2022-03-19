export interface Drawable<T> {
  draw(scene: T,time: number): void;
}
export interface Updatable<T>{
  update(scene: T, time: number): void;
}

export class Scene2d {
  private readonly canvas: HTMLCanvasElement = document.createElement('canvas');
  public readonly ctx: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  private drawables: Drawable<Scene2d>[] = [];
  private updatables: Updatable<Scene2d>[] = [];
  private drawTime: number = 0;
  private updateTime: number = 0;
  private refAnimation: number = 0;
  private refInterval: number = 0;
  constructor(private container: HTMLDivElement,updateInterval:number = 1000) {
    container.appendChild(this.canvas);
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    this.animate();
    this.refInterval = window.setInterval(this.update.bind(this),updateInterval);
  }

  addAll(item: Drawable<Scene2d> & Updatable<Scene2d>){
    this.drawables.push(item);
    this.updatables.push(item);
  }
  addDraw(item: Drawable<Scene2d>) {
    this.drawables.push(item)
  }

  addUpdate(item: Updatable<Scene2d>) {
    this.updatables.push(item)
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawables.forEach(d => d.draw(this,this.drawTime));
    this.drawTime++;
    this.refAnimation = requestAnimationFrame(this.animate.bind(this))
  }
  update(){
    this.updatables.forEach(d => d.update(this,this.updateTime));
    this.updateTime++;
  }
  destroy() {
    this.container.removeChild(this.canvas);
    window.removeEventListener('resize', this.resize.bind(this));
    window.clearInterval(this.refInterval);
    window.cancelAnimationFrame(this.refAnimation);
  }

  resize() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
  }
}