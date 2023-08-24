import Tasks from "../utils/tasks/tasks"
import { env } from "./env/env.tasks"

/**
 * The task manager for the Hurx framework
 */
export const hurx = new Tasks('hurx')
    .import(env)
    /**
     * Initializes the Hurx framework
     */
    .register('initialize', () => {
        hurx.run('env.initialize')
    })