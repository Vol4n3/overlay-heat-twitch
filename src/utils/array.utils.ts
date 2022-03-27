export const PickRandomOne = <T>(array: T[]): T => {
  if (!array.length) {
    throw new Error("array is empty on pickRandom")
  }
  return array[Math.floor(Math.random() * array.length)];
}