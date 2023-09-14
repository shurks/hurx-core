import Terminal from "../../terminal"
import Control from "../control/control"
import LabelOptions from "./options"

/**
 * A label as a control
 */
export default class Label extends Control {
    /**
     * The (default) options
     */
    private options: LabelOptions = {
        stdout: process.stdout,
        stdin: process.stdin,
        content: ''
    }

    /**
     * The options when rendered the last time
     */
    private lastOptions: LabelOptions|null = null

    constructor(options: LabelOptions) {
        super(options?.stdin || process.stdin, options?.stdout || process.stdout)
        this.options = {
            ...this.options,
            ...options
        }
    }

    public async render(): Promise<void> {
        // Initialization
        if (!this.lines.start) {
            this.lines.start = Terminal.lines
        }
        // Conditions to rerender
        const rerender = this.lastOptions
            ? this.lastOptions.content !== this.options.content
            : true
        // (Re)render the select
        if (rerender) {
            // await this.clearLine(0)
            if (this.lines.end) {
                // for (let i = 0; i < Terminal.lines - this.lines.start; i ++) {
                //     await this.removeLine()
                // }
                // await this.moveCursor(0, -(this.lines.end - this.lines.start))
            }
            await this.write(`${this.options.content}\n`)
        }
        this.lastOptions = Object.assign({}, this.options)
        if (!this.lines.end) {
            this.lines.end = Terminal.lines
        }
    }
}