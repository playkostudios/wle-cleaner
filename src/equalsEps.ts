export function equalsEps(a: number, b: number, eps: number) {
    return Math.abs(a - b) < eps;
}