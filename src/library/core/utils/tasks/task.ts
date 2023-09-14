/**
 * A runnable task, either async or synchronous
 */
export class Task<Name extends string, Run extends (...params: any[]) => any> {
    constructor(public name: Name, public run: Run) {}
}