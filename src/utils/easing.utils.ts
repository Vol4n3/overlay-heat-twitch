export type EasingCallback = () => number | null;
export type EasingFunction = (n: number) => number;
export const createEasing = (
  easing: EasingFunction,
  startValue: number,
  endValue: number,
  time: number): EasingCallback => {
  let current = 0;
  return () => {
    const ratio = (current++ / time);
    if (ratio > 1) {
      return null
    }
    return startValue + easing(ratio) * (endValue - startValue);
  }
}
export const EasingNames = ["linear", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic",
  "easeOutCubic", "easeInOutCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart",
  "easeInQuint", "easeOutQuint", "easeInOutQuint"] as const;
export type EasingNameType = typeof EasingNames[number];
export const Easing: { [key in EasingNameType]: EasingFunction } = {
  // no easing, no acceleration
  linear: (t: number) => t,
  // accelerating from zero velocity
  easeInQuad: (t: number) => t * t,
  // decelerating to zero velocity
  easeOutQuad: (t: number) => t * (2 - t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  // accelerating from zero velocity
  easeInCubic: (t: number) => t * t * t,
  // decelerating to zero velocity
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: (t: number) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // accelerating from zero velocity
  easeInQuart: (t: number) => t * t * t * t,
  // decelerating to zero velocity
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: (t: number) => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  // accelerating from zero velocity
  easeInQuint: (t: number) => t * t * t * t * t,
  // decelerating to zero velocity
  easeOutQuint: (t: number) => 1 + (--t) * t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuint: (t: number) => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t

}
