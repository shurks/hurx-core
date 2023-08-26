import chalk from "chalk"
import CLI from "../../library/framework/apps/cli/cli"
import { CLIMaster } from "../../library/framework/apps/cli/types"
import hurxCorePlugin from "../../library/framework/apps/cli/plugins/hurx-core-plugin"
import Build from "./build/build"
import Test from "./test"

/**
 * The Hurx CLI
 */
export default class HurxCLI extends CLIMaster {
    public commands = [
        Build,
        Test
    ]

    public cli = new CLI('hurx', 'The Hurx CLI')
        .plugin(hurxCorePlugin)
        .initialization('Hurx CLI initialization', async({next}) => {
            // Generates the hurx art and renders it
            console.log(chalk.hex('#000000').bold(`\n${HurxCLI.generateAsciiArt()} ${chalk.bgHex('#FF601C').hex('#000000').bold(` v1.0.0 `)}\n`))
            
            // Check for support
            if (!process.stdin.isTTY) {
                console.log()
                this.logger.label('error', 'fatal', 'You are using a node environment that is incompatible (tty missing)')
                return
            }
    
            this.logger.info('Hurx CLI started')
            await next()
        })
        // The default start event
        .event('start', async({cli}) => {
            await cli.startContext({
                context: {
                    middleware: {
                        name: 'Make -h break the program to show the user helpful instructions',
                        argv: ['-h']
                    }
                }
            })
        })

    /**
     * Runs the Hurx CLI
     */
    public static readonly main = async() => await new HurxCLI().start()

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