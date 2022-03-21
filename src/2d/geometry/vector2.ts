import {VectorLength} from '../../utils/vector.utils';

export class Vector2 {
  constructor(public x: number,public y:number) {
  }
  static createWithAngleLength(angle: number,length:number): Vector2{
    return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length)
  }
  translate(x:number,y: number){
    this.x += x;
    this.y += y;
  }
  get length(): number{
    return VectorLength([this.x,this.y]);
  }
  get angle(): number {
    return Math.atan2(this.y, this.x);
  }
  set angle(angle) {
    const length = this.length;
    this.translate(Math.cos(angle) * length, Math.sin(angle) * length)
  }
}