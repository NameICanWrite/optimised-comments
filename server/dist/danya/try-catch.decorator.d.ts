export type Function = (...args: any[]) => any;
export type Class = new (...args: any[]) => any;
export type TryCatchReturn<T> = ReturnType<typeof TryCatch<T>>;
export default function TryCatch<T>(target: T): T extends Function | Class ? T : () => {};
