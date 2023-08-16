import readline from 'readline'
import Logger from '../../../logger'
import { KeypressEvent } from '../../models/keypress-event'
import Terminal from '../../terminal'
import { promisify } from 'util'

/**
 * The base for a control in the terminal
 */
export default abstract class Control {
    /**
     * All constructed controls
     */
    public static controls: Control[] = []

    /**
     * The amount of lines at points of a Terminal instance's life cycle
     */
    protected lines: {
        /**
         * The amount of lines before the first render
         */
        start: number|null
        /**
         * The amount of lines after the first render
         */
        end: number|null
    } = {
        start: null,
        end: null
    }

    /**
     * The logger
     */
    protected readonly logger: Logger = new Logger()

    /**
     * The stdio interface
     */
    protected interface: readline.Interface

    constructor(protected stdin: NodeJS.ReadStream, protected stdout: NodeJS.WriteStream) {
        Control.controls.push(this)
        this.interface = readline.createInterface(this.stdin, this.stdout)
        readline.emitKeypressEvents(stdin, this.interface)
        this.interface.on('line', async() => {
            const lines = this.interface.line.split(/\r\n|\r|\n/).length
            for (let i = 0; i < lines; i ++) {
                await this.write(`${this.unicodes.line.prev}${this.unicodes.line.clear}`)
            }
            // for (let i = Math.max(...Control.controls.map((v) => v.lines.end || 0)); i < Terminal.lines; i ++) {
            //     await this.removeLine()
            // }
        })
    }

    /**
     * Render the control
     */
    public abstract render(): Promise<void>

    /**
     * Waits for a keypress event to be fired and matches the event's key and char properties
     * against the original values specified in the event handlers.
     *
     * @param {...KeypressEvent[]} events - One or more KeypressEvent objects to match against.
     * @returns {Promise<void>} A promise that resolves after a matching keypress event is handled.
     */
    protected async keypress(...events: KeypressEvent[]): Promise<void> {
        return new Promise<void>(async(resolve) => {
            /**
             * Handles the keypress event.
             * @param {string} ch - The character pressed.
             * @param {KeyPressEvent} key - The key information.
             */
            const keypressHandler = (ch: any, key: KeypressEvent['key']) => {
                new Promise<void>(async (innerResolve) => {
                    callbackLoop: for (const event of events) {
                        if (event.char) {
                            if (event.char === ch) {
                                await event.matched()
                                return innerResolve()
                            } else {
                                continue
                            }
                        } else if (event.key) {
                            if (!key) {
                                continue
                            }
                            for (const property of Object.keys(event.key) as Array<keyof typeof event.key>) {
                                const value = event.key[property]
                                if (!value) {
                                    continue
                                }
                                if (value !== key[property]) {
                                    continue callbackLoop
                                }
                            }
                            await event.matched()
                            return innerResolve()
                        } else {
                            this.logger.verbose(`Keypress event has no key or char in event`, {
                                event
                            })
                        }
                    }
                    return innerResolve()
                }).then(async() => {
                    await this.write(this.unicodes.cursor.show)
                    resolve()
                })
            }

            // Listen for the keypress event
            await this.write(this.unicodes.cursor.hide)
            this.stdin.once('keypress', keypressHandler)
        })
    }

    protected unicodes = {
        line: {
            /**
             * Set the x coordinate of the cursor to the start of the line
             */
            start: '\x1b[0G',
            /**
             * Places the cursor 1 row below
             */
            next: '\u001B[B',
            /**
             * Places the cursor 1 row above
             */
            prev: '\u001B[A',
            /**
             * Clears the current line
             */
            clear: '\u001B[2K'
        },
        cursor: {
            /**
             * Shows the cursor
             */
            show: '\u001B[?25h',
            /**
             * Hides the cursor
             */
            hide: '\u001B[?25l'
        }
    }

    /**
     * Writes data in the terminal
     * @param data the data
     */
    protected async write(data: string) {
        return await promisify(this.stdout.write).bind(this.stdout)(data)
    }
}