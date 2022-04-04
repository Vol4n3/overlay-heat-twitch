/**
 *
 * @param x 0 => 1
 * @param y
 * @param width example => 300
 * @param height
 *
 */

export const CoordinateRatioToScreen = (
  x: number, y: number, width: number, height: number
): { x: number, y: number } => {
  return {
    x: Math.round(width * x),
    y: Math.round(height * y)
  }
}
export const AngleFlip = (angle: number): number => {
  return angle > 0 ? angle - Math.PI * 2 : angle + Math.PI * 2;
}
export const AngleKeepRange = (angle: number): number => {
  return Math.abs(angle) >= Math.PI ? AngleFlip(angle) : angle;
}
export const numberRange = (n: number, min: number, max: number): number => {
  return numberMax(numberMin(n, min), max);
}
export const numberMin = (n: number, min: number): number => {
  return n < min ? min : n;
}
export const numberMax = (n: number, max: number): number => {
  return n > max ? max : n;
}