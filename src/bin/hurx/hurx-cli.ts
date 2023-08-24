import chalk from "chalk"
import CLI from "../../library/framework/apps/cli/cli"
import Logger from "../../library/utils/logger"
import readline from 'readline'

/**
 * The Hurx CLI
 */
export default class HurxCLI {
    /**
     * The logger
     */
    public static readonly logger = new Logger()

    /**
     * The CLI
     */
    public static cli = new CLI('hurx')
        .option('--help -h', 'Shows a help message about the current command')
        .option('--verbose', 'Enables logging at the "trace" | "debug" | "verbose" levels')
        .option('--debug', 'Enables logging at the "trace" | "debug" levels')
        .option('--trace', 'Enables logging at the "trace" level')
        .command(command => command('build')
            .option('--app -a <app1> <app2?:number|"test"> <app3?>', 'The name of the app to build')
            .event('start', (options) => {
                new Logger().info({
                    message: 'Build function called',
                    options
                })
            })
        )
        // The default start event
        .event('start', async(options) => {
            // Generates the hurx art and renders it
            console.log(chalk.hex('#000000').bold(`\n${this.generateAsciiArt()} ${chalk.bgHex('#FF601C').hex('#000000').bold(` v1.0.0 `)}\n`))

            // Check for support
            if (!process.stdin.isTTY) {
                console.log()
                this.logger.label('error', 'fatal', 'You are using a node environment that is incompatible (tty missing)')
                return
            }

            this.logger.info('Hurx CLI started')
            this.logger.verbose({
                options
            })
        })
        // The default after start event
        .event('end', async(cli) => new Promise<void>((resolve, reject) => {
            const execute = async() => {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                })
                rl.question('> ', async(command) => {
                    const argv = (command.match(/(?<=\s|^)"(?:\\"|[^"])*(?<!\\)"|\S+/g) || []).map((v) => v.replace(/^\"/g, '').replace(/\"$/g, '').replace(/\\\"/g, '"'))
        
                    // Log the argv
                    this.logger.verbose({
                        argv
                    })
        
                    // Close the interface
                    rl.close()
        
                    // Start the CLI again
                    try {
                        await cli.start(argv || [])
                    }
                    catch (err) {}

                    // Execute the end again
                    await execute()
                })
            }
            execute()
        }))
        // The default error handler
        .event('error', async(error) => {
            this.logger.error(error)
        })

    /**
     * Runs the Hurx CLI
     */
    public static async main() {
        await this.cli.start()
    }

    /**
     * Generates 3D ascii art of 'HurX'
     * @returns the art
     */
    private static generateAsciiArt = () => {
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