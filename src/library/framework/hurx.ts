import Logger from "../utils/logger"
import CLI from "./apps/cli/cli"
import App from "./apps/app"
import { Arguments } from "./models/command"

/**
 * The hurx framework.
 */
export default class Hurx {
    public static instance: Hurx

    /**
     * The arguments
     */
    public static readonly args: Arguments[] = []
 
    /**
     * The current app
     */
    public static app: App
   
    /**
     * The logger
     */
    private static readonly logger: Logger = new Logger()
   
    /**
     * Get the app as a cli
     */
    public static get cli(): CLI {
        return this.app as CLI
    }

    public static async main(app: App) {
        // Sets the Hurx.app if its not set
        if (!this.app) {
            this.app = app
        }
    }

    public static generateCommands() {
        // const commands: Arguments[] = [
        //     {
        //         name: 'hurx',
        //         flags: {}
        //     }
        // ]
        // let lastCommand: typeof commands[number] = commands[0]
        // let lastFlag: string|null = null
        // let lastProp: string|null = null
        // for (let i = 2; i < process.argv.length; i ++) {
        //     const arg = process.argv[i]
        //     if (/^\-\-/g.test(arg)) {
        //         lastFlag = arg.replace(/^\-\-/g, '')
        //         lastCommand.flags[lastFlag] = {
        //             name: lastFlag
        //         }
        //     }
        //     else if (/^\-/g.test(arg)) {
        //         lastProp = arg.replace(/^\-/g, '')
        //         continue
        //     }
        //     else {
        //         if (lastFlag && lastProp) {
        //             lastCommand.flags[lastFlag][lastProp] = arg
        //         }
        //         else {
        //             const command: typeof commands[number] = {
        //                 name: arg,
        //                 flags: {}
        //             }
        //             commands.push(command)
        //             lastCommand = command
        //         }
        //     }
        //     lastProp = null
        // }
        // return commands
    }
}