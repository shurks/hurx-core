#!/usr/bin/env node
import child from "child_process"
import fs from 'fs'
import path from "path"
import Logger from "./library/utils/logger"
import Watcher from "./library/utils/watcher"
import { HurxConfig, HurxConfigAppsPartial, HurxConfigEnvironmentBase, HurxPaths } from "./library/engine/hurx-json-file/hurx-json-file"
import Env, { PathsFilePath } from "./library/engine/hurx-json-file/env/env"

const findRoot = (_path: string): string => {
    if (_path === path.parse(process.cwd()).root) {
        return "null"
    }
    if (fs.existsSync(path.join(_path, 'package.json'))) {
        return `"${_path}"`
    }
    else {
        return findRoot(path.join(_path, '../'))
    }
}

const findHurx = (_path: string): string|null => {
    if (_path === path.parse(process.cwd()).root) {
        return null
    }
    if (fs.existsSync(path.join(_path, "hurx.build.json"))) {
        return path.join(_path, 'hurx.build.json')
    }
    else if (fs.existsSync(path.join(_path, "hurx.json"))) {
        return path.join(_path, 'hurx.json')
    }
    else {
        return findHurx(path.join(_path, '../'))
    }
}

const findProject = (_path: string): string|null => {
    if (_path === path.parse(process.cwd()).root) {
        return null
    }
    if (fs.existsSync(path.join(_path, "hurx.json"))) {
        return path.join(_path, 'hurx.json')
    }
    else if (fs.existsSync(path.join(_path, "package.json"))) {
        const project = findProject(path.join(_path, '../'))
        if (!project) {
            return path.join(_path, 'package.json')
        }
        else {
            return project
        }
    }
    else {
        return findProject(path.join(_path, '../'))
    }
}

const logger = new Logger()
const hurx = findHurx(process.argv[1])
const hurxEntry = process.argv[1]
const hurxRoot = hurx ? path.join(hurx, '../') : null
const hurxType = hurx ? hurx.endsWith('hurx.json') ? 'hurx.json' : hurx.endsWith('package.json') ? 'package.json' : null : null
let hurxSourceRoot: null | string = null
let hurxExecutable: PathsFilePath | null = null
if (hurx === null) {
    logger.error('The hurx engine was not found')
    process.exit()
}

const project = findProject(process.cwd())
const projectRoot = project ? path.join(project, '../') : null
const projectType = project ? project.endsWith('hurx.json') ? 'hurx.json' : project.endsWith('package.json') ? 'package.json' : null : null
if (!hurxRoot) {
    logger.error('@hurx/core was not found.')
    process.exit()
}
if (!projectRoot) {
    logger.error('No project root was found.')
    process.exit()
}
let childProcess: child.ChildProcess|null = null
let hasToRestart = false
let isRestarting = false

const flags = [
    hurx
        ? `--hurx -config "${hurx}"`
            + (hurxRoot ? ` -root "${hurxRoot}"` : ``)
            + (hurxType ? ` -type "${hurxType}"` : ``)
        : ``,
    project
        ? `--project -config "${project}"`
            + (projectRoot ? ` -root "${projectRoot}"` : ``)
            + (projectType ? ` -type "${projectType}"` : ``)
        : ``,
    process.argv.filter((v, i) => i > 1).map((v) => `"${v}"`).join(' ')
].join(' ')

const subscriptions = [
    Watcher.created.subscribe((path) => {
        if (path.includes(projectRoot)) {
            hasToRestart = true
            startChildProcess()
        }
    }),
    Watcher.modified.subscribe((path) => {
        if (path.includes(projectRoot)) {
            hasToRestart = true
            startChildProcess()
        }
    }),
    Watcher.removed.subscribe((path) => {
        if (path.includes(projectRoot)) {
            hasToRestart = true
            startChildProcess()
        }
    })
]

const startChildProcess = () => {
    if (isRestarting) {
        return
    }
    isRestarting = true
    if (hurxExecutable && hurxExecutable.path && hurxSourceRoot) {
        // TODO: extension `.hurx`
        if (hurxExecutable.extension === 'ts') {
            childProcess = child.spawn(
                'npx',
                [
                    'ts-node',
                    './spawn.ts',
                    `--experimental-specifier-resolution=node`,
                    `--spawn${hurxExecutable.exportName ? `${` -exp "${hurxExecutable.exportName}"${hurxExecutable.exportName ? ` -fn "${hurxExecutable.fn}"` : ''}`}` : ''} -path "${(path.join(hurxExecutable.path, hurxExecutable.fileName || 'index')).replace(/((?<!\\)(\\\\)*)\\"/g, '$1"')}" -extension "${hurxExecutable.extension}"`,
                    `${flags.replace(/((?<!\\)(\\\\)*)\\"/g, '$1"')}`,
                ],
                {
                    cwd: hurxSourceRoot,
                    stdio: 'inherit',
                    shell: true
                }
            )
        }
        else if (hurxExecutable.extension === 'js') {
            childProcess = child.spawn(
                'node',
                [
                    './spawn.js',
                    `--experimental-specifier-resolution=node`,
                    `--spawn${hurxExecutable.exportName ? `${` -exp "${hurxExecutable.exportName}"${hurxExecutable.exportName ? ` -fn "${hurxExecutable.fn}"` : ''}`}` : ''} -path "${(path.join(hurxExecutable.path, hurxExecutable.fileName || 'index')).replace(/((?<!\\)(\\\\)*)\\"/g, '$1"')}" -extension "${hurxExecutable.extension}"`,
                    `${flags.replace(/((?<!\\)(\\\\)*)\\"/g, '$1"')}`
                ],
                {
                    cwd: hurxSourceRoot,
                    stdio: 'inherit',
                    shell: true
                }
            )
        }
        childProcess?.once('exit', (code) => {
            isRestarting = false
            childProcess = null
            process.stdin.setRawMode(false)
            if (hasToRestart) {
                console.info('File changes detected, restarting...')
                hasToRestart = false
                startChildProcess()
            }
            else {
                console.info(`Clean exit with code ${code}, waiting for changes... (press ^c to exit)`)
                setTimeout(function check() {
                    if (hasToRestart) {
                        console.info('File changes detected, restarting...')
                        hasToRestart = false
                        startChildProcess()
                    }
                    else {
                        setTimeout(check, 200)
                    }
                }, 200)
            }
        })
    }
}

let main: string | undefined
if (hurxType === 'package.json') {
    throw Error('Error: hurx.json file missing in @hurx/core')
}
else if (hurxType === 'hurx.json') {
    const hurxJSON = JSON.parse(fs.readFileSync(hurx).toString('utf-8')) as HurxConfig
    const processEnvFile = (root: string) => {
        const env = path.join(root, '.env')
        if (fs.existsSync(env)) {
            for (const line of fs.readFileSync(env).toString('utf8').split(/\r\n|\r|\n/)) {
                const exec = /([a-zA-Z$_][a-zA-Z0-9$_]*)(\=)(.+$)/.exec(line)
                if (exec && exec[1] && exec[3]) {
                    process.env[exec[1]] = exec[3]
                }
            }
        }
        process.env.NODE_ENV = process.env.NODE_ENV || 'default'
    }
    processEnvFile(hurxRoot)
    let env: ({ paths: HurxPaths } & HurxConfigEnvironmentBase & { apps: HurxConfigAppsPartial }) | null = null
    try {
        env = Env.parse(hurxJSON, hurxRoot)
        hurxSourceRoot = hurxJSON.package.built
            ? path.join(hurxRoot, hurxJSON.package.env.default.paths.output.sources)
            : path.join(hurxRoot, hurxJSON.package.env.default.paths.sources)
    }
    catch (err) {
        logger.error(err)
        process.exit()
    }
    if (env) {
        if (!env.apps.bin?.hurx.default.main) {
            main = env.apps.bin?.hurx.default.main

            // ref: https://richjenks.com/filename-regex/
            hurxExecutable = Env.parsePathsFilePath(main!)
            
            if (!hurxExecutable.path) {
                logger.error('hurx.json: \'hurx.main\' does not contain a valid path.')
                process.exit()
            }

            if (!/^(?!.*\/\/)([\w.-]+\/?)*$/.test(hurxExecutable.path)) {
                logger.error(`hurx.json: \`hurx.main\` is not a valid relative path: "${hurxExecutable.path}"`)
                process.exit()
            }

            hurxExecutable.source = path.join(env.paths.sources, hurxExecutable.path)
            hurxExecutable.output = path.join(env.paths.output.sources, hurxExecutable.path)

            if (!hurxJSON.package.built && fs.existsSync(hurxExecutable.source)) {
                hurxExecutable.path = hurxExecutable.source
                hurxExecutable.extension = hurxExecutable.extension || (
                    fs.existsSync(path.join(hurxExecutable.path, `${hurxExecutable.fileName || 'index'}.hurx`))
                        ? 'hurx'
                        : 'ts'
                )
                if (fs.existsSync(path.join(hurxExecutable.path, `${hurxExecutable.fileName || 'index'}.${hurxExecutable.extension}`))) {
                    Watcher.watch(projectRoot)
                    startChildProcess()
                }
                else {
                    logger.error(`hurx.json: entry file \`${path.join(hurxExecutable.path, `${hurxExecutable.fileName || 'index'}.${hurxExecutable.extension}`)}\` not found`)
                    process.exit()
                }
            }
            else if (fs.existsSync(hurxExecutable.output)) {
                hurxExecutable.path = hurxExecutable.output
                hurxExecutable.extension = 'js'
                if (fs.existsSync(path.join(hurxExecutable.path, `${hurxExecutable.fileName || 'index'}.${hurxExecutable.extension}`))) {
                    Watcher.watch(projectRoot)
                    startChildProcess()
                }
                else {
                    logger.error(`hurx.json: entry file \`${path.join(hurxExecutable.path, `${hurxExecutable.fileName || 'index'}.${hurxExecutable.extension}`)}\` not found`)
                    process.exit()
                }
            }
            else {
                logger.error(`hurx.json: both dist and source folders dont exist:`, {
                    hurxExecutable
                })
                process.exit()
            }
        }
        else {
            logger.error(`@hurx/core: "main" is not specified in the "hurx" binary app.`)
            process.exit()
        }
    }
}

process.once('exit', () => {
    subscriptions.forEach((subscription) => subscription.unsubscribe())
})