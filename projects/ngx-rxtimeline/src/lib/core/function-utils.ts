export function partialApply<TInput, TAppliedArgs extends any[], TOut>(
  func: (input: TInput, ...appliedArgs: TAppliedArgs) => TOut
): (...appliedArgs: TAppliedArgs) => (input: TInput) => TOut {
  return (...appliedArgs: TAppliedArgs) => (input: TInput) =>
    func(input, ...appliedArgs);
}

export function pipe<T>(
  ...args: ((...args: any[]) => T)[]
): (...t: any[]) => T {
  return (...x: any[]) =>
    args.slice(1).reduce((acc, curr) => curr(acc), args[0](...x));
}

export function clampZero(x: number) {
  return Math.max(x, 0);
}

export function subtract(x: number, y: number) {
  return x - y;
}

export function mult(x: number, y: number) {
  return x * y;
}

export const negate = mult.bind(null, -1);

export function add(x: number, y: number): number {
  return x + y;
}

export const double = mult.bind(null, 2);
