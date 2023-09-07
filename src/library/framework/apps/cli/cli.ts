import Hurx from "../../hurx"
import { Option, Events, EventHandler, CommandOptions, MiddlewareOptions, CLICommand, CLIMaster } from "./types"

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
     * The parent CLI instance.
     * @type {CLI|undefined}
     */
    public parent?: CLI<any, any, any> = undefined

    /**
     * The type of CLI
     */
    public type: 'command'|'cli' = 'command'

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
        let parent: CLI<any, any, any> | undefined = this.history[this.history.length - 1].parent
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
     * What has been executed of this cli
     */
    public executed: Array<'initialization'|'middleware'|'command'> = []

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
    public skip: boolean = false

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
    private lastOptions: CommandOptions<Options> = {} as any

    /**
     * The logger instance used for logging messages.
     */
    public get logger() {
        return Hurx.logger
    }

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
        this.middlewares.push(...cli.middlewares.filter((v) => !this.middlewares.map((v) => v.name).includes(v.name as any)) as any[])
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
     * to the arguments of `this.start`. Initializations are skipped.
     * @param argv the arguments
     */
    public async executeArgv(...argv: string[]) {
        const nodes: Array<[typeof this, typeof this.executed]> = []
        for (let i = this.history.length - 1; i >= 0; i --) {
            let history = this.history[i]
            let parent: typeof history.parent = history
            while (parent) {
                nodes.push([parent as this, [...parent.executed]])
                parent.executed = []
                parent = parent.parent
            }
        }
        const lastCommand = this.history[this.history.length - 1]
        const lastCommandExecuted = [...lastCommand.executed]
        lastCommand.executed = ['initialization', 'command']
        const cli = await lastCommand.start([...Hurx.argv, ...argv])
        for (const [parent, executed] of nodes) {
            parent.executed = executed
        }
        lastCommand.executed = [...lastCommandExecuted]
        return cli
    }

    /**
     * Stars the CLI based on a certain context and command-line arguments
     * @param argv the arguments
     * @param startOptions the options
     */
    public start = async(argv: string[] = process.argv.filter((v, i) => i > 1)) => {
        return new Promise<this>(async(resolve, reject) => {
            try {
                this.logger.verbose(`Starting context`)

                // Set the argv
                const lastArgv = Hurx.argv
                argv = argv.filter(Boolean)

                // Include the last argv if its asked for, by default
                // a middleware won't use the last argv.
                if (!argv.filter(Boolean).length) {
                    argv = [...lastArgv]
                }

                // Only saves the argv when there are arguments
                // Set the argv, or reruns the same argv if it's empty
                else {
                    Hurx.argv = [...argv]
                }

                // TRACE the args
                this.logger.verbose({
                    lastArgv,
                    argv
                })
                
                // Reset the last options
                for (const option of this.allOptions) {
                    if (option.included) {
                        for (const propertyName of Object.keys(option.properties)) {
                            option.properties[propertyName].value = undefined
                        }
                        option.included = false
                    }
                }

                // Whether a command has been found or not so far
                let oneCommandFound = false


                // All the options that are found based on the arguments
                let options: typeof this.history[number]['options'] = []
                let lastOptions: typeof this.history[number]['options'] = []

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
                const loop = async(loopOptions: LoopOptions): Promise<number> => {
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
                                        options = [...options, found]
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
                                        options = [...options, found]
                                        found.included = true
                                    }
                                }
                                else if (arg.startsWith('--')) {
                                    this.logger.verbose(`Found option: "${arg}"`)
                                    options = [...options, found]
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
                            const last = this.history[this.history.length - 1] || this
                            let found = last.allCommands.find((v) => v.name === argv[i])
                            if (found) {
                                if (last !== found) {
                                    found.parent = last
                                }
                                this.history.push(found)
                            }
                            if (loopOptions.ignoreCommands) {
                                return i
                            }
                            if (found) {
                                while (found) {
                                    i++
                                    found = found.commands.find((v) => v.name === argv[i])
                                    if (found) {
                                        arg = argv[i]
                                        if (last !== found) {
                                            found.parent = this.history[this.history.length - 1]
                                        }
                                        this.history.push(found)
                                    }
                                }
                                i--
                                found = this.history[this.history.length - 1]
                                this.logger.verbose(`Found command: "${arg}"`)
                                if (oneCommandFound) {
                                    const lastCommand = this.history[this.history.length - 2]
                                    if (lastCommand) {
                                        this.logger.trace(`First executing previous command "${lastCommand.name}"`)
                                        // Checks whether the initialization and middleware commands have succeeded
                                        if (succeeded) {
                                            // Ignore the commands or type is cli, break the loop
                                            if (loopOptions.ignoreCommands || lastCommand.type === 'cli') {
                                                return i
                                            }
                                            // Last command was of type "command", so execute it
                                            else {
                                                await lastCommand.executeCommand({
                                                    execute: ['command']
                                                })
                                                this.lastOptions = {} as any
                                                lastOptions = []
                                            }
                                        }
                                    }
                                }
                                oneCommandFound = true
                            }
                            else {
                                if (!arg.startsWith('-')) {
                                    throw new Error(`No definition for command "${arg}" could be found`)
                                }
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
                            const _options = {} as any
                            for (const option of options) {
                                if (option.included) {
                                    _options[option.long] = {}
                                    for (const propertyName of Object.keys(option.properties)) {
                                        const property = option.properties[propertyName]
                                        if (property.value !== undefined) {
                                            _options[option.long][propertyName] = property.value
                                        }
                                    }
                                }
                            }
                            this.lastOptions = {...this.lastOptions, ..._options}
                            lastOptions = [...lastOptions, ...options]
                            options = []
                        }
                    }
                    const _options = {} as any
                    const lastCommand = this.history[this.history.length - 1]
                    if (lastCommand && !lastCommand.executed.includes('command')) {
                        for (const option of lastOptions) {
                            if (option.included) {
                                _options[option.long] = {}
                                for (const propertyName of Object.keys(option.properties)) {
                                    const property = option.properties[propertyName]
                                    if (property.value !== undefined) {
                                        _options[option.long][propertyName] = property.value
                                    }
                                }
                            }
                        }
                        this.lastOptions = {...this.lastOptions, ..._options}
                        // Execute the last command found if it didnt happen already, and if it isn't of type CLI
                        if (!loopOptions.ignoreCommands && lastCommand.type !== 'cli' && !lastCommand.executed.includes('command')) {
                            // Run the command
                            lastCommand.argv = []
                            await lastCommand.executeCommand({
                                execute: ['command']
                            })
                        }
                    }
                    return argv.length - 1
                }

                // Find all options, but skip commands
                const index = await loop({
                    ignoreCommands: true,
                    ignoreIncompleteOptions: true
                })

                // Find the last command
                const lastCommand = this.history[this.history.length - 1]
                
                // Run the nested CLI
                if (lastCommand.type === 'cli') {
                    if (lastCommand !== this) {
                        lastCommand.argv = argv.filter((v, j) => j > index)
                        this.argv = argv.filter((v, j) => j <= index)
                        await lastCommand.start(lastCommand.argv)
                    }
                }

                // Run the command
                else {
                    const pass = await this.executeCommand({
                        execute: ['initialization', 'middleware']
                    })
                    if (pass) {
                        await lastCommand.executeCommand({
                            execute: ['command']
                        })
                        const argv2 = argv.filter((v, j) => j > index)
                        if (argv2.length) {
                            await this.start(argv2)
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
     * Executes a command
     * @param command the command to execute
     * @return {boolean} false if the next() function has NOT been called in case of middlewares or initializations, otherwise true
     */
    private executeCommand = async(config: {
        execute: ('middleware'|'initialization'|'command')[]
    }): Promise<boolean> => {
        const {
            execute
        } = config
        const command = this
        if (execute.filter((v) => !command.executed.includes(v)).length === 0) {
            return true
        }
        if (!execute.length) {
            return true
        }
        if (!command.handlers.start) {
            command.logger.info(`Command "${command.name}" has no "start" event specified`)
        }
        const runCommand = async(command: CLI<any, any, any>) => {
            const includes = command.executed.includes('command')
            if (command.handlers.start && !includes) {
                command.logger.verbose(`Running command "${command.name}" start event`)
                await command.handlers.start({
                    cli: command,
                    options: command.lastOptions
                })
                command.executed.push('command')
            }
        }
        if (execute.includes('middleware') || execute.includes('initialization')) {
            let middlewares: Array<[typeof this, CLI<any, any, any>['middlewares']]> = []
            let initializations: Array<[typeof this, CLI<any, any, any>['middlewares']]> = []
            let parent: CLI<any, any, any>|undefined = command
            let nextHasBeenCalled = false
            while (parent) {
                if (!parent.executed.includes('middleware')) {
                    middlewares = [[parent as this, [...(parent.middlewares || [])].filter((m) => m.name !== this.currentMiddleware && (execute.includes('middleware') && !m.initialization))], ...middlewares]
                }
                if (!parent.executed.includes('initialization')) {
                    initializations = [[parent as this, [...(parent.middlewares || [])].filter((m) => m.name !== this.currentMiddleware && (execute.includes('initialization') && m.initialization))], ...initializations]
                }
                parent = parent.parent
            }
            if (execute.includes('initialization')) {
                middlewares = [...initializations, ...middlewares]
                if (!execute.includes('middleware')) {
                    middlewares = [...initializations]
                }
            }
            else {
                middlewares = [...middlewares]
            }
            if (middlewares.length) {
                const call = async(middlewareIndex: number = 0, commandIndex: number = 0): Promise<boolean> => {
                    nextHasBeenCalled = false
                    if (middlewares[middlewareIndex][1][commandIndex]) {
                        let middlewareStart = middlewares[middlewareIndex][1].filter((v) => v.initialization).length
                        if (commandIndex < middlewareStart) {
                            command.logger.trace(`Firing initialization "${middlewares[middlewareIndex][1][commandIndex].name}" ${commandIndex + 1}/${middlewareStart}`)
                        }
                        else {
                            command.logger.trace(`Firing middleware "${command.name}"->"${middlewares[middlewareIndex][1][commandIndex].name}" ${(commandIndex - middlewareStart) + 1}/${middlewares[middlewareIndex][1].length - middlewareStart}`)
                        }
                        await middlewares[middlewareIndex][1][commandIndex].cb({
                            options: command.lastOptions,
                            next: async() => {
                                command.logger.verbose(commandIndex === middlewares.length - 1 ? `All middlewares have been executed` : `Next middleware`)
                                nextHasBeenCalled = true
                                await call(middlewareIndex, commandIndex + 1)
                            },
                            cli: command
                        })
                    }
                    else if (middlewares.length - 1 === middlewareIndex) {
                        nextHasBeenCalled = true
                        middlewares[middlewareIndex][0].executed.push(...execute.filter((v) => v !== 'command'))
                        if (execute.includes('command')) {
                            await runCommand(middlewares[middlewareIndex][0])
                            return nextHasBeenCalled
                        }
                    }
                    else {
                        nextHasBeenCalled = true
                        middlewares[middlewareIndex][0].executed.push(...execute.filter((v) => v !== 'command'))
                        return await call(middlewareIndex + 1, 0)
                    }
                    return nextHasBeenCalled
                }
                return await call(0, 0) || nextHasBeenCalled
            }
            else if (execute.includes('command')) {
                await runCommand(command)
                return nextHasBeenCalled
            }
        }
        else if (execute.includes('command')) {
            await runCommand(command)
            return true
        }
        return true
    }
}