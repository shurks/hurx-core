export type ObjectAndRecord<O extends object, R extends any> = O | Omit<{
    [key: string]: R
}, keyof O>

export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
}