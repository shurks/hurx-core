import webpack from 'webpack'
import Objects from '../../core/utils/objects'
import path from 'path'
import Env from '../node/env/env'
import Logger from '../../core/utils/logger/logger.node'
import Watcher from '../../core/utils/watcher'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import sass from 'sass'
import CleanCSS from 'clean-css'
import Emitter from '../../core/utils/reactive/emitter'
import express from 'express'
import WebSocket from 'ws'
import Listener from '../../core/utils/reactive/listener'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackDevServer from 'webpack-dev-server'
import { IncomingMessage, Server, ServerResponse } from 'http'
import config from './webpack/config'
import Paths from '../../core/utils/paths'

/**
 * The hurx configuration
 */
export interface HurxOptions {
    /**
     * Webpack options
     */
    webpack: {
        /**
         * The webpack configuration
         */
        config: webpack.Configuration & webpackDevServer.Configuration
    }
    /**
     * The name of the instance
     */
    name?: string
    /**
     * Sets the port for the frontend dev server, default is `3000`
     */
    port?: number
}

/**
 * The Hurx manager for frontend applications
 * TODO: refactor
 */
export default class Hurx {
    /**
     * The frontend instance with no name specified
     */
    private static instance: Hurx

    /**
     * All instances
     */
    private static instances: Record<string, Hurx> = {}

    /**
     * The options
     */
    public options!: HurxOptions

    /**
     * The webpack compiler
     */
    public compiler!: webpack.Compiler

    /**
     * The express instance
     */
    public express: express.Express = express()

    /**
     * The server
     */
    public server!: Server<typeof IncomingMessage, typeof ServerResponse>

    /**
     * The websocket server
     */
    public socket!: WebSocket.Server

    /**
     * Sends a message to the web socket server
     */
    public sendMessage = new Emitter<string>()

    /**
     * The listener for `sendMessage`
     */
    private sendMessageListener: Listener<string>|null = null

    /**
     * The file watcher
     */
    private watcher = new Watcher()

    // /**
    //  * Webpack plugins
    //  */
    // public plugins = {
    //     scss: {
    //         apply: (compiler: webpack.Compiler) => {
    //             this.compiler.hooks.watchRun.tapAsync('Compile SCSS upon initialization', async(compiler, callback) => {
    //                 console.log(`Starting SCSS compilation`)

    //                 const generateCSS = (_path: string, relativePath: string = './', css: string[] = []): string[] => {
    //                     const entries = readdirSync(_path, {
    //                         withFileTypes: true
    //                     })
    //                     for (const entry of entries) {
    //                         if (entry.isDirectory()) {
    //                             generateCSS(path.join(_path, entry.name), path.join(relativePath, entry.name), css)
    //                         }
    //                         else if (entry.isFile() && /\.(sass|scss)$/.test(entry.name)) {
    //                             try {
    //                                 css.push(sass.compile(path.join(_path, entry.name)).css)
    //                             }
    //                             catch (err) {
    //                                 this.logger.error(err)
    //                                 return []
    //                             }
    //                         }
    //                     }
    //                     return css
    //                 }
    //                 const css = generateCSS(path.join(process.cwd(), 'src'))
                    
    //                 // Concatenate all compiled CSS into one file
    //                 const concatenatedCSS = css.join('\n')
                
    //                 // Minify the concatenated CSS
    //                 const minifiedCSS = new CleanCSS().minify(concatenatedCSS).styles
                
    //                 // Write the minified CSS to a file
    //                 writeFileSync(path.join(process.cwd(), 'public', 'bundle.min.css'), minifiedCSS)
                
    //                 // Generate a separate minified source map file
    //                 const sourceMap = new CleanCSS({ sourceMap: true }).minify(concatenatedCSS).sourceMap?.toString()
    //                 if (sourceMap) {
    //                     writeFileSync(path.join(process.cwd(), 'public', 'bundle.min.css.map'), sourceMap)
    //                 }
                
    //                 this.sendMessage.emit('reload-style')

    //                 callback()
    //             })
    //         }
    //     }
    // }

    /**
     * The logger
     */
    private logger = new Logger()

    /**
     * Constructs an instance
     * @param options the options
     */
    private constructor() {}

    /**
     * Runs the webpack compiler
     */
    public compile = () => {
        this.compiler.run((err) => {
            if (err) {
                this.logger.error(err)
            }
            else {
                this.logger.info(`Successfully compiled project.`)
            }
        })
    }

    /**
     * Gets an (un)named instance
     * @param name the name (optional)
     */
    public static getInstance(name?: string): Hurx|null {
        if (!name) {
            return this.instance || null
        }
        else {
            return this.instances[name] || null
        }
    }

    /**
     * The callback when a file is removed/added/modified that is being watched
     * @param filePath the filepath
     */
    private onChange = (filePath: string) => {
        if (/node_modules/.test(filePath) && (!/node_modules\/\@hurx\/core/.test(filePath) || /node_modules\/\@hurx\/core\/node_modules/.test(filePath))) {
            return
        }
        if (/^public\//.test(filePath.replace(process.cwd(), '').replace(/^\.*(\\|\/)*/, ''))) {
            return
        }
        if (/\.(sass|scss|(ts(x)?))$/.test(filePath)) {
            this.compile()
        }
    }

    /**
     * Must be called after constructing a `Hurx` instance to initialize it.
     */
    private initialize(projectPath: string, callback: Parameters<typeof Hurx['createInstance']>[0]) {
        this.initializeOptions(projectPath, callback)
        this.compiler = webpack(this.options.webpack.config)
        this.initializeWatch()
        this.initializeExpress()
        this.initializeWebSocket()
    }

    /**
     * Initializes the watcher
     */
    private initializeWatch() {
        this.watcher.watch(path.join(process.cwd(), 'src'))
        this.watcher.watch(path.join(process.cwd(), 'node_modules', '@hurx', 'core'))
        this.watcher.created.listen.always(this.onChange)
        this.watcher.modified.listen.always(this.onChange)
        this.watcher.removed.listen.always(this.onChange)
    }

    /**
     * Initializes the options
     * @param projectPath the project path
     * @param callback the callback to form the options
     */
    private initializeOptions(projectPath: string, callback: Parameters<typeof Hurx['createInstance']>[0]) {
        const defaultOptions: HurxOptions = {
            webpack: {
                config: config(projectPath, this)
            }
        }
        this.options = callback({
            options: defaultOptions,
            merge: (options): HurxOptions => {
                return Objects.deepAssign(defaultOptions, options) as HurxOptions
            }
        })
        if (this.options.name && Hurx.instances[this.options.name]) {
            throw new Error(`Can't create instance, there's already an instance running by the name of ${this.options.name}.`)
        }
        else if (!this.options.name && Hurx.instance) {
            throw new Error(`Can't create instance, there's already an unnamed instance running.`)
        }
    }

    /**
     * Initializes express
     */
    private initializeExpress() {
        this.express.use(
            webpackDevMiddleware(this.compiler, {
                publicPath: this.options.webpack.config.output?.publicPath || '/'
            })
        )
        this.express.use(
            webpackHotMiddleware(this.compiler)
        )
        this.express.get('*.css', (req, res) => {
            if (existsSync(path.join(process.cwd(), 'public', req.url))) {
                res.sendFile(path.join(process.cwd(), 'public', req.url))
            }
            else {
                res.status(404).send('Stylesheet not found')
            }
        })
        this.express.get('*.css.map', (req, res) => {
            const mapPath = path.join(process.cwd(), 'public', req.url)
            if (existsSync(mapPath)) {
                res.sendFile(mapPath)
            } else {
                res.status(404).send('Source map not found')
            }
        })
        this.express.get('*.js', (req, res) => {
            if (existsSync(path.join(process.cwd(), 'public', req.url))) {
                res.sendFile(path.join(process.cwd(), 'public', req.url))
            }
            else {
                res.status(404).send('Script not found')
            }
        })
        this.express.get('*.js.map', (req, res) => {
            const mapPath = path.join(process.cwd(), 'public', req.url)
            if (existsSync(mapPath)) {
                res.sendFile(mapPath)
            } else {
                res.status(404).send('Source map not found')
            }
        })
        this.express.get('*', (req, res) => {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            })
            res.end(readFileSync(path.join(process.cwd(), 'public', 'index.html')).toString('utf8'))
        })
        this.server = this.express.listen(this.options.port || 3000, () => {
            this.logger.info(`Server is running on port ${this.options.port || 3000}`)
        })
    }

    /**
     * Initializes the web socket communication between the browser and the server.
     */
    private initializeWebSocket() {
        this.socket = new WebSocket.Server({ server: this.server })
        this.socket.on('connection', (ws) => {
            ws.send('Testing')
            this.sendMessageListener = this.sendMessage.listen.always((message) => {
                ws.send(message)
            })
        })
        this.socket.on('close', () => {
            this.sendMessageListener?.unsubscribe()
        })
    }

    /**
     * Creates a `Hurx` frontend instance
     * @param callback the callback to create the options
     */
    public static createInstance(
        callback: (
            /**
             * Helper functions and options
             */
            helpers: {
                /**
                 * The default options to overwrite
                 */
                options: HurxOptions,
                /**
                 * Merge the options
                 */
                merge: (options: HurxOptions) => HurxOptions
            }
        ) => HurxOptions
    ): Hurx {
        let projectPath = Env.findProject(path.join(process.cwd()))
        if (!projectPath) {
            throw new Error(`No package.json or hurx.json found in project.`)
        }
        projectPath = path.join(projectPath, '../')
        const hurx = new Hurx()
        hurx.initialize(projectPath, callback)
        if (hurx.options.name) {
            Hurx.instances[hurx.options.name] = hurx
        }
        else {
            Hurx.instance = hurx
        }
        return hurx
    }
}