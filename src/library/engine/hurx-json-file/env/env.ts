import objectPath from "object-path"
import { HurxConfig, HurxConfigApp, HurxConfigApps, HurxConfigAppsPartial, HurxConfigBinApp, HurxConfigBinAppEnvironment, HurxConfigEnvironment, HurxConfigEnvironments } from "../hurx-json-file"
import path from "path"
import { readFileSync } from "fs"
import Logger from "../../../utils/logger"

/**
 * A package.env.paths filepath containing an export name and function
 */
export interface PathsFilePath {
    /**
     * The function name
     */
    fn?: string
    /**
     * The full path, except the file
     */
    path?: string
    /**
     * The file name without extension
     */
    fileName?: string
    /**
     * The extension without a dot
     */
    extension?: string
    /**
     * Name of the export
     */
    exportName?: string
    /**
     * The output path
     */
    output?: string
    /**
     * The source path
     */
    source?: string
}

/**
 * All environment settings
 */
export default class Env {
    public static logger = new Logger()

    /**
     * Parse/merge the env from a hurx.json file
     * @param hurxJSONFile the hurx.json file object
     * @param root the path to the hurx json file
     * @returns the parsed/merged environment
     */
    public static parse(hurxJSONFile: HurxConfig, root: string): HurxConfigEnvironment & { apps: HurxConfigApps } {
        // Root is not an absolute path or "." / "./"
        if (root !== './' && !/^([a-zA-Z]:\\(?:[^\\]+\\)*[^\\]+)|(\/(?:[^\/]+\/)*[^\/]+)$/.test(root)) {
            throw Error(`Value of root must be a valid absolute path or ./ (value: "${root}")`)
        }

        // Assign from default
        let parsedEnv: { apps: HurxConfigApps } & HurxConfigEnvironment = {
            ...process.env,
            ...hurxJSONFile.package.env.default,
            apps: {
                bin: {}
            }
        }

        const json = JSON.parse(readFileSync(path.join(__dirname, '../../../../../res', 'schemas', 'hurx.schema.json')).toString('utf8'))
        const properties = Object.keys(json.definitions.HurxPaths.properties).filter((v) => json.definitions.HurxPaths.properties[v].type === 'string')
        const outputProperty: string = Object.keys(json.definitions.HurxPaths.properties).filter((v) => json.definitions.HurxPaths.properties[v].$ref?.endsWith('/HurxPathsBase'))[0]
        const allProperties = [`paths`, `paths.${outputProperty}`].map((v) => properties.map((p) => `${v}.${p}`)).reduce((x, y) => [...x, ...y], [])

        // Validate that all paths are present and are relative
        const valid = /^(?!.*\/\/)([\w.-]+\/?)*$/
        for (const property of allProperties) {
            for (const envName of Object.keys(hurxJSONFile.package.env)) {
                if (['npm', 'git'].includes(envName)) {
                    continue
                }
                const value = objectPath(hurxJSONFile).get(`package.env.${envName}.${property}`)
                if (!value && value !== '') {
                    if (envName === 'default') {
                        throw Error(`hurx.json: path \`package.env.${envName}.${property}\` missing.`)
                    }
                }
                else if (typeof value !== 'string') {
                    throw Error(`hurx.json: path \`package.env.${envName}.${property}\` is not a string`)
                }
                else if (/^(\\|\/)*\.\.(\\|\/)+/.test(value)) {
                    throw Error(`hurx.json: path \`package.env.${envName}.${property}\` may not be outside the base directory, value: "${value}"`)
                }
                else if (!valid.test(value)) {
                    throw Error(`hurx.json: path \`package.env.${envName}.${property}\` is not a valid relative path`)
                }
                else if (/((\\|\/)*|^)\.\.(\\|\/)+/.test(value)) {
                    throw Error(`hurx.json: path \`package.env.${envName}.${property}\` is trying to get to a parent directory, which is not allowed`)
                }
            }
            if (hurxJSONFile.package.apps.bin) {
                for (const appName of Object.keys(hurxJSONFile.package.apps.bin)) {
                    for (const envName of Object.keys(hurxJSONFile.package.apps.bin[appName])) {
                        const value = objectPath(hurxJSONFile.package.apps.bin[appName]).get(`env.${envName}.${property}`)
                        if (value?.length) {
                            if (typeof value !== 'string') {
                                throw Error(`hurx.json: path \`package.apps.bin.${appName}.env.${envName}.${property}\` is not a string`)
                            }
                            else if (/^(\\|\/)*\.\.(\\|\/)+/.test(value)) {
                                throw Error(`hurx.json: path \`package.apps.bin.${appName}.env.${envName}.${property}\` may not be outside the base directory, value: "${value}"`)
                            }
                            else if (!valid.test(value)) {
                                throw Error(`hurx.json: path \`package.apps.bin.${appName}.env.${envName}.${property}\` is not a valid relative path`)
                            }
                            else if (/((\\|\/)*|^)\.\.(\\|\/)+/.test(value)) {
                                throw Error(`hurx.json: path \`package.apps.bin.${appName}.env.${envName}.${property}\` is trying to get to a parent directory, which is not allowed`)
                            }
                        }
                    }
                }
            }
        }

        const processObject = (obj: object, parsedEnv: HurxConfigEnvironment | HurxConfigApp) => {
            obj = Object.assign({}, obj)
            parsedEnv = Object.assign({}, parsedEnv)
            for (const key of Object.keys(obj)) {
                const value = (obj as any)[key]
                if (!value) {
                    continue
                }
                else if (typeof value === 'object') {
                    if (Array.isArray(value)) {
                        (parsedEnv as any)[key] = value
                    }
                    else {
                        (parsedEnv as any)[key] = processObject((obj as any)[key], (parsedEnv as any)[key] || {})
                    }
                }
                else if (value) {
                    (parsedEnv as any)[key] = value
                }
            }
            return parsedEnv
        }

        // Loop through environments
        for (const env of Object.keys(hurxJSONFile.package.env)) {
            if (['npm', 'git', 'default'].includes(env)) {
                continue
            }
            if (process.env.NODE_ENV === env) {
                (parsedEnv as any) = {
                    ...parsedEnv,
                    ...processObject(hurxJSONFile.package.env[env], parsedEnv)
                }
                break
            }
        }
        
        // Loop through all apps
        if (hurxJSONFile.package.apps.bin) {
            for (const binName of Object.keys(hurxJSONFile.package.apps.bin)) {
                const env = {
                    ...parsedEnv,
                    ...parsedEnv.apps.bin && parsedEnv.apps.bin[binName]
                        ? parsedEnv.apps.bin[binName].default
                        : {},
                    ...processObject(hurxJSONFile.package.apps.bin[binName].default || {}, {...parsedEnv})
                }
                for (const envName of Object.keys(hurxJSONFile.package.apps.bin[binName])) {
                    if (envName === 'default') {
                        continue
                    }
                    if (envName === process.env.NODE_ENV) {
                        processObject(hurxJSONFile.package.apps.bin[binName][envName] as any, env as any)
                    }
                }
                parsedEnv.apps.bin = {
                    ...parsedEnv.apps.bin || {},
                    [binName]: env as any
                }
            }
        }

        // Return the transformed paths
        const processPaths = (prefix?: string) => {
            for (const _path of allProperties.map((v) => `${prefix || ''}${v}`)) {
                if (/\.base$/.test(_path)) {
                    if (/\.output\.base$/.test(_path)) {
                        objectPath(parsedEnv).set(_path, path.join(objectPath(parsedEnv).get(_path.replace(/\.output\.base$/, '.base')), objectPath(parsedEnv).get(_path)))
                    }
                    else {
                        objectPath(parsedEnv).set(_path, path.join(root, objectPath(parsedEnv).get(_path)))
                    }
                }
                else {
                    const base = objectPath(parsedEnv).get(_path.replace(/\.[a-z0-9$_][a-zA-Z0-9$_]*$/, '.base'))
                    objectPath(parsedEnv).set(_path, path.join(base, objectPath(parsedEnv).get(_path)))
                }
            }
            // for (const _path of paths) {
            //     let prefix = './'
            //     if (!/(^|\.)paths\.(base|(output\.base))$/.test(_path)) {
            //         prefix = objectPath(parsedEnv).get(prefixes[_path])
            //         if (!prefix || typeof prefix !== 'string') {
            //             this.logger.info(prefixes)
            //             this.logger.error(`hurx.json: path "${_path}" doesn't have a prefix registered.`)
            //             process.exit()
            //         }
            //         console.log(parsedEnv.apps.bin.hurx.paths)
            //         // objectPath(parsedEnv).set(_path, path.join(i === 1 ? root : '', prefix, objectPath(parsedEnv).get(_path)))
            //     }
            // }
        }
        processPaths()
        if (parsedEnv.apps.bin) {
            for (const binName of Object.keys(parsedEnv.apps.bin)) {
                processPaths(`apps.bin.${binName}.`)
            }
        }
        return parsedEnv
    }

    /**
     * Parses a paths filepath with an optional export and function e.g. `index.ts#default.main`
     * @param file the file path
     */
    public static parsePathsFilePath(file: string): PathsFilePath {
        let copy = file
            .replace(/^(\\|\/)+/g, '')
            .replace(/(\\|\/)+/g, '/')

        let type: PathsFilePath = {}

        if ((copy + '/').startsWith('../')) {
            this.logger.error(`hurx.json: \`env.main\` may not direct to a parent directory (value: "${file}")`)
            process.exit()
        }
        
        if (copy.includes('#')) {
            const exec = /(\#)([a-zA-Z$_][a-zA-Z0-9$_]*)((\.)([a-zA-Z$_][a-zA-Z0-9$_]*))?$/g.exec(copy)
            if (exec) {
                type.fn = exec[5]
                type.exportName = exec[2]
            }
            copy = copy.replace(/\#.+$/g, '')
        }

        let exec = /\.(ts|js|hurx)$/g.exec(copy)
        if (exec) {
            type.extension = exec[1]
            copy = copy.replace(/\.(ts|js|hurx)$/g, '')
        }

        exec = /(?<=(\/|^))[^\/]*$/g.exec(copy)
        if (exec) {
            type.fileName = exec[0]
            copy = copy.replace(/(?<=(\/|^))[^\/]*$/g, '')
        }
        if (!type.fileName?.length) {
            type.fileName = 'index'
        }

        type.path = copy.length
            ? copy
            : './'
        
        return type
    }
}