import Logger from "../../../utils/logger"
import Hurx from "../../hurx"
import CLI from "./cli"
import Command from "./command"

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
    cli: CLI<any, any, any>
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
        return Hurx.logger
    }

    /**
     * Initializes this command or master (entity).
     */
    public readonly initialize = async(): Promise<this> => {
        const initialize = async(root: CLICommand<any>|CLIMaster) => {
            if (root instanceof CLIMaster || root instanceof CLICommand) {
                for (const command of root.commands || []) {
                    const cmd = new command(root)
                    cmd.command.type = 'command'
                    if (root instanceof CLIMaster) {
                        root.cli.commands.push(cmd.command)
                    }
                    else {
                        root.command.commands.push(cmd.command)
                    }
                    await initialize(cmd)
                }
            }
            if (root instanceof CLIMaster) {
                for (const master of root.masters) {
                    const mst = new master()
                    mst.cli.type = 'cli'
                    mst.cli.parent = root.cli
                    root.cli.commands.push(mst.cli)
                    await initialize(mst)
                }
            }
        }
        await initialize(this as any)
        return this as any
    }

    /**
     * Starts the cli or command as a cli
     * @param argv the arguments to pass to the cli
     */
    public readonly start = async(argv?: string[]): Promise<CLIMaster|CLICommand<any>> => {
        await this.cli.start(argv)
        return this as any
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
    public commands: (new (parent: any) => CLICommand<any>)[] = []

    /**
     * The primary command that this CLICommand represents.
     */
    public abstract command: Command<any, any, any>

    /**
     * Get the CLI
     */
    public get cli(): CLI<any, any, any> {
        const cli = () => {
            let parent = this.parent
            while (parent) {
                if (parent instanceof CLIMaster) {
                    return parent.cli
                }
                else if (parent instanceof CLICommand) {
                    parent = parent.parent
                }
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
    public commands: (new (parent: any) => CLICommand<any>)[] = []

    /**
     * The sub-cli's within this cli master entity.
     */
    public masters: (new () => CLIMaster)[] = []

    /**
     * The CLI associated with this master entity.
     */
    public abstract readonly cli: CLI<any, any, any>

    /**
     * Creates a new instance of CLIMaster.
     * @param cli The main CLI instance associated with this master.
     */
    constructor() {
        super()
    }
}