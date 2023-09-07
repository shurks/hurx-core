import objectPath from "object-path"
import { HurxConfig, HurxConfigApp, HurxConfigApps, HurxConfigEnvironment } from "../hurx-json/hurx-json-file"
import path from "path"
import { existsSync, readFileSync } from "fs"
import Logger from "../../utils/logger"
import Hurx from "../hurx"

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
     * @param root the path to the hurx json file (root of the project)
     * @returns the parsed/merged environment
     */
    public static parse(root: string): Hurx['env'] {
        const hurxJSONFile = JSON.parse(readFileSync(path.join(root, 'hurx.json')).toString('utf8')) as HurxConfig

        // Root is not an absolute path or "." / "./"
        if (root !== './' && !/^([a-zA-Z]:\\(?:[^\\]+\\)*[^\\]+)|(\/(?:[^\/]+\/)*[^\/]+)$/.test(root)) {
            throw Error(`Value of root must be a valid absolute path or ./ (value: "${root}")`)
        }

        // Assign from default
        let parsedEnv: { apps: HurxConfigApps } & HurxConfigEnvironment = {
            ...hurxJSONFile.package.env.default,
            apps: {
                bin: {}
            }
        }

        const json = JSON.parse(readFileSync(path.join(Hurx.framework?.root || root, 'res', 'schemas', 'hurx.schema.json')).toString('utf8'))
        const properties = Object.keys(json.definitions.HurxPaths.properties).filter((v) => json.definitions.HurxPaths.properties[v].type === 'string')
        const outputProperty: string = Object.keys(json.definitions.HurxPaths.properties).filter((v) => json.definitions.HurxPaths.properties[v].$ref?.endsWith('/HurxPathsBase'))[0]
        const allProperties = (hurxJSONFile.package.built ? [`paths`] : [`paths`, `paths.${outputProperty}`]).map((v) => properties.map((p) => `${v}.${p}`)).reduce((x, y) => [...x, ...y], [])

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
                        objectPath(parsedEnv).set(_path, path.join(objectPath(parsedEnv).get(_path.replace(/\.output\.base$/, '.base')), objectPath(parsedEnv).get(_path)).replace(/\\/g, '/'))
                    }
                    else {
                        objectPath(parsedEnv).set(_path, path.join(root, objectPath(parsedEnv).get(_path)).replace(/\\/g, '/'))
                    }
                }
                else {
                    const base = objectPath(parsedEnv).get(_path.replace(/\.[a-z0-9$_][a-zA-Z0-9$_]*$/, '.base'))
                    objectPath(parsedEnv).set(_path, path.join(base, objectPath(parsedEnv).get(_path)).replace(/\\/g, '/'))
                }
            }
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

    /**
     * Finds the project configuration file
     */
    public static findProject = (_path: string): string|null => {
        if (_path === path.parse(process.cwd()).root) {
            return null
        }
        if (existsSync(path.join(_path, "hurx.json"))) {
            return path.join(_path, 'hurx.json')
        }
        else if (existsSync(path.join(_path, "package.json"))) {
            const project = this.findProject(path.join(_path, '../'))
            if (!project) {
                return path.join(_path, 'package.json')
            }
            else {
                return project
            }
        }
        else {
            return this.findProject(path.join(_path, '../'))
        }
    }

    /**
     * Finds the framework configuration file
     */
    public static findFramework = (_path: string): string|null => {
        if (_path === path.parse(process.cwd()).root) {
            return null
        }
        const validateHurxJSON = (_path: string) => {
            try {
                const content = JSON.parse(readFileSync(path.join(_path, 'hurx.json')).toString('utf8')) as HurxConfig
                if (content.package.name === '@hurx/core') {
                    this.logger.verbose(`Found @hurx/core at ""`)
                    return path.join(_path, 'hurx.json')
                }
            } catch (err) {
                this.logger.verbose(`"${path.join(_path, 'hurx.json')}" is either invalid or not of this framework.`)
                this.logger.verbose(err)
            }
            return null
        }
        if (existsSync(path.join(_path, "hurx.json"))) {
            this.logger.verbose(`Found hurx.json at "${path.join(_path, 'hurx.json')}", checking if it's @hurx/core`)
            const validate = validateHurxJSON(path.join(_path))
            if (validate) {
                this.logger.verbose(`Validated hurx.json`)
                return validate
            }
            else {
                this.logger.verbose(`Failed to validate hurx.json`)
            }
        }
        if (existsSync(path.join(_path, "node_modules", "@hurx", "core", "hurx.json"))) {
            this.logger.verbose(`Found hurx.json at "${path.join(_path, "node_modules", "@hurx", "core", "hurx.json")}", checking if it's @hurx/core`)
            const validate = validateHurxJSON(path.join(_path, "node_modules", "@hurx", "core"))
            if (validate) {
                this.logger.verbose(`Validated hurx.json`)
                return validate
            }
            else {
                this.logger.verbose(`Failed to validate hurx.json`)
            }
        }
        return this.findFramework(path.join(_path, '../'))
    }
}