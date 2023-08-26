import path from "path"
import Logger from "../../../utils/logger"
import Hurx from "../../hurx"
import CLI from "./cli"
import Command from "./command"
import child from 'child_process'

/**
 * The options property for a command
 */
export type CommandOptions<Options extends string> = {
    [Long in Options extends `--${infer A} ${infer B}` ? A : Options extends `--${infer A}` ? A : never]: 
        undefined
    |   Option<Options extends `--${Long} ${infer B}` ? `--${Long} ${B}` : Options extends `--${Long}` ? `--${Long}` : never>['properties']
}

/**
 * Represents the type of option arguments, which can be used to define
 * the properties and types associated with an option.
 */
export type OptionArguments<E extends string, MustBeUndefined extends boolean = false> =
    E extends `<${infer A}> ${infer B}`
        ? A extends `${infer AA}?${infer AB}`
            ? OptionArgument<A> & OptionArguments<B, true>
            : MustBeUndefined extends true ? never : OptionArgument<A> & OptionArguments<B>
        : E extends `<${infer A}>`
            ? A extends `${infer AA}?${infer AB}`
                ? OptionArgument<A>
                : MustBeUndefined extends true ? never : OptionArgument<A>
            : never

/**
 * Represents the definition of an individual option argument.
 */
export type OptionArgument<E extends string> = E extends `${infer A}?:${infer B}`
    ? {
        properties: {[a in A]: OptionArgumentType<B> | undefined}
    }
    : E extends `${infer A}:${infer B}`
    ? {
        properties: {[a in A]: OptionArgumentType<B>}
    }
    : E extends `${infer A}?`
    ? {
        properties: {[a in A]: string | undefined}
    }
    : E extends `${infer A}`
    ? {
        properties: {[a in A]: string}
    }
    : never

/**
 * Represents the TypeScript types that an option argument can take.
 */
export type OptionArgumentType<E extends string> = E extends `"${infer A}"|${infer B}`
    ? A | OptionArgumentType<B>
    : E extends `${infer A}|${infer B}`
    ? OptionArgumentType<A> | OptionArgumentType<B>
    : E extends `"${infer A}"`
    ? A
    : E extends `${number}`
    ? number
    : E extends `number`
    ? number
    : E extends `${boolean}`
    ? boolean
    : E extends `boolean`
    ? boolean
    : E extends `${string}`
    ? string
    : E extends `string`
    ? string
    : E extends `${infer A}|${infer B}`
    ? OptionArgumentType<A> | OptionArgumentType<B>
    : never

/**
 * Represents a command-line option.
 */
export type Option<E extends string> =
    {
        /**
         * The description of the option
         */
        description: string
        /**
         * The short form of the option flag (single character).
         */
        short?: string
        /**
         * The long form of the option flag (full word).
         */
        long: string
        /**
         * Properties associated with the option.
         */
        properties: Record<string, {
            /**
             * Allowed types for the property value
             */
            types: Array<StringConstructor|BooleanConstructor|NumberConstructor|null|string|undefined>
            /**
             * The current value of the property
             */
            value: undefined|string|boolean|number|null
        }>
        /**
         * Indicates whether the option is included in the current context.
         */
        included: boolean
        /**
         * the callback when the option has been selected, this will be executed
         * before the `start` event of a command and it will fire for all child
         * commands as well.
         * @param cli the cli instance
         */
        cb?: (cli: CLI<any, any, any>) => Promise<void>|void
    } & (
        E extends `--${infer A} ${infer B}`
        ? {
            long: A
        } & Option<B>
        : E extends `--${infer A}`
        ? {
            long: A
        }
        : E extends `-${infer A} ${infer B}`
        ? {
            short: A
        } & Option<B>
        : E extends `-${infer A}`
        ? {
            short: A
        }
        : E extends `<${infer A}>${infer B}`
        ? OptionArguments<E>
        : never
    )

/**
 * The events that can be handled
 */
export type Events = 'end'|'error'|'start'

/**
 * Represents the options available for an event handler.
 * @template Name - The type representing the name of the CLI.
 * @template Options - The type representing the options of the CLI.
 */
export type EventOptions<Name extends string, Options extends string, Middlewares extends string> = {
    /**
     * The options passed to the command.
     */
    options: CommandOptions<Options>
    /**
     * The CLI instance associated with the event.
     */
    cli: CLI<Name, Options, Middlewares>
}

/**
 * Represents the options available for a middleware function.
 * @template Name - The type representing the name of the CLI.
 * @template Options - The type representing the options of the CLI.
 */
export type MiddlewareOptions<Name extends string, Options extends string, Middlewares extends string> = EventOptions<Name, Options, Middlewares> & {
    /**
     * A function to call the next event handler in the chain.
     */
    next: () => Promise<void>
}

/**
 * The body of an event handler
 */
export type EventHandler<Event extends Events, Name extends string, Options extends string, Middlewares extends string> = Event extends 'error'
    ? (
        options: EventOptions<Name, Options, Middlewares> & {
            /**
             * The error from a rejected promise or throw statement
             */
            error: Error
        }
    ) => Promise<void>|void
    : (
        options: EventOptions<Name, Options, Middlewares>
    ) => Promise<void>|void

/**
 * Represents the base properties and methods of a CLI entity.
 */
export interface CLIEntityBase {
    /**
     * The reference to the CLI instance associated with the entity.
     */
    cli: CLI<any, any, any>
}

/**
 * Base class for entities in the CLI application.
 * This class can be extended to create different types of entities.
 */
export abstract class CLIEntity implements CLIEntityBase {
    /**
     * The reference to the CLI instance associated with the entity.
     */
    public abstract cli: CLI<any, any, any>

    /**
     * The logger of the entity, providing access to logging functionality.
     */
    public get logger(): Logger {
        return this.cli.logger
    }
}

/**
 * Represents a CLI command that can be executed.
 * Extend this class to define custom CLI commands.
 *
 * @template Parent - The parent entity type that this command belongs to.
 */
export abstract class CLICommand<Parent extends CLIMaster|CLICommand<any>> extends CLIEntity {
    /**
     * List of sub-commands that this command can execute.
     * This should be an array of constructor functions for CLICommand classes.
     */
    public abstract commands: (new (parent: any) => CLICommand<any>)[]

    /**
     * The primary command that this CLICommand represents.
     */
    public abstract command: Command<any, any, any>

    /**
     * Get the CLI
     */
    public get cli() {
        const cli = () => {
            let parent = this.parent
            while (parent) {
                if (parent instanceof CLIMaster) {
                    return parent.cli
                }
                parent = parent.parent
            }
        }
        return cli()!
    }

    /**
     * The parent entity that this command belongs to.
     */
    public parent: Parent

    /**
     * Creates a new instance of CLICommand.
     *
     * @param {Parent} parent - The parent entity that this command belongs to.
     */
    constructor(parent: Parent) {
        super()
        this.parent = parent
    }

    /**
     * Starts the execution of this command and its sub-commands.
     * This method should be overridden to define the command's behavior.
     *
     * @async
     */
    public readonly start = async() => {
        for (const command of this.commands || []) {
            const cmd = new command(this)
            await cmd.start()
        }
    }
}

/**
 * Represents a master controller for a Hurx CLI application.
 * This class should be extended to define the main CLI controller.
 */
export abstract class CLIMaster extends CLIEntity {
    /**
     * List of CLI commands that can be executed by this master.
     * This should be an array of constructor functions for CLICommand classes.
     */
    public abstract commands: (new (parent: any) => CLICommand<any>)[]

    /**
     * The main CLI instance associated with this master.
     */
    public abstract cli: CLI<any, any, any>

    /**
     * Creates a new instance of CLIMaster.
     */
    constructor() {
        super()
    }

    /**
     * Starts the execution of this master and its associated CLI.
     * This method initializes and executes the defined commands.
     *
     * @async
     */
    public readonly start = async() => {
        this.cli.emitters.change.argv.listen.always(async(argv) => {
            this.logger.argv = argv
        })
        for (const command of this.commands || []) {
            const cmd = new command(this)
            await cmd.start()
        }
        await this.cli.start()
    }

    /**
     * Converts a master to a command
     * @param srcPath the path of the file starting from the src folder
     * @param originalCLI the original cli
     * @returns the command class
     */
    public convertToCommand(srcPath: string, originalCLI: () => CLI<any, any, any>) {
        const cli = this.cli
        return class _HurxCLI extends CLICommand<any> {
            public commands = []
            public command = new Command(this.parent, cli.name, cli.description)
                .event('start', async () => {
                    async function runSpawnedProcess(_path: string) {
                        return new Promise<void>((resolve, reject) => {
                            const _child = child.spawn(
                                'npx',
                                [
                                    'ts-node',
                                    '--experimental-specifier-resolution=node',
                                    _path,
                                    ...originalCLI().argv.filter((v, i, a) => i > a.indexOf(cli.name))
                                ], { 
                                    cwd: process.cwd(),
                                    stdio: 'inherit',
                                    shell: true
                                }
                            )

                            _child.on('exit', (code) => {
                                if (code === 0) {
                                    resolve() // Process completed successfully
                                } else {
                                    reject(new Error(`Child process exited with code ${code}`));
                                }
                            });

                            _child.on('error', (err) => {
                                reject(err) // An error occurred while spawning the child process
                            })
                        })
                    }
                    if (Hurx.project.config.package.built) {
                        const original = originalCLI()
                        original.skip = original.argv.filter((v, i, a) => i < original.argv.indexOf(this.cli.name) + this.cli.argv.length)
                        await runSpawnedProcess(`${path.join(Hurx.project.env.paths.sources, srcPath.replace(/\.ts$/g, '.js'))}`)
                    }
                    else {
                        const original = originalCLI()
                        original.skip = original.argv.filter((v, i, a) => i < original.argv.indexOf(this.cli.name) + this.cli.argv.length)
                        await runSpawnedProcess(`${path.join(Hurx.project.env.paths.sources, srcPath)}`)
                    }
                })
            constructor(parent: any) {
                super(parent)
            }
        }
    }
}