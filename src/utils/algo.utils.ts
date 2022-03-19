export const Debounce = (handler: () => void, time: number, ref: number): number => {
  window.clearTimeout(ref);
  return window.setTimeout(handler, time);
};