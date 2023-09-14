import chalk from "chalk"
import Theme from "../theme/theme"
import Hurx from "../../../framework/node/hurx"
import { default as LoggerBase, LoggerMessageTypes } from "./logger.base"
import JSON from "../json"
import Color from "../theme/color"

/**
 * The interface for logger services.
 * @author Stan Hurks
 */
export default class Logger extends LoggerBase {
    /**
     * Get the current theme colors
     */
    public get colors() {
        return Theme.current.colors
    }

    /**
     * The process.argv arguments used for this logger
     */
    public get argv(): string[] {
        return Hurx.argv
    }

    public label(type: LoggerMessageTypes, label: string, ...data: any[]) {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? chalk.bgHex('#222222').hex(this.colors[type])(` ${label.substring(0, 1).toUpperCase()}${label.substring(1)} `) + chalk.hex(this.colors[type]).bold.bgHex(this.colors.dark)(` ${d} `)
            : d
        this.perform({ type: type, label: label }, ...data.map((v) => convert(v)))
    }

    public success(...data: any[]): void {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? chalk.bgHex('#222222').hex(this.colors.success)(` Success `) + chalk.hex(this.colors.success).bold.bgHex(this.colors.dark)(` ${d} `)
            : d
        this.perform({ type: 'success' }, ...data.map((v) => convert(v)))
    }

    public warn(...data: any[]): void {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? chalk.bgHex('#222222').hex(this.colors.warn)(` Warn `) + chalk.hex(this.colors.warn).bold.bgHex(this.colors.dark)(` ${d} `)
            : d
        this.perform({ type: 'warn' }, ...data.map((v) => convert(v)))
    }

    public error(...data: any[]): void {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? chalk.bold.bgHex('#222222').hex(this.colors.error)(` Error `) + chalk.bgHex(this.colors.dark).hex(this.colors.error).bold(` ${d} `)
            : d instanceof Error
                ? chalk.bold.bgHex('#222222').hex(this.colors.error)(` Error `) + chalk.bgHex(this.colors.dark).hex(this.colors.error).bold(` ${d.message} `) + (d.stack ? chalk.hex(this.colors.error)(`\n${d.stack.split(/\n|\r\n|\r/).filter((v, i) => i > 0).join('\n')} `) : '')
                : d
        this.perform({ type: 'error' }, ...data.map((v) => convert(v)))
    }

    public info(...data: any[]): void {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? chalk.bgHex('#222222').hex(this.colors.info)(` Info `) + chalk.hex(this.colors.info).bold.bgHex(this.colors.dark)(` ${d} `)
            : d
        this.perform({ type: 'info' }, ...data.map((v) => convert(v)))
    }

    public trace(...data: any[]): void {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? chalk.bgHex('#222222').hex(this.colors.trace)(` Trace `) + chalk.hex(this.colors.trace).bold.bgHex(this.colors.dark)(` ${d} `)
            : d
        this.perform({ type: 'trace' }, ...data.map((v) => convert(v)))
    }

    public debug(...data: any[]): void {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? chalk.bgHex('#222222').hex(this.colors.debug)(` Debug `) + chalk.hex(this.colors.debug).bold.bgHex(this.colors.dark)(` ${d} `)
            : d
        this.perform({ type: 'debug' }, ...data.map((v) => convert(v)))
    }

    public verbose(...data: any[]): void {
        const convert = (d: any) => ['string', 'number', 'boolean', 'bigint'].includes(typeof d)
            ? chalk.bgHex('#222222').hex(this.colors.verbose)(` Verbose `) + chalk.hex(this.colors.verbose).bold.bgHex(this.colors.dark)(` ${d} `)
            : d
        this.perform({ type: 'verbose' }, ...data.map((v) => convert(v)))
    }

    /**
     * Performs printing the log message
     * @param options options
     * @param data the data
     * @returns 
     */
    protected override perform(options: { type: LoggerMessageTypes, label?: string }, ...data: any[]): void {
        let {
            type,
            label
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
                this.logObject(0, d, type, label)
            }
        }
    }

    /**
     * Formats and logs an object
     * @param level the level of indentation the object should start at
     * @param object the object or array
     * @param type the type of level the message is for
     * @param label TODO: log label
     */
    public logObject = (level: number, object: any, type: LoggerMessageTypes, label?: string) => {
        JSON.serialize(object, this.indentsPerLevel).replace(/^/, '\n').split('\n').forEach((v, i) => {
            // Get the level of the current line
            const color = this.getColor(type, v)

            // Insert indentation based on level and json indents
            let objectLevel = 0
            let match = v.match(/^\s*(?=[0-9]|true|false|null|\"|\}|\{|\[|\])/)
            if (match) {
                objectLevel += Math.floor(match[0].length / this.indentsPerLevel)
            }
            
            objectLevel += level
            v = new Array(level).fill(new Array(this.indentsPerLevel).fill(' ').join('')).join('') + v
            v = v.replace(/^\s*(?=[0-9]|true|false|null|\"|\}|\{|\[|\])/, new Array(objectLevel).fill(objectLevel).map((v, i) => new Array(this.indentsPerLevel).fill('').map((v, j) => chalk.hex(this.getColorForLevel(type, i + (j / this.indentsPerLevel)))('.')).join('')).join(''))

            // Log the type
            if (i === 0) {
                console.log(new Array(objectLevel).fill('').map((v, i) => new Array(this.indentsPerLevel).fill('').map((v, j) => chalk.hex(this.getColorForLevel(type, i + j / this.indentsPerLevel))('.')).join('')).join('') + chalk.bgHex('#222222').hex(this.colors[type])(` ${type.toUpperCase()[0]}${type.toLowerCase().substring(1)} `) + chalk.bgHex(this.colors[type]).bold.hex(this.colors.dark)(` ${typeof object} `))
                return
            }

            // Replace quotes
            match = v.match(/\".*\"(?=\:)/)
            if (match) {
                v = v.replace(match[0], chalk.bgHex(color).bold.hex('#333333')(match[0].replace(/^\"/, ' ').replace(/\"$/, ' ')))
            }

            // Replace brackets
            v = v.replace(/(\{(?=\,|\}))|(\{)$/, chalk.hex(color)('{'))
            v = v.replace(/(\}(?=\,))|(\})$/, chalk.hex(color)('}'))
            v = v.replace(/(\[(?=\,|\]))|(\[)$/, chalk.hex(color)('['))
            v = v.replace(/(\](?=\,))|(\])$/, chalk.hex(color)(']'))

            // Replace booleans
            v = v.replace(/true((?=\,)|$)/g, chalk.hex('#FF488E')('true'))
            v = v.replace(/null((?=\,)|$)/g, chalk.hex('#FF488E')('null'))
            v = v.replace(/false((?=\,)|$)/g, chalk.hex('#FF488E')('false'))

            // Replace strings
            match = v.match(/(((?<=\:) )|((\u001b\[0-9;]*[A-Za-z])|(\s|.))*)\".+\"((?=\,)|$)/)
            if (match) {
                v = v.replace(match[0], chalk.hex('#74CDFF')(match[0]))
            }

            // Replace numbers
            match = v.match(/(?<=((\u001b\[0-9;]*[A-Za-z])|\s)*)(\-)?[0-9]+(\.[0-9]+)?((?=\,)|$)/)
            if (match) {
                v = v.substring(0, match.index || 0) + chalk.hex('#FFEE7E')(match[0]) + v.substring((match.index || 0) + match[0].length)
            }

            // Replace commas
            v = v.replace(/\,$/, chalk.hex('#333333')(''))
            v = v.replace(/(?<=^((\u001b\[0-9;]*[A-Za-z])|[^\"])*)\:/g, chalk.hex('#333333')(''))

            console.log(v)
        })
    }

    /**
     * Get the color based on the indentation level, based on the current
     * node and it will be increased based on the amount of indentations
     * at the beginning of `string`.
     *  
     * @param string the string to check the amount of spaces in (optional)
     * @returns the shifted color in hue
     */
    public getColor = (type: keyof typeof this.colors, string: string = '') => {
        let match = string.match(/^\s*/)
        let level = 0
        if (match) {
            level += match[0].length / this.indentsPerLevel
        }
        return this.getColorForLevel(type, level)
    }

    /**
     * Get the color based on the indentation level.
     *  
     * @param string the string to check the amount of spaces in (optional)
     * @returns the shifted color in hue
     */
    public getColorForLevel = (type: keyof typeof this.colors, level: number) => {
        return Color.changeHue(this.colors[type], level * 12)
    }
}