// import Logger from "../../utils/logger"
// import Hurx from "../hurx"
// import { Arguments } from "../models/command"

// /**
//  * An app in a hurx environment
//  */
// export default abstract class App extends Hurx {
//     protected static commands: Arguments[] = []

//     protected logger = new Logger()

//     constructor() {
//         super()
//         if (Hurx.app) {
//             throw new Error(`Can't run app, Hurx.app is already initialized`)
//         }
//         Hurx.app = this
//     }

//     /**
//      * Initializes the app
//      */
//     public async initialize(): Promise<void> {
//         console.log('initializing app')
//         // const commands: Arguments = {
//         //     name: 'hurx',
//         //     flags: {},
//         //     commands: [],
//         //     properties: [],
//         //     values: []
//         // }
//         // let lastCommand: typeof commands[number] = commands[0]
//         // let lastFlag: string|null = null
//         // let lastProp: string|null = null
//         // for (let i = 2; i < process.argv.length; i ++) {
//         //     const arg = process.argv[i]
//         //     if (/^\-\-/g.test(arg)) {
//         //         lastFlag = arg.replace(/^\-\-/g, '')
//         //         lastCommand.flags[lastFlag] = {
//         //             name: lastFlag
//         //         }
//         //     }
//         //     else if (/^\-/g.test(arg)) {
//         //         lastProp = arg.replace(/^\-/g, '')
//         //         continue
//         //     }
//         //     else {
//         //         if (lastFlag && lastProp) {
//         //             lastCommand.flags[lastFlag][lastProp] = arg
//         //         }
//         //         else {
//         //             const command: typeof commands[number] = {
//         //                 name: arg,
//         //                 flags: {}
//         //             }
//         //             commands.push(command)
//         //             lastCommand = command
//         //         }
//         //     }
//         //     lastProp = null
//         // }
//         // return commands
//     }

//     /**
//      * Runs the app
//      */
//     public abstract run(): Promise<void>
// }