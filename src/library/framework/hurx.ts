import path from "path"
import Logger from "../utils/logger"
import Env from "./env/env"
import { HurxConfig, HurxConfigApps, HurxConfigEnvironment } from "./hurx-json/hurx-json-file"
import readline from 'readline'
import { readFileSync } from "fs"

/**
 * The hurx master class
 */
export default class Hurx {
    /**
     * The Hurx logger
     */
    public static logger = new Logger()

    /**
     * The Hurx logger
     */
    public get logger() {
        return Hurx.logger
    }

    /**
     * The hurx framework
     */
    public static framework: Hurx

    /**
     * The last initialized project
     */
    public static project: Hurx

    /**
     * The hurx.json config file
     */
    public config: HurxConfig

    /**
     * The hurx.json config file of Hurx
     */
    public env: HurxConfigEnvironment & { apps: HurxConfigApps }

    /**
     * Constructs Hurx
     * @param root the project root
     * @param type the type of the project
     */
    constructor(public root: string, public type: 'npm'|'hurx') {
        this.config = JSON.parse(readFileSync(path.join(root, 'hurx.json')).toString('utf8')) as HurxConfig
        this.env = Env.parse(root) as any
    }

    /**
     * Initializes the Hurx framework
     */
    public static readonly initialize = async() => {
        // Find framework root
        let hurx: string|null = null
        for (const _path of [process.argv[1], __dirname, process.cwd()]) {
            const __path = Env.findFramework(_path)
            if (__path) {
                hurx = __path
                this.logger.verbose(`Found hurx at path "${_path}"`)
                break
            }
            else {
                this.logger.verbose(`Hurx path is not "${_path}"`)
            }
        }
        if (!hurx) {
            throw Error(`@hurx/core framework could not be found, please let us know what happened at https://www.npmjs.com/package/@hurx/core`)
        }

        // Find project root
        let project: string|null = Env.findProject(process.cwd())
        if (!project || project.endsWith('package.json')) {
            // TODO: finish this
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })
            this.logger.error(`No hurx project found in current working directory, would you like to create one here?`)
            let question = `Initialize hurx project at "${process.cwd()}"? [y/n]: `
            const askQuestion = async() => {
                return new Promise<void>((resolve, reject) => {
                    rl.question(question, async(answer) => {
                        if (!['y', 'n'].includes(answer.toLowerCase())) {
                            await askQuestion()
                            resolve()
                        }
                        else {
                            if (answer.toLowerCase() === 'n') {
                                this.logger.success('Alright, byebye.')
                                process.exit()
                            }
                            else {
                                // TODO: create a hurx project
                                throw Error(`Not implemented`)
                            }
                        }
                    })
                })
            }
            await askQuestion()
        }
        else {
            Hurx.framework = new Hurx(path.join(hurx, '../'), 'npm')
            Hurx.project = new Hurx(path.join(project, '../'), 'hurx')
            this.logger.trace({
                framework: Hurx.framework.root,
                project: Hurx.project.root
            })
            this.logger.trace(`Initialized Hurx framework successfully`)
        }
    }
}