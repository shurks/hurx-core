import path from "path"
import Tasks from "../../utils/tasks/tasks"
import { existsSync } from "fs"
import Logger from "../../utils/logger"

const logger = new Logger()

/**
 * All env related tasks
 */
export const env = new Tasks('env')
    /**
     * Sets the environment variables
     * TODO:
     */
    .register('initialize', () => {
        logger.info('initialize env')
        const project = env.run('find-project', process.cwd())
        logger.info({
            project
        })
    })
    /**
     * Gets the root environment variables
     * TODO:
    */
    .register('get-root', () => {
        // return process.env.hurx as any
    })
    /**
     * Gets the app environment variables
     * TODO: 
     */
    .register('get-app', () => {
        
    })
    /**
     * Finds a node_module at the given path
     */
    .register('find-module', (_path: string, name: string): string|null => {
        return 'TODO: '
    })
    /**
     * Finds the project configuration file
     */
    .register('find-project', (_path: string): string|null => {
        if (_path === path.parse(process.cwd()).root) {
            return null
        }
        if (existsSync(path.join(_path, "hurx.json"))) {
            return path.join(_path, 'hurx.json')
        }
        else if (existsSync(path.join(_path, "package.json"))) {
            const project = env.run('find-project', path.join(_path, '../'))
            if (!project) {
                return path.join(_path, 'package.json')
            }
            else {
                return project
            }
        }
        else {
            return env.run('find-project', path.join(_path, '../'))
        }
    })
    /**
     * Finds the framework configuration file
     */
    .register('find-framework', (_path: string): string|null => {
        if (_path === path.parse(process.cwd()).root) {
            return null
        }
        if (existsSync(path.join(_path, "hurx.json"))) {
            return path.join(_path, 'hurx.json')
        }
        else {
            return env.run('find-framework', path.join(_path, '../'))
        }
    })
    /**
     * TODO:
     * Finds a resource in the resources folder
     */
    .register('find-resource', () => {})