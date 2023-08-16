import Logger from "../utils/logger"
import chalk from "chalk"
import Label from "../utils/terminal/controls/label/label"
import Terminal from "../utils/terminal/terminal"

/**
 * The hurx engine.
 */
export default class Engine {
    /**
     * The args
     */
    public static readonly args: string[] = []

    /**
     * The logger
     */
    public static readonly logger: Logger = new Logger()

    /**
     * Main method of the Hurx engine.
     * @param args the arguments passed to node.
     */
    public static main = async (...args: any[]) => {
        Engine.args === args

        let exit = false

        console.log(1)

        // Add functionality to `process.stdout.write`
        const original = process.stdout.write;
        (process as any).stdout.write = function(...args: any[]) {
            if (process.exitCode) {
                (process as any).stdout.write = original
            }
            if (typeof args[0] === 'string') {
                Terminal.lines += args[0].split(/\r\n|\r|\n/).length - 1
            }
            return original.apply(this, args as any)
        }

        // Clean up program
        process.once('exit', () => {
            exit = true;
            // Reset the stdout write function
            (process as any).stdout.write = original
            // Show the cursor
            process.stdout.write('\u001B[?25h')
        })
        
        // Clear the terminal
        console.clear()

        // Generates the hurx art and renders it
        await new Label({
            content: chalk.hex('#000000').bold(`\n${this.generateAsciiArt()} ${chalk.bgHex('#FF601C').hex('#000000').bold(` v1.0.0 `)}\n`)
        }).render()

        // Check for support
        if (!process.stdin.isTTY) {
            console.log()
            this.logger.label('error', 'fatal', 'You are using a node environment that is incompatible (tty missing)')
            return
        }

        this.logger.info(this.parseCommands())
        // await new Select([
        //     {
        //         label: 'Create a new project'
        //     },
        //     {
        //         label: 'Find an existing project'
        //     },
        //     {
        //         label: 'Clone a hurx project'
        //     }
        // ]).render()
    }

    /**
     * Parses all flags
     */
    public static parseCommands(): { commandName: string, flags: { [flagName: string]: { [propertyName: string]: string } } }[] {
        const commands: ReturnType<typeof Engine['parseCommands']> = [
            {
                commandName: 'hurx',
                flags: {}
            }
        ]
        let lastCommand: typeof commands[number] = commands[0]
        let lastFlag: string|null = null
        let lastProp: string|null = null
        for (let i = 2; i < process.argv.length; i ++) {
            const arg = process.argv[i]
            if (/^\-\-/g.test(arg)) {
                lastFlag = arg.replace(/^\-\-/g, '')
                lastCommand.flags[lastFlag] = {}
            }
            else if (/^\-/g.test(arg)) {
                lastProp = arg.replace(/^\-/g, '')
                continue
            }
            else {
                if (lastFlag && lastProp) {
                    lastCommand.flags[lastFlag][lastProp] = arg
                }
                else {
                    const command: typeof commands[number] = {
                        commandName: arg,
                        flags: {}
                    }
                    commands.push(command)
                    lastCommand = command
                }
            }
            lastProp = null
        }
        return commands
    }

    /**
     * Generates 3D ascii art of 'HurX'
     * @returns the art
     */
    private static generateAsciiArt() {
        let art =
`__a/\\\\\\a________a/\\\\\\a____________________________d/\\\\\\d______d/\\\\\\d________
_a\\/\\\\\\a_______a\\/\\\\\\a____________________________d\\///\\\\\d___d/\\\\\\/d_________
__a\\/\\\\\\a_______a\\/\\\\\\a_____________________________d\\///\\\\\\\\\\\\/d__________
___i\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i__b/\\\\\\b____b/\\\\\\b__c/\\\\/\\\\\\\\\\\\\\c____e\\//\\\\\\\\e___________
____i\\/\\\\\\/////////\\\\\\i_b\\/\\\\\\b___b\\/\\\\\\b_c\\/\\\\\\/////\\\\\\c____e\\/\\\\\\\\e__________
_____i\\/\\\\\\i_______i\\/\\\\\\i_b\\/\\\\\\b___b\\/\\\\\\b_c\\/\\\\\\c___c\\///c_____e/\\\\\\\\\\\\e________
______h\\/\\\\\\h_______h\\/\\\\\\h_g\\/\\\\\\g___g\\/\\\\\\g_j\\/\\\\\\j__________f/\\\\\\////\\\\\\f_____
_______h\\/\\\\\\h_______h\\/\\\\\\h_g\\\\/\\\\\\\\\\\\\\\\\\g__j\\/\\\\\\j________f/\\\\\\/f___f\\///\\\\f__
________h\\///h________h\\///h___g\\/////////g___j\\\\///j_______f\\///f______f\\///f____`
        art = art.substring(0, art.length - 1)
        art = art.replace(/_/g, ' ')
        const colors = {
            'a': '#FF3F66',
            'b': '#DDDDDD',
            'c': '#DDDDDD',
            'd': '#FF3F66',
            'e': '#DDDDDD',
            'f': '#4F6FE5',
            'g': '#4F6FE5',
            'h': '#4F6FE5',
            'i': '#DDDDDD',
            'j': '#4F6FE5'
        }
        for (const key of Object.keys(colors)) {
            while (art.indexOf(key) !== -1) {
                const content = art.substring(art.indexOf(key) + 1).replace(new RegExp(`${key}.*$`, 'gms'), '')
                const styled = chalk.hex((colors as any)[key])(content)
                art = art.substring(0, art.indexOf(key)) + styled + art.substring(art.indexOf(key) + 2 + content.length)
            }
        }
        return art
    }
}