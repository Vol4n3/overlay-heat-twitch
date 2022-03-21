
export const VectorDistance = (vectorA: number[], vectorB: number[]): number => {
    return VectorLength(vectorsSubtract(vectorB, vectorA));
}
export const VectorLength = (vector: number[]): number => {
    const square = vector.reduce((prev, curr) => prev + curr * curr, 0);
    return Math.sqrt(square)
}
export const VectorNegate = (vector: number[]): number[] => {
    return vector.map(v => v * -1);
}
export const VectorInvert = (vector: number[]): number[] => {
    return vector.map(v => 1 / v);
}
export const vectorsAdd = (vectorA: number[], vectorB: number[]): number[] => {
    if (vectorA.length !== vectorB.length) {
        throw new Error('Vectors are not in same dimension');
    }
    return vectorA.map((a, i) => a + vectorB[i], 0)
}
export const vectorsMultiply = (vectorA: number[], vectorB: number[]): number[] => {
    if (vectorA.length !== vectorB.length) {
        throw new Error('Vectors are not in same dimension');
    }
    return vectorA.map((a, i) => a * vectorB[i], 0)
}
export const vectorsDivide = (vectorA: number[], vectorB: number[]): number[] => {
    if (vectorA.length !== vectorB.length) {
        throw new Error('Vectors are not in same dimension');
    }
    return vectorA.map((a, i) => a / vectorB[i], 0)
}
export const vectorsSubtract = (vectorA: number[], vectorB: number[]): number[] => {
    if (vectorA.length !== vectorB.length) {
        throw new Error('Vectors are not in same dimension');
    }
    return vectorA.map((a, i) => a - vectorB[i], 0)
}

