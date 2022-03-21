import {Vector2} from '../geometry/vector2';


export class Circle extends Vector2{
  public rotation: number = 0;
  public velocity: Vector2 = new Vector2(0,0);
  constructor(public x: number,public y:number,public radius:number) {
    super(x,y);
  }

}