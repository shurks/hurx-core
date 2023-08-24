import { promisify } from "util"
import Logger from "../../../utils/logger"

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
 * A handler for a certain event in the CLI
 */
export type EventHandler<Event extends Events, Name extends string, Options extends string> = Event extends 'end'
    ? (
        /**
         * The CLI instance
         */
        cli: CLI<Name, Options>
    ) => Promise<void>|void
    : Event extends 'before-start'
    ? (
        /**
         * The CLI instance
         */
        cli: CLI<Name, Options>
    ) => Promise<void>|void
    : Event extends 'error'
    ? (
        /**
         * The error from the rejected promise
         */
        error: Error
    ) => Promise<void>|void
    : Event extends 'start'
    ? (
        /**
         * All the used options and their property values
         */
        options: {
            [Long in Options extends `--${infer A} ${infer B}` ? A : Options extends `--${infer A}` ? A : never]: 
                undefined
            |   Option<Options extends `--${Long} ${infer B}` ? `--${Long} ${B}` : Options extends `--${Long}` ? `--${Long}` : never>['properties']
        }
    ) => Promise<void>|void
    : never

/**
 * Represents the CLI (Command-Line Interface) class, which provides methods
 * for defining and executing command-line interfaces and subcommands.
 */
export default class CLI<Name extends string = never, Options extends string = never> {
    /**
     * The parent CLI instance.
     * @type {CLI|undefined}
     */
    public parent?: CLI<any, any> = undefined

    /**
     * An array of defined options for this CLI instance.
     * @type {Array<Option>}
     */
    public options: Option<any>[] = []

    /**
     * Retrieves all options from the current CLI instance and its parents.
     * @type {Array<Option>}
     */
    public get allOptions(): typeof this['options'] {
        let parent = this.parent
        let options: typeof this['options'] = [
            ...this.options
        ]
        while (parent && parent !== this) {
            options = [
                ...options,
                ...parent.options.filter((v) => 
                    (!v.short || !options.filter((v) => v.short).map((v) => v.short!.toLowerCase()).includes(v.short.toLowerCase()))
                    && !options.filter((v) => v.long).map((v) => v.long.toLowerCase()).includes(v.long.toLowerCase())
                )
            ]
            parent = parent.parent
        }
        return options
    }

    /**
     * An array of defined subcommands for this CLI instance.
     * @type {Array<CLI>}
     */
    public commands: CLI<any, any>[] = []

    /**
     * Retrieves all subcommands from the current CLI instance and its parents.
     * @type {Array<CLI>}
     */
    public get allCommands(): CLI<any, any>[] {
        let parent = this.parent
        let commands: CLI<any>[] = [
            ...this.commands
        ]
        while (parent && parent !== this) {
            commands = [
                ...commands,
                ...parent.commands.filter((v) => !commands.map((v) => v.name.toLowerCase()).includes(v.name.toLowerCase()))
            ]
            parent = parent.parent
        }
        return commands
    }

    /**
     * The event handlers
     */
    public handlers: {
        [Event in Events]: EventHandler<Event, any, any> | undefined
    } & {
        start: () => Promise<void>
    } = {} as any

    /**
     * The current arguments used to run the CLI (default: process.argv)
     */
    public argv: string[] = []

    /**
     * The command history of the CLI
     */
    private history: CLI<any, any>[] = [
        this
    ]

    /**
     * The logger instance used for logging messages.
     */
    private logger = new Logger()

    /**
     * Creates an instance of the CLI class.
     * @param {string} name - The name of the CLI.
     * @param {CLI} [parent] - The parent CLI instance, if any.
     */
    constructor(public name: Name, parent?: CLI<any, any>) {
        this.parent = parent
        this.commands.push(this)
    }

    /**
     * Set an execution function for when this command/CLI instance
     * gets invoked.
     * @param event The start event
     * @param handler The callback function
     * @returns The builder
     */
    public event(event: 'start', handler: EventHandler<'start', Name, Options>): CLI<Name, Options>

    /**
     * Set an execution function for just after this command/CLI instance is done running its command.
     * @param event The end event
     * @param handler The callback function
     * @returns The builder
     */
    public event(event: 'end', handler: EventHandler<'end', Name, Options>): CLI<Name, Options>

    /**
     * Sets an error handler in case the start event reject( an Error)
     * @param event The error event
     * @param handler The callback function
     * @returns The builder
     */
    public event(event: 'error', handler: EventHandler<'error', Name, Options>): CLI<Name, Options>

    /**
     * Fires upon one of the lifecycle events
     * @param event The event
     * @param handler The handler
     */
    public event(event: Events, handler: EventHandler<Events, Name, Options>): this {
        switch (event) {
            case 'start': {
                this.handlers.start = async() => {
                    const options = {} as any
                    for (const option of this.allOptions) {
                        if (option.included) {
                            options[option.long] = {}
                            for (const propertyName of Object.keys(option.properties)) {
                                const property = option.properties[propertyName]
                                if (property.value !== undefined) {
                                    options[option.long][propertyName] = property.value
                                }
                                property.value = undefined
                            }
                            option.included = false
                        }
                    }
                    const handle = handler(options)
                    if (handle instanceof Promise) {
                        await handle
                    }
                }
                return this as any
            }
            case 'end': {
                this.handlers[event] = async() => {
                    await handler(this as any)
                }
                return this as any
            }
            case 'error': {
                this.handlers[event] = async(error: Error) => {
                    await handler(error as any)
                }
                return this as any
            }
        }
    }

    /**
     * Initializes an option in the CLI, used with a command or with the main CLI
     * entry point.
     * @param opt the option
     * @param description the description
     * @returns 
     */
    public option<T extends string>(opt: T, description: string): CLI<Name, Options|T> {
        let option: typeof this['options'][number] = { description, included: false } as any

        // Long option, followed by a short option
        if (/^(\-\-)(.+)(\s)(\-)(.+)/.test(opt)) {
            option.long = opt.replace(/^(\-\-)(.+)(\s)(\-)(.+)$/, '$2').replace(/\s.+$/, '')
            option.short = opt.replace(/^(\-\-)(.+)(\s)(\-)(.+)$/, '$5').replace(/\s.+$/, '')
        }
        // Just a long option
        else if (/^(\-\-)(.+)(\s)*$/.test(opt)) {
            option.long = opt.replace(/^(\-\-)(.+)(\s)*$/, '$2').replace(/\s.+$/, '')
        }
        // Properties
        option.properties = {}
        if (/^(\-\-)(.+)(\s)(\-)(.+)(\s)\<(.*)$/.test(opt) || /^(\-\-)(.+)(\s)\<(.*)$/.test(opt)) {
            const properties = /^(\-\-)(.+)(\s)(\-)(.+)(\s)\<(.*)$/.test(opt)
                ? opt.replace(/^(\-\-)(.+)(\s)(\-)(.+?)(\s)(.*)$/, '$7')
                : opt.replace(/^(\-\-)(.+)(\s)(.*)$/, '$4')
            const split = properties.split('<').filter((v) => v).map((v) => ({
                name: v.includes('?')
                    ? v.substring(0, v.indexOf('?'))
                    : v.includes(':')
                    ? v.substring(0, v.indexOf(':'))
                    : v.includes('>')
                    ? v.substring(0, v.indexOf('>'))
                    : v,
                types: (v.includes('?:')
                    ? 'undefined|' + v.substring(v.indexOf('?:')).replace(/^\?\:/, '').replace(/\>\s*$/, '')
                    : v.includes('?')
                    ? 'undefined|string'
                    : v.includes(':')
                    ? v.substring(v.indexOf(':')).replace(/^\:/, '').replace(/\>\s*$/, '')
                    : v.includes('>')
                    ? 'string'
                    : 'string'
                ).split('|')
            }))
            for (let i = 0; i < split.length; i ++) {
                option.properties[split[i].name] = {
                    types: split[i].types.map((v) => v === 'string' ? String : /^\".+\"$/.test(v) ? v.replace(/^\"/g, '').replace(/\"$/g, '') : v === 'undefined' ? undefined : v === 'boolean' ? Boolean : v === 'number' ? Number : v === 'null' ? null : v),
                    value: undefined
                }
            }
        }
        this.options = [
            ...this.options,
            option
        ]
        return this as any
    }

    /**
     * Adds a new sub-command to a command line interface (CLI) instance.
     * @param cb the callback, which should be used as a return type to create a sub-command
     * @returns The builder
     */
    public command<Opts extends string>(cb: (command: <T extends string>(name: T) => CLI<T, Options>) => CLI<string, Options|Opts>): CLI<Name, Options> {
        this.commands.push(cb((name) => {
            const cli = new CLI(name, this)
            cli.options = this.options
            return cli as any
        }))
        return this as any
    }

    /**
     * Starts the CLI with the specified command-line arguments.
     * @param {string[]} [argv=process.argv] The command-line arguments, make sure not to include the first two
     *                                       entries of node.js if using process.argv
     */
    public async start(argv: string[] = process.argv.filter((v, i) => i > 1)) {
        return new Promise<this>(async(resolve, reject) => {
            try {
                this.argv = argv
                let oneCommandFound = false
                let firedLastCommand = false
                let options: typeof this.history[number]['options'] = []
        
                /**
                 * Finds and processes the option within the current command.
                 * @param {CLI} command - The current command.
                 * @param {string} opt - The current option.
                 */
                const findOption = (command: CLI<any, any>, opt: string) => {
                    const found = command.allOptions.find((o) => `--${o.long}` === opt || (o.short && opt.toLowerCase().includes(o.short.toLowerCase()) && opt.startsWith('-') && !opt.startsWith('--')))
                    if (found) {
                        if (found.short && opt.toLowerCase().includes(found.short.toLowerCase()) && opt.startsWith('-') && !opt.startsWith('--')) {
                            if (opt.replace(/^\-/g, '').length > 1) {
                                this.logger.verbose(`Found short combo "${opt}"`)
                                const letters = opt.replace(found.short, '').replace('-', '')
                                const parsed: string[] = [found.short]
                                options = [found]
                                found.included = true
                                for (const letter of letters) {
                                    if (parsed.includes(letter.toLowerCase())) {
                                        this.logger.verbose(`Duplicate short option: "${letter}"`)
                                    }
                                    const option = command.allOptions.find((v) => v.short && v.short.toLowerCase() === letter.toLowerCase())
                                    if (option) {
                                        options.push(option)
                                        option.included = true
                                        parsed.push(letter.toLowerCase())
                                    }
                                    else {
                                        throw new Error(`No definition for short option "${letter}" could be found`)
                                    }
                                }
                            }
                            else {
                                this.logger.verbose(`Found short option: "${opt}"`)
                                options = [found]
                                found.included = true
                            }
                        }
                        else if (opt.startsWith('--')) {
                            this.logger.verbose(`Found option: "${opt}"`)
                            options = [found]
                            found.included = true
                        }
                    }
                    else {
                        if (opt.startsWith('-') && !opt.startsWith('--')) {
                            if (opt.length > 2) {
                                throw new Error(`No definition for any of the short options "${opt}" could be found`)
                            }
                            else {
                                throw new Error(`No definition for short option "${opt}" could be found`)
                            }
                        }
                        else if (opt.startsWith('--')) {
                            throw new Error(`No definition for option "${opt}" could be found`)
                        }
                        return
                    }
                }
        
                /**
                 * Executes a command
                 * @param command the command to execute
                 */
                const executeCommand = async(command: CLI<any, any>) => {
                    if (!command.handlers.start) {
                        throw new Error(`Command "${command.name}" has no "start" event specified`)
                    }
                    firedLastCommand = true
                    this.logger.verbose(`Running command "${command.name}" start event`)
                    await command.handlers.start()
                }

                /**
                 * Finds and processes the subcommand within the current command.
                 * @param {CLI} command - The current command.
                 * @param {string} name - The name of the subcommand.
                 */
                const findCommand = async(command: CLI<any, any>, name: string) => {
                    const found = command.allCommands.find((c) => c.name === name)
                    if (found) {
                        this.logger.verbose(`Found command: "${name}"`)
                        if (oneCommandFound) {
                            const lastCommand = this.history[this.history.length - 1]
                            if (lastCommand) {
                                this.logger.verbose(`First executing previous command "${lastCommand.name}"`)
                                await executeCommand(lastCommand)
                            }
                        }
                        this.history.push(found)
                        oneCommandFound = true
                    }
                    else {
                        if (!name.startsWith('-')) {
                            throw new Error(`No definition for command "${name}" could be found`)
                        }
                        return
                    }
                }
        
                /**
                 * Sets the value in the property of an option in a CLI instance
                 * @param syntax the syntax string
                 * @param arg the current argv argument
                 * @param optionLongKey the "long" name of the option
                 * @param propertyKey the name of the property
                 * @param propertyObject the property object in the option
                 */
                const setValue = (syntax: string, arg: string, optionLongKey: string, propertyKey: string, propertyObject: typeof options[number]['properties'][string]) => {
                    if (propertyObject.types.includes(Boolean) && ['true', 'false'].includes(arg.toLowerCase())) {
                        this.logger.verbose(`Setting ${optionLongKey}.${propertyKey} to ${arg.toLowerCase()}`)
                        propertyObject.value = arg.toLowerCase() === 'true'
                    }
                    else if (propertyObject.types.includes(Number) && /^[0-9]+(\.[0-9]+)?(e(\-|\+)?[0-9]+)?$/.test(arg.toLowerCase())) {
                        this.logger.verbose(`Setting ${optionLongKey}.${propertyKey} to ${arg.toLowerCase()}`)
                        propertyObject.value = Number.parseFloat(arg.toLowerCase())
                    }
                    else if (propertyObject.types.includes(null) && arg.toLowerCase() === 'null') {
                        this.logger.verbose(`Setting ${optionLongKey}.${propertyKey} to null`)
                        propertyObject.value = null
                    }
                    else if (propertyObject.types.includes(String) && typeof arg === 'string') {
                        this.logger.verbose(`Setting ${optionLongKey}.${propertyKey} to "${arg.toLowerCase()}"`)
                        propertyObject.value = arg
                    }
                    else if (propertyObject.types.includes(arg) || propertyObject.types.includes(`"${arg}"`)) {
                        this.logger.verbose(`Setting ${optionLongKey}.${propertyKey} to const "${arg.toLowerCase()}"`)
                        propertyObject.value = arg
                    }
                    else {
                        throw new Error(`Property <${propertyKey}> in ${options.length > 1 ? `-${options.map((v) => v.short).join('')}` : `--${options[0].long}`} ${syntax} is not of type ${propertyObject.types.map((v) => v === String ? 'string' : v === undefined ? 'undefined' : v === Number ? 'number' : v === Boolean ? 'boolean' : v).join(' | ')}`)
                    }
                }
        
                // Loops through the argv arguments
                for (let i = 0; i < argv.length; i ++) {
                    let arg = argv[i]
                    // It's an option
                    if (arg.startsWith('-')) {
                        findOption(this.history[this.history.length - 1], arg)
                    }
                    // It's a command
                    else {
                        await findCommand(this.history[this.history.length - 1], arg)
                    }
                    // There are options that are currently active and are awaiting
                    // values from the argv arguments
                    if (options.length) {
                        // Parse the syntax string `-a <b:string> etc`
                        const required: Record<string, typeof options[number]['properties']> = {}
                        const optional: Record<string, typeof options[number]['properties']> = {}
                        let syntax = ''
                        let optionalSyntax = ''
                        for (const option of options) {
                            required[option.long] = {}
                            optional[option.long] = {}
                            if (option.properties) {
                                for (const property of Object.keys(option.properties)) {
                                    const propertyObject = option.properties[property]
                                    let typeSyntax = ''
                                    let types = []
                                    for (const type of propertyObject.types) {
                                        if (type === String) {
                                            types.push('string')
                                        }
                                        else if (typeof type === 'string') {
                                            types.push(`"${type}"`)
                                        }
                                        else if (type === Number) {
                                            types.push('number')
                                        }
                                        else if (type === Boolean) {
                                            types.push('boolean')
                                        }
                                        else if (type === null) {
                                            types.push('null')
                                        }
                                    }
                                    if (propertyObject.types.includes(undefined)) {
                                        typeSyntax = '?'
                                        optional[option.long][property] = propertyObject
                                        optionalSyntax = `${optionalSyntax} <${property}${typeSyntax}${types.length ? `:${types.join('|')}` : ''}>`.trim()
                                    }
                                    else {
                                        required[option.long][property] = propertyObject
                                        syntax = `${syntax} <${property}${typeSyntax}${types.length ? `:${types.join('|')}` : ''}>`.trim()
                                    }
                                }
                            }
                            else {
                                this.logger.verbose(`Option "${option.long}" doesn't have properties`)
                            }
                        }
                        syntax = `${optionalSyntax.length ? syntax + ' ' : syntax}${optionalSyntax}`.trim()
                        this.logger.verbose(`Syntax for the current option(s): "${options.length > 1 ? `-${options.map((v) => v.short).join('')}` : `--${options[0].long}`}${syntax ? ` ${syntax}` : ''}"`)
                        
                        // Loops through all the required and optional properties
                        // within the selected options, and sets the values.
                        whileLoop: while (true) {
                            // Loops through all the required options
                            for (const optionLongKey of Object.keys(required)) {
                                for (const propertyKey of Object.keys(required[optionLongKey])) {
                                    i++
                                    const arg = argv[i]
                                    if (!arg) {
                                        throw new Error(`Property <${propertyKey}> in ${options.length > 1 ? `-${options.map((v) => v.short).join('')}` : `--${options[0].long}`} ${syntax} is missing`)
                                    }
                                    const propertyObject = required[optionLongKey][propertyKey]
                                    setValue(syntax, arg, optionLongKey, propertyKey, propertyObject)
                                }
                            }
                            // Loops through all the optional options
                            for (const optionLongKey of Object.keys(optional)) {
                                for (const propertyKey of Object.keys(optional[optionLongKey])) {
                                    i++
                                    const arg = argv[i]
                                    if (!arg) {
                                        this.logger.verbose(`Out of arguments`)
                                        i --
                                        break whileLoop
                                    }
                                    if (
                                        (arg.startsWith('--') && this.history[this.history.length - 1].allOptions.map((v) => v.long).includes(arg.replace(/^\-\-/g, '')))
                                        || (arg.startsWith('-') && !arg.startsWith('--') && this.history[this.history.length - 1].allOptions.filter((v) => v.short).map((v) => v.long).includes(arg.replace(/^\-/g, '')))
                                        || this.history[this.history.length - 1].allCommands.find((c) => c.name === arg)
                                    ) {
                                        this.logger.verbose(`Argument "${arg}" is a command or option, breaking`)
                                        i --
                                        break whileLoop
                                    }
                                    const propertyObject = optional[optionLongKey][propertyKey]
                                    setValue(syntax, arg, optionLongKey, propertyKey, propertyObject)
                                }
                            }
                            break
                        }
                        options = []
                    }
                }
                
                // Fire the command if not done already
                const lastCommand = this.history[this.history.length - 1] || this
                if (lastCommand) {
                    this.logger.verbose(`Firing command "${lastCommand.name}"`)
                    await executeCommand(lastCommand)
                }
            }
            catch (err) {
                const handler = this.handlers.error
                if (handler) {
                    const handle = handler(err instanceof Error ? err : new Error(err as any))
                    if (handle instanceof Promise) {
                        await handle
                    }
                }
            }
            try {
                const endHandler = this.handlers['end']
                if (endHandler) {
                    this.logger.verbose(`Running command "${this.name}" end event`)
                    await endHandler(this)
                }
            }
            catch (err) {
                const handler = this.handlers.error
                if (handler) {
                    await handler(err instanceof Error ? err : new Error(err as any))
                }
                return reject(err)
            }
        })
    }
}