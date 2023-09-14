import Logger from "../logger/logger.node"
import { Task } from "./task"

/**
 * TODO: think whether this is a good idea or just advanced and cool
 * The manager for a series of `Task`'s
 */
export default class Tasks<T extends Task<Names, Runs> = never, Names extends string = never, Runs extends (...params: any[]) => any = never, N extends string = never> {
    public logger = new Logger()
    constructor(public name: N) {}
    /**
     * All registered tasks
     */
    public tasks: Record<string, Task<any, any>> = {}
    /**
     * Registers a task under a name.
     * Can be any method, an async arrow function or a Promise
     * @param name the name of the task
     * @param run executed when running the task
     * @returns the tasks manager
     */
    public register
        <
            Name extends string,
            Run extends (...params: any[]) => any
        >(
            name: Exclude<Name, Names>,
            run: Run
        ): Tasks<Exclude<T | Task<Name, Run>, never>, Exclude<Names|Name, never>, Exclude<Runs|Run, never>, Exclude<N, never>>
    {
        this.tasks[name] = new Task(name, run)
        return this as any
    }
    /**
     * Merges two task managers into eachother.
     * The new manager will override the values of the
     * old manager.
     * @param tasks the task manager
     * @returns 
     */
    public import
        <
            Tasks2 extends Tasks<any, any, any, any>
        >(
            tasks: Tasks2 extends Tasks<infer A, infer B, infer C, infer D> ? `${D}.${B}` extends Names ? never : Tasks2 : never
        ): Tasks2 extends Tasks<infer A, infer B, infer C, infer D> ? Tasks<T|(A extends Task<infer E, infer F> ? Task<`${D}.${E}`, F> : never), Names|`${D}.${B}`, Runs|C, N> : never
    {
        for (const name of Object.keys(tasks.tasks)) {
            this.tasks[`${tasks.name}.${name}`] = tasks.tasks[name]
        }
        return this as any
    }
    /**
     * Runs a task
     * @param name the name of the task 
     * @param args the arguments
     * @returns a promise if the task is async
     */
    public run<T2 extends T extends Task<Name, infer B> ? Parameters<B> : never, Name extends Names>(
        name: Name,
        ...args: T2
    ): T extends Task<Name, infer Run>
        ? ReturnType<Run> extends Promise<infer RunReturnType> 
            ? Promise<RunReturnType>
            : ReturnType<Run>
        : never 
    {
        return this.tasks[name].run(...args)
    }
}