export class Circle2 {
  constructor(private _x: number, private _y: number, public radius: number) {
  }


  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }
}