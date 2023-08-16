import Logger from "../../../utils/logger"
import chalk from "chalk"
import TextRange from "./text-range"
import TextPosition from "./text-position"
import TextDocumentNode from "./text-document-node"

/**
 * The logger for text documents
 */
export default class TextDocumentLogger extends Logger {
    /**
     * The amount of indents per level
     */
    protected override indentsPerLevel: number = 4

    /**
     * The text range in which the logger will log anything,
     * which can be provided by using `--range [x:y]-[x:y]`
     */
    private range: TextRange | null = null

    /**
     * Constructs the logger
     * @param node the current node
     */
    constructor(private node: TextDocumentNode) {
        super()
        const range = /(?<=\-\-range\s*)(([0-9])+\:([0-9]+))((\-)(([0-9]+)\:([0-9]+)))?/g.exec(process.argv.join(' '))
        if (range) {
            const startPosition = range[1]
            const endPosition = range[6]
            if (startPosition) {
                if (endPosition) {
                    this.range = new TextRange(
                        new TextPosition(
                            Number(range[2] || 1) - 1,
                            Number(range[3] || 1) - 1
                        ),
                        new TextPosition(
                            Number(range[7] || 1) - 1,
                            Number(range[8] || 1) - 1
                        )
                    )
                }
                else {
                    this.range = new TextRange(
                        new TextPosition(
                            Number(range[2] || 1) - 1,
                            Number(range[3] || 1) - 1
                        ),
                        new TextPosition(
                            Number(range[2] || 1) - 1,
                            Number(range[3] || 1) - 1
                        )
                    )
                }
            }
        }
    }

    /**
     * Prints a new position
     * @param text the text
     * @param node the node
     */
    public position = (text: string) => {
        this.perform({ type: 'trace' }, `${chalk.bold.bgHex(this.colors.info).hex('#333333')(` ${text} `)}`)
    }

    /**
     * Prints the parent
     * @param text the text
     * @param node the node
     */
    public parent = (text: string) => {
        this.perform({ type: 'trace', node: this.node.options.data.parent || this.node }, `${chalk.bold.bgHex(this.getColor()).hex('#333333')(` ${text} `)}`)
    }

    /**
     * Prints the child
     * @param data 
     */
    public child = (child: TextDocumentNode) => {
        this.type(child.options.data.type)
        if (child.name?.length && child.name !== child.options.data.pattern?.name) {
            this.property('Name', child, child.name)
        }
        if (child.scope) {
            this.property('Scope', child, child.scope)
        }
        if ((child.options.data.status || []).length) {
            this.property('Status', child, ...(child.options.data.status || []))
        }
    }

    /**
     * Prints a type of the node
     * @param type the type
     * @param node the node
     */
    public type = (type: string) => {
        this.perform({ type: 'trace' }, `${chalk.bgHex(this.getColor()).bold(` ${type} `)}`)
    }

    /**
     * Prints a property
     * @param name the name
     * @param value the value
     */
    public property = (name: string, node: TextDocumentNode, ...value: string[]) => {
        this.perform({ type: 'trace' }, `${chalk.hex(this.getColor())(` ${name} `)}${value.map((v) => chalk.bold.bgHex(this.getColor())(` ${v} `)).join(' ')}`)
    }

    protected override perform(options: { type: 'verbose' | 'debug' | 'trace' | 'info', node?: TextDocumentNode }, ...data: any[]): void {
        let {
            type,
            node
        } = options
        node = node || this.node
        const flags = {
            verbose: ['--verbose'],
            debug: ['--verbose', '--debug'],
            trace: ['--verbose', '--debug', '--trace'],
            info: [] as string[]
        }[type]
        if (flags.length && !process.argv.find((v) => flags.includes(v))) {
            return
        }
        if (this.range && !this.range.includes(this.node.options.token.document.position)) {
            return
        }
        if (!node) {
            return
        }
        for (const d of data) {
            if (typeof d === 'string' || typeof d === 'boolean' || typeof d === 'number' || typeof d === 'bigint' || typeof d === 'function' || typeof d === 'symbol' || typeof d === 'undefined') {
                const level = node.level
                const indents = new Array(level).fill(level).map((v, i) => new Array(this.indentsPerLevel).fill('').map((v, j) => chalk.hex(this.getColorForLevel(i + (j / this.indentsPerLevel)))('.')).join('')).join('')
                console.log(`${indents}${d}`)
            }
            else {
                this.logObject(node.level, d, type)
            }
        }
    }
}