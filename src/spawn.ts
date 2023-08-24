import path from "path"
import Hurx from "./library/engine/hurx"
import Logger from "./library/utils/logger"

// The flags
const command = Hurx.parseCommands()[0]

// The export
let exp: null | string = null

// The function
let fn: null | string = null

// The require object
const req = require(`${path.join(`${command.flags.spawn.path}.${command.flags.spawn.extension}`)}`)

const logger = new Logger()
if (command.flags.spawn.exp.length) {
    exp = req[command.flags.spawn.exp]
    if (!exp) {
        logger.error(`hurx.json: export "${command.flags.spawn.exp}" does not exist in "${path.join(`${command.flags.spawn.path}.${command.flags.spawn.extension}`)}"`)   
        process.exit()
    }
    if (command.flags.spawn.fn?.length) {
        if (!(exp as any)[command.flags.spawn.fn]) {
            logger.error(`hurx.json: method "${command.flags.spawn.exp}.${command.flags.spawn.fn}" does not exist in "${path.join(`${command.flags.spawn.path}.${command.flags.spawn.extension}`)}"`)
            process.exit()
        }
        else {
            fn = command.flags.spawn.fn
        }
    }
    if (exp) {
        if (fn) {
            (exp as any)[fn](process.argv)
        }
        else {
            (exp as any)(process.argv)
        }
    }
}