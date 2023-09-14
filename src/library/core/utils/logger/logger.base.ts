/**
 * The types of logger messages
 */
export type LoggerMessageTypes = 'info' | 'warn' | 'success' | 'error' | 'trace' | 'debug' | 'verbose'

/**
 * Abstract base class for loggers.
 */
export default abstract class Logger {
    /**
     * Get the current theme colors
     */
    protected abstract get colors(): Record<string, string>

    /**
     * The amount of indents per level
     */
    protected indentsPerLevel: number = 4

    /**
     * The process.argv arguments used for this logger
     */
    protected abstract get argv(): string[]

    /**
     * Prints a message for the clients to see, except if the type
     * provided is verbose, debug or trace.
     * @param options the options
     * @param data any data
     */
    public label(type: LoggerMessageTypes, label: string, ...data: any[]) {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? `[${label.substring(0, 1).toUpperCase()}${label.substring(1)}] ${d}`
            : d
        this.perform({ type: type }, ...data.map((v) => convert(v)))
    }

    /**
     * Prints a warning message for the clients to see
     * @param data any data
     */
    public success(...data: any[]): void {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? `[Success] ${d} `
            : d
        this.perform({ type: 'success' }, ...data.map((v) => convert(v)))
    }

    /**
     * Prints a warning message for the clients to see
     * @param data any data
     */
    public warn(...data: any[]): void {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? `[Warn] ${d} `
            : d
        this.perform({ type: 'warn' }, ...data.map((v) => convert(v)))
    }

    /**
     * Prints an error message for the clients to see
     * @param data any data
     */
    public error(...data: any[]): void {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? `[Error] ${d}`
            : d
        this.perform({ type: 'error' }, ...data.map((v) => convert(v)))
    }

    /**
     * Prints a message for the clients to see
     * @param data any data
     */
    public info(...data: any[]): void {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? `[Info] ${d} `
            : d
        this.perform({ type: 'info' }, ...data.map((v) => convert(v)))
    }

    /**
     * Prints a message when the --verbose, --debug or --trace flag is present,
     * this is the lowest level of debug information.
     * @param data any data
     */
    public trace(...data: any[]): void {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? `[Trace] ${d} `
            : d
        this.perform({ type: 'trace' }, ...data.map((v) => convert(v)))
    }

    /**
     * Prints a message when the --verbose or --debug flag is present,
     * this is the default level of debug information.
     * @param data any data
     */
    public debug(...data: any[]): void {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? `[Debug] ${d} `
            : d
        this.perform({ type: 'debug' }, ...data.map((v) => convert(v)))
    }

    /**
     * Prints a message when the --verbose flag is present,
     * this is the highest level of debug information.
     * @param data any data
     */
    public verbose(...data: any[]): void {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? `[Verbose] ${d} `
            : d
        this.perform({ type: 'verbose' }, ...data.map((v) => convert(v)))
    }

    /**
     * Performs printing the log message
     * @param options options
     * @param data the data
     * @returns 
     */
    protected perform(options: { type: LoggerMessageTypes }, ...data: any[]): void {
        let {
            type
        } = options
        const flags = {
            verbose: ['--verbose'],
            debug: ['--verbose', '--debug'],
            trace: ['--verbose', '--debug', '--trace'],
            info: [] as string[],
            warn: [] as string[],
            error: [] as string[],
            success: [] as string[]
        }[type]
        if (flags.length && !this.argv.find((v) => flags.includes(v))) {
            return
        }
        for (const d of data) {
            if (typeof d === 'string' || typeof d === 'boolean' || typeof d === 'number' || typeof d === 'bigint' || typeof d === 'function' || typeof d === 'symbol' || typeof d === 'undefined') {
                console.log(`${d} `)
            }
            else {
                console.log(d)
            }
        }
    }
}