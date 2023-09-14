import chalk from 'chalk'
import Theme from '../../../theme/theme'
import Terminal from '../../terminal'
import Control from '../control/control'

/**
 * An item in the select
 */
export interface SelectItem {
    label: string
}

/**
 * The options
 */
export interface SelectOptions {
    /**
     * The output stream
     */
    stdout: NodeJS.WriteStream

    /**
     * The input stream
     */
    stdin: NodeJS.ReadStream

    /**
     * The selected index
     */
    selected: number
}

/**
 * Provides a select menu in the terminal
 */
export default class Select extends Control {
    /**
     * The (default) options
     */
    private options: SelectOptions = {
        stdout: process.stdout,
        stdin: process.stdin,
        selected: 0
    }

    /**
     * The options when rendered the last time
     */
    private lastOptions: SelectOptions|null = null

    constructor(private items: SelectItem[], options: Partial<SelectOptions> = {}) {
        super(options.stdin || process.stdin, options.stdout || process.stdout)
        this.options = {
            ...this.options,
            ...options
        }
        this.items = items
    }

    /**
     * Renders an item
     */
    public async render() {
        // Initialization
        if (this.lines.start === null) {
            this.lines.start = Terminal.lines
        }
        // Conditions to rerender
        const rerender = this.lastOptions
            ? this.lastOptions.selected !== this.options.selected
            : true
        // Rerender the select
        if (rerender) {
            const getLabel = (index: number) => {
                const item = this.items[index]
                return this.options.selected === index
                ? chalk.hex(Theme.current.colors.primary).bold(item.label)
                : chalk.hex(Theme.current.colors.light)(item.label)
            }
            // The first render
            if (!this.lastOptions) {
                for (let index = 0; index < this.items.length; index ++) {
                    const label = getLabel(index)
                    await this.write(`${this.options.selected === index ? chalk.hex(Theme.current.colors.primary)('>') + ' ' : '  '}${label}\n`)
                }
            }
            else {
                await this.write(`${this.unicodes.line.clear}`)
                for (let i = 0; i < this.items.length + (Terminal.lines - (this.lines.end || Terminal.lines)); i ++) {
                    await this.write(`${this.unicodes.line.prev}${this.unicodes.line.clear}`)
                }
                for (let index = 0; index < this.items.length; index ++) {
                    const label = getLabel(index)
                    await this.write(`${this.unicodes.line.start}${this.options.selected === index ? chalk.hex(Theme.current.colors.primary)('>') + ' ' : '  '}${label}${this.unicodes.line.next}${this.unicodes.line.start}`)
                }
            }
        }
        // Save the last options
        this.lines.end = Terminal.lines
        this.lastOptions = Object.assign({}, this.options)
        this.options.stdin.setRawMode(true)
        // Await user input
        await this.keypress(
            {
                key: {
                    name: 'down'
                },
                matched: async() => {
                    this.options.selected++
                    await this.write(this.unicodes.line.clear)
                }
            },
            {
                key: {
                    name: 'up'
                },
                matched: async() => {
                    this.options.selected--
                    await this.write(this.unicodes.line.clear)
                }
            }
        )
        this.options.stdin.setRawMode(false)
        this.options.selected = Math.max(Math.min(this.items.length - 1, this.options.selected), 0)
        // Rerender
        await this.render()
    }
}