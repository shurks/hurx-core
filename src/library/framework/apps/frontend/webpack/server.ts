import express from 'express'
import path from 'path'
import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import Env from '../../../node/env/env'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import http from 'http'
import WebSocket from 'ws'
import Logger from '../../../../core/utils/logger/logger.node'
import Emitter from '../../../../core/utils/reactive/emitter'
import Listener from '../../../../core/utils/reactive/listener'
import { execSync } from 'child_process'

const logger = new Logger()
const app = express()
const packageOrHurx = Env.findProject(path.join(process.cwd(), '../'))
// TODO: env
if (!packageOrHurx) {
	throw Error(`Couldn't find project root: no package.json or hurx.json found.`)
}
const project = path.join(packageOrHurx, '../')
logger.info(`Project found: "${project}"`)
// const server = http.createServer((req, res) => {})

const config: webpack.Configuration & webpackDevServer.Configuration = {
	mode: 'development',
	entry: {
		main: [path.join(project, 'src', 'dev', 'frontend', 'src', 'app.tsx')]
	},
	output: {
		path: path.resolve(project, 'src', 'dev', 'frontend', 'public'),
		filename: 'bundle.min.js',
	},
	devServer: {
		static: {
			directory: path.join(project, 'src', 'dev', 'frontend', 'public')
		},
		compress: true,
		port: 9000,
		hot: true
	},
	module: {
		rules: [
			{
				test: /\.(ts(x)?)$/,
				use: [
					{
						loader: path.join(project, 'src', 'tsx', 'tsx-loader.ts')
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.js$/, // Match .js files
				exclude: /node_modules/,
				use: [
					// Add any loaders or options for .js files here
					// For example, you can use Babel to transpile JavaScript
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
						},
					},
				],
			},
		],
	},
	plugins: [
		new webpack.NormalModuleReplacementPlugin(
			/jsdom$/,
			path.resolve(project, 'src', 'tsx', 'jsdom.mock.ts')
		)
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		fallback: {
			// Include polyfills for Node.js core modules
			buffer: require.resolve('buffer/'),
			util: require.resolve('util/'),
			events: require.resolve('events/'),
			stream: require.resolve('stream/'),
			path: require.resolve('path/'),
			os: require.resolve('os-browserify/browser'),
			assert: require.resolve('assert/')
		}
	},
	devtool: 'source-map'
}
const compiler = webpack(config)
app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output?.publicPath || '/'
    })
)
app.use(
    webpackHotMiddleware(compiler)
)
compiler.hooks.done.tap(`HotReloadLogic`, () => {
	console.log('Hot reloading...')
	execSync(`npx esbuild ${path.join(process.cwd(), 'src', 'app.tsx')} --keep-names --bundle --outfile=${path.join(process.cwd(), 'public', 'bundle.min.js')} --target=es6 --external:"jsdom"`, {
		cwd: process.cwd(),
		stdio: 'ignore'
	})
	sendMessage.emit('reload-script')
})
app.get('*.js', (req, res) => {
	res.writeHead(200, {
		'Content-Type': 'text/javascript'
	})
	res.end(readFileSync(path.join(process.cwd(), 'public', req.url)).toString('utf8'))
})
app.get('*.js.map', (req, res) => {
	const mapPath = path.join(project, 'dist', req.url)
	if (existsSync(mapPath)) {
	  	res.sendFile(mapPath)
	} else {
	  	res.status(404).send('Source map not found')
	}
})
app.get('*', (req, res) => {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	})
	res.end(readFileSync(path.join(process.cwd(), 'public', 'index.html')).toString('utf8'))
})
const sendMessage = new Emitter<string>()
let listener: Listener<any>|null = null
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
const wss = new WebSocket.Server({ server })
wss.on('connection', (ws) => {
	ws.send('Testing')
	listener = sendMessage.listen.always((message) => {
		ws.send(message)
	})
})
wss.on('close', () => {
	listener?.unsubscribe()
})