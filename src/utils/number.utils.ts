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
export const AngleKeepRange = (n: number): number => {
  return Math.abs(n) > Math.PI ? n > 0 ? n - Math.PI * 2 : n + Math.PI * 2 : n;
}