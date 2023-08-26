import Logger from "../../../utils/logger"
import Emitter from "../../../utils/reactive/emitter"
import { Option, Events, EventHandler, CommandOptions, MiddlewareOptions } from "./types"

/**
 * The options for the start loop
 */
type LoopOptions = {
    /**
     * Whether to ignore commands while going through the loop
     */
    ignoreCommands?: boolean
    /**
     * Whether to ignore incomplete options and not throw an error while going through the loop
     */
    ignoreIncompleteOptions?: boolean
}

/**
 * Represents the CLI (Command-Line Interface) class, which provides methods
 * for defining and executing command-line interfaces and subcommands.
 * 
 * TODO: add properties
 * TODO: required options for a command
 */
export default class CLI<Name extends string = never, Options extends string = never, Middlewares extends string = never> {
    /**
     * All event emitters
     */
    public emitters = {
        /**
         * Emitters for on change
         */
        change: {
            /**
             * Emitter for when the argv property changes
             */
            argv: new Emitter<typeof this.argv>()
        }
    }

    /**
     * The parent CLI instance.
     * @type {CLI|undefined}
     */
    public parent?: CLI<any, any, any> = undefined

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
        let parent = this.history[this.history.length - 1].parent
        let options: typeof this['options'] = [
            ...this.history[this.history.length - 1].options
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
    public commands: CLI<any, any, any>[] = []

    /**
     * Retrieves all subcommands from the current CLI instance and its parents.
     * @type {Array<CLI>}
     */
    public get allCommands(): CLI<any, any, any>[] {
        let parent = this.parent
        let commands: CLI<any, any, any>[] = [
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
    public handlers: {[E in Events]: EventHandler<E, Name, Options, Middlewares> | undefined} = {} as any

    /**
     * The current arguments used to run the CLI (default: process.argv)
     */
    public argv: string[] = []

    /**
     * The command history of the CLI
     */
    public readonly history: CLI<any, any, any>[] = [
        this
    ]

    /**
     * Arguments to skip
     */
    public skip: string[] = []

    /**
     * All the registered middleware functions
     */
    private middlewares: ({
        /**
         * The name of the middleware
         */
        name: Middlewares
        /**
         * Whether it's an initialization middleware
         */
        initialization?: boolean
        /**
         * The actual middleware function to execute
         * @param options the options
         */
        cb: (options: MiddlewareOptions<Name, Options, Middlewares>) => Promise<void>
    })[] = []

    /**
     * The currently running middleware
     */
    private currentMiddleware: Middlewares|null = null

    /**
     * The last options
     */
    private get lastOptions(): CommandOptions<Options> {
        const options = {} as any
        for (const option of this.allOptions) {
            if (option.included) {
                options[option.long] = {}
                for (const propertyName of Object.keys(option.properties)) {
                    const property = option.properties[propertyName]
                    if (property.value !== undefined) {
                        options[option.long][propertyName] = property.value
                    }
                }
            }
        }
        return options
    }

    /**
     * The logger instance used for logging messages.
     */
    public logger = new Logger()

    /**
     * Creates an instance of the CLI class.
     * @param {string} name - The name of the CLI.
     * @param {string} description - The description of the CLI (or command)
     * @param {CLI} [parent] - The parent CLI instance, if any.
     */
    constructor(public name: Name, public description: string, parent?: CLI<any, any, any>) {
        this.parent = parent
        this.commands.push(this)
    }

    /**
     * Adds a new initialization function to be executed ONLY ONCE before the first `start` event
     * of this command or any of its childs
     * @param handler the handler
     */
    public initialization<MName extends string>(name: MName, handler: (options: MiddlewareOptions<Name, Options, Middlewares|MName>) => Promise<void>|void): CLI<Name, Options, Exclude<Middlewares | MName, never>> {
        this.middlewares.push({
            name: name as any,
            initialization: true,
            cb: async(options: MiddlewareOptions<Name, Options, Middlewares>) => {
                const promise = handler(options as any)
                if (promise instanceof Promise) {
                    await promise
                }
            }
        })
        return this as any
    }

    /**
     * Adds a new middleware function to be executed before the start
     * of this command or any of its childs
     * @param handler the handler
     */
    public middleware<MName extends string>(name: MName, handler: (options: MiddlewareOptions<Name, Options, Middlewares|MName>) => Promise<void>|void): CLI<Name, Options, Exclude<Middlewares | MName, never>> {
        this.middlewares.push({
            name: name as any,
            cb: async(options: MiddlewareOptions<Name, Options, Middlewares>) => {
                const promise = handler(options as any)
                if (promise instanceof Promise) {
                    await promise
                }
            }
        })
        return this as any
    }

    /**
     * TODO: type O should exclude options with the same name as existing ones
     * Add another cli as a plugin, this merges all properties
     * and will overwrite existing ones if they exist.
     * @param cli the cli to merge into this cli
     * @returns this cli
     */
    public plugin<N extends string, O extends string, M extends string>(cli: CLI<N, O, M>): CLI<Name, Options|O, Middlewares|M> {
        this.commands.push(...cli.commands.filter((v) => !this.commands.map((v) => v.name).includes(v.name) && v.name !== cli.name))
        this.options.push(...cli.options.filter((v) => !this.options.map((v) => v.long).includes(v.long) && (!v.short || !this.options.filter((v) => v.short).map((v) => v.short).includes(v.short))))
        this.middlewares.push(...cli.middlewares as any[])
        for (const handler of Object.keys(cli.handlers)) {
            if ((cli.handlers as any)[handler] && !(this.handlers as any)[handler]) {
                (this.handlers as any)[handler] = (cli.handlers as any)[handler]
            }
        }
        return this as any
    }

    /**
     * Set an execution function for when this command/CLI instance
     * gets invoked.
     * @param event The start event
     * @param handler The callback function
     * @returns The builder
     */
    public event(event: 'start', handler: EventHandler<'start', Name, Options, Middlewares>): CLI<Name, Options, Middlewares>

    /**
     * TODO: make it work for other commands too
     * Set an execution function for just after this command/CLI instance is done running its command.
     * @param event The end event
     * @param handler The callback function
     * @returns The builder
     */
    public event(event: 'end', handler: EventHandler<'end', Name, Options, Middlewares>): CLI<Name, Options, Middlewares>

    /**
     * Sets an error handler in case the start event reject( an Error)
     * @param event The error event
     * @param handler The callback function
     * @returns The builder
     */
    public event(event: 'error', handler: EventHandler<'error', Name, Options, Middlewares>): CLI<Name, Options, Middlewares>

    /**
     * Fires upon one of the lifecycle events
     * @param event The event
     * @param handler The handler
     */
    public event<E extends Events = Events>(event: E, handler: EventHandler<E, Name, Options, Middlewares>): this {
        switch (event) {
            case 'error': {
                this.handlers[event] = async(options: Parameters<EventHandler<Events, Name, Options, Middlewares>>[0]) => {
                    const handle = handler(options as Parameters<EventHandler<'error', Name, Options, Middlewares>>[0])
                    if (handle instanceof Promise) {
                        await handle
                    }
                }
                return this as any
            }
            default: {
                this.handlers[event] = async(options: Parameters<EventHandler<Exclude<Events, 'error'>, Name, Options, Middlewares>>[0]) => {
                    const handle = (handler as EventHandler<Exclude<E, 'error'>, Name, Options, Middlewares>)(options)
                    if (handle instanceof Promise) {
                        await handle
                    }
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
     * @param cb the callback when the option has been selected, this will be executed
     *           before the `start` event of a command and it will fire for all child
     *           commands as well.
     * @returns 
     */
    public option<T extends string>(opt: T, description: string, cb?: (cli: this) => Promise<void>|void): CLI<Name, Options|T, Middlewares> {
        let option: typeof this['options'][number] = { description, included: false } as any
        option.cb = cb as any

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
     * Executes the given arguments in the CLI, the arguments are appended
     * to the arguments of `this.start`.
     * @param argv the arguments
     */
    public async executeArgv(...argv: string[]) {
        return await this.start([...this.argv, ...argv])
    }

    /**
     * Stars the CLI based on a certain context and command-line arguments
     * @param options the options
     * @param argv the arguments
     */
    public startContext = async(config: {
        /**
         * The context to run, there can only be one and there has to be one specified.
         */
        context: {
            /**
             * Starts a middleware
             */
            middleware?: {
                /**
                 * The current middleware, if any
                 */
                current?: Middlewares
                /**
                 * Name of the middleware to run
                 */
                name: Middlewares
                /**
                 * The arguments, will throw an error if there are commands in there.
                 */
                argv: string[]
                /**
                 * Whether to include the last argv in the arguments
                 */
                includeLastArgv?: boolean
                /**
                 * Whether to include commands in the current/last argv values
                 */
                includeCommands?: 'last' | 'current' | 'both'
            }
            /**
             * Starts a command based on arguments
             */
            argv?: {
                argv: string[]
            }
        }
    }) => {
        return new Promise<this>(async(resolve, reject) => {
            try {
                // Checks if there is exactly 1 context
                if (Object.keys(config.context).length !== 1) {
                    if (Object.keys(config.context).length === 0) {
                        throw Error(`There has to be one context specified in the config of the startContext function.`)
                    }
                    else {
                        throw Error(`There cannot be more than one context specified in the config of the startContext function.`)
                    }
                }
                
                this.logger.trace(`Starting context: "${Object.keys(config.context)[0]}"`)
                if (config.context.middleware) {
                    if (!this.middlewares.find((v) => v.name === config.context.middleware!.name && !v.initialization)) {
                        throw Error(`There's no middleware by the name of "${config.context.middleware}" in CLI "${this.name}"`)
                    }
                    this.currentMiddleware = config.context.middleware.current || null
                }

                // Set the argv
                const lastArgv = this.argv
                let argv = [
                    ...config.context.middleware
                        ? config.context.middleware.argv
                        : config.context.argv
                            ? config.context.argv.argv
                            : []
                ].filter(Boolean)

                // Include the last argv if its asked for, by default
                // a middleware won't use the last argv.
                if (config.context.middleware?.includeLastArgv || !argv.filter(Boolean).length) {
                    argv = [...lastArgv, ...argv]
                }

                // Only saves the argv when there are arguments
                // Set the argv, or reruns the same argv if it's empty
                if (argv.length) {
                    this.argv = [...argv]
                    await this.emitters.change.argv.emit(this.argv)
                }

                // TRACE the args
                this.logger.verbose({
                    lastArgv,
                    argv
                })
                
                // Reset the last options
                if (!config.context.middleware || !config.context.middleware.includeLastArgv) {
                    for (const option of this.allOptions) {
                        if (option.included) {
                            for (const propertyName of Object.keys(option.properties)) {
                                option.properties[propertyName].value = undefined
                            }
                            option.included = false
                        }
                    }
                }

                // Whether a command has been found or not so far
                let oneCommandFound = false

                // The executed commands
                let commandsToExecute: string[] = []

                // All the options that are found based on the arguments
                let options: typeof this.history[number]['options'] = []

                // Whether or not the initialization function has succeeded,
                // in other words; the next() function has been called
                let succeeded = true

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
                const loop = async(loopOptions: LoopOptions) => {
                    loop: for (let i = 0; i < argv.length; i ++) {
                        let arg = argv[i]
                        // It's an option
                        if (arg.startsWith('-')) {
                            const found = this.history[this.history.length - 1].allOptions.find((o) => `--${o.long}` === arg || (o.short && arg.toLowerCase().includes(o.short.toLowerCase()) && arg.startsWith('-') && !arg.startsWith('--')))
                            if (found) {
                                if (found.short && arg.toLowerCase().includes(found.short.toLowerCase()) && arg.startsWith('-') && !arg.startsWith('--')) {
                                    if (arg.replace(/^\-/g, '').length > 1) {
                                        this.logger.verbose(`Found short combo "${arg}"`)
                                        const letters = arg.replace(found.short, '').replace('-', '')
                                        const parsed: string[] = [found.short]
                                        options = [found]
                                        found.included = true
                                        for (const letter of letters) {
                                            if (parsed.includes(letter.toLowerCase())) {
                                                this.logger.verbose(`Duplicate short option: "${letter}"`)
                                            }
                                            const option = this.history[this.history.length - 1].allOptions.find((v) => v.short && v.short.toLowerCase() === letter.toLowerCase())
                                            if (option) {
                                                options.push(option)
                                                option.included = true
                                                parsed.push(letter.toLowerCase())
                                            }
                                            else {
                                                if (!loopOptions.ignoreIncompleteOptions) {
                                                    throw new Error(`No definition for short option "${letter}" could be found`)
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        this.logger.verbose(`Found short option: "${arg}"`)
                                        options = [found]
                                        found.included = true
                                    }
                                }
                                else if (arg.startsWith('--')) {
                                    this.logger.verbose(`Found option: "${arg}"`)
                                    options = [found]
                                    found.included = true
                                }
                            }
                            else {
                                if (arg.startsWith('-') && !arg.startsWith('--')) {
                                    if (!loopOptions.ignoreIncompleteOptions) {
                                        if (arg.length > 2) {
                                            throw new Error(`No definition for any of the short options "${arg}" could be found`)
                                        }
                                        else {
                                            throw new Error(`No definition for short option "${arg}" could be found`)
                                        }
                                    }
                                }
                                else if (arg.startsWith('--')) {
                                    if (!loopOptions.ignoreIncompleteOptions) {
                                        throw new Error(`No definition for option "${arg}" could be found`)
                                    }
                                }
                            }
                        }
                        // It's a command
                        else {
                            if (config.context.middleware) {
                                if (!config.context.middleware.includeCommands) {
                                    this.logger.verbose('BREAK')
                                    continue loop
                                }
                                else if (config.context.middleware.includeCommands !== 'both') {
                                    if (config.context.middleware.includeCommands === 'current') {
                                        if (config.context.middleware.includeLastArgv && i < lastArgv.length) {
                                            i = lastArgv.length - 1
                                            continue loop
                                        }
                                    }
                                    else if (config.context.middleware.includeCommands === 'last') {
                                        if (config.context.middleware.includeLastArgv && i >= lastArgv.length) {
                                            continue loop
                                        }
                                    }
                                }
                            }
                            let found = this.history[this.history.length - 1].allCommands.find((v) => v.name === argv[i])
                            if (found) {
                                this.history.push(found)
                                while (found) {
                                    i++
                                    found = found.commands.find((v) => v.name === argv[i])
                                    if (found) {
                                        arg = argv[i]
                                        this.history.push(found)
                                    }
                                }
                                i--
                                found = this.history[this.history.length - 1]
                                this.logger.verbose(`Found command: "${arg}"`)
                                if (oneCommandFound) {
                                    const lastCommand = this.history[this.history.length - 1]
                                    if (lastCommand) {
                                        this.logger.trace(`First executing previous command "${lastCommand.name}"`)
                                        if (succeeded) {
                                            if (loopOptions.ignoreCommands) {
                                                continue loop
                                            }
                                            // await this.executeCommand({
                                            //     command: lastCommand,
                                            //     execute: ['command']
                                            // })
                                            commandsToExecute.push(lastCommand.name)
                                        }
                                    }
                                }
                                oneCommandFound = true
                            }
                            else {
                                if (!arg.startsWith('-')) {
                                    throw new Error(`No definition for command "${arg}" could be found`)
                                }
                                return
                            }
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
                }

                // Execute the middleware of the cli
                if (config.context.argv) {
                    // Find all options, but skip commands
                    await loop({
                        ignoreCommands: true,
                        ignoreIncompleteOptions: true
                    })
                    // Store the succeeded variable
                    this.logger.trace(`Firing initializations`)
                    succeeded = await this.executeCommand({
                        command: this,
                        execute: ['initialization']
                    })
                }

                // Start finding commands and options
                await loop({})
                
                // Finish up when the context is arguments
                if (config.context.argv) {
                    // Fire the middleware
                    this.logger.trace(`Firing middleware at end of function`)
                    if (succeeded) {
                        succeeded = await this.executeCommand({
                            command: this,
                            execute: ['middleware']
                        })
                    }

                    // Skips the middleware if the initialization failed
                    if (succeeded) {
                        // Fire the command if not done already
                        const lastCommand = this.history[this.history.length - 1] || this
                        if (!commandsToExecute.includes(lastCommand.name)) {
                            commandsToExecute.push(lastCommand.name)
                        }
                        // Execute all commands
                        for (const name of commandsToExecute) {
                            const command = (lastCommand || this).allCommands.find((v) => v.name === name)
                            if (!command) {
                                throw Error(`Something went terribly wrong, trying to execute non-existing command`)
                            }
                            // Skip commands that are in deeper CLI's, which will
                            // set the skip value. (See types.ts -> CLIMaster@convertToCommand)
                            if (!this.skip.includes(name)) {
                                await this.executeCommand({
                                    command,
                                    execute: ['command']
                                })
                            }
                        }
                        // Reset skip
                        this.skip = []
                    }
                }

                // When its middleware
                else if (config.context.middleware) {
                    if (succeeded) {
                        const middleware = this.middlewares.find((v) => v.name === config.context.middleware!.name && !v.initialization)
                        if (middleware) {
                            await middleware.cb({
                                cli: this,
                                options: this.lastOptions,
                                next: async() => {
                                    this.argv = lastArgv
                                    this.currentMiddleware = null
                                }
                            })
                            return resolve(this)
                        }
                        else {
                            throw Error(`Something went terribly wrong, this check should already be done at the start of the function!!!`)
                        }
                    }
                }
            }
            catch (err) {
                const handler = this.handlers.error
                if (handler) {
                    const handle = handler({
                        error: err instanceof Error ? err : new Error(err as any),
                        cli: this,
                        options: this.lastOptions
                    })
                    if (handle instanceof Promise) {
                        await handle
                    }
                    if (!config.context.argv) {
                        return resolve(this)
                    }
                }
                else {
                    return reject(err)
                }
            }
            try {
                const endHandler = this.handlers['end']
                if (endHandler) {
                    this.logger.trace(`Running command "${this.name}" end event`)
                    await endHandler({
                        cli: this,
                        options: this.lastOptions
                    })
                }
                return resolve(this)
            }
            catch (err) {
                const handler = this.handlers.error
                if (handler) {
                    const handle = handler({
                        error: err instanceof Error ? err : new Error(err as any),
                        cli: this,
                        options: this.lastOptions
                    })
                    if (handle instanceof Promise) {
                        await handle
                    }
                    return resolve(this)
                }
                else {
                    return reject(err)
                }
            }
        })
    }

    /**
     * Starts the CLI with the specified command-line arguments.
     * @param {string[]} [argv=process.argv] The command-line arguments, make sure not to include the first two
     *                                       entries of node.js if using process.argv
     */
    public async start(argv: string[] = process.argv.filter((v, i) => i > 1)) {
        await this.startContext({ context: { argv: { argv } } })
    }

    /**
     * Executes a command
     * @param command the command to execute
     * @return {boolean} false if the next() function has NOT been called in case of middlewares or initializations, otherwise true
     */
    private executeCommand = async(config: {
        command: CLI<any, any, any>,
        execute: ('middleware'|'initialization'|'command')[]
    }): Promise<boolean> => {
        const {
            command,
            execute
        } = config
        if (!command.handlers.start) {
            this.logger.info(`Command "${command.name}" has no "start" event specified`)
        }
        const runCommand = async() => {
            this.logger.verbose(`Running command "${command.name}" start event`)
            if (command.handlers.start) {
                await command.handlers.start({
                    cli: this,
                    options: this.lastOptions
                })
            }
        }
        if (execute.includes('middleware') || execute.includes('initialization')) {
            let middlewares: typeof this.middlewares = []
            let parent: CLI<any, any, any>|undefined = command
            let nextHasBeenCalled = false
            while (parent) {
                middlewares = [...(parent.middlewares || []), ...middlewares].filter((m) => m.name !== this.currentMiddleware && (execute.includes('initialization') || !m.initialization))
                if (!execute.includes('middleware')) {
                    middlewares = middlewares.filter((v) => v.initialization)
                }
                parent = parent.parent
            }
            if (middlewares.length) {
                const call = async(i: number = 0) => {
                    nextHasBeenCalled = false
                    if (middlewares[i]) {
                        let middlewareStart = middlewares.filter((v) => v.initialization).length
                        if (i < middlewareStart) {
                            this.logger.trace(`Firing initialization "${middlewares[i].name}" ${i + 1}/${middlewareStart}`)
                        }
                        else {
                            this.logger.trace(`Firing middleware "${middlewares[i].name}" ${(i - middlewareStart) + 1}/${middlewares.length - middlewareStart}`)
                        }
                        await middlewares[i].cb({
                            options: this.lastOptions,
                            next: async() => {
                                this.logger.verbose(i === middlewares.length - 1 ? `All middlewares have been executed` : `Next middleware`)
                                nextHasBeenCalled = true
                                await call(i + 1)
                            },
                            cli: this
                        })
                    }
                    else if (execute.includes('command')) {
                        nextHasBeenCalled = true
                        await runCommand()
                    }
                    else {
                        nextHasBeenCalled = true
                    }
                }
                await call()
                return nextHasBeenCalled
            }
            else if (execute.includes('command')) {
                await runCommand()
            }
        }
        else if (execute.includes('command')) {
            await runCommand()
        }
        return true
    }
}