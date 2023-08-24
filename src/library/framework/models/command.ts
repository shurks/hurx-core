// hurx build --a "test" -d "test"

/**
 * An argument in the process.argv
 */
export type Arguments = {
    commands: Array<{
        name: string
        values: Arguments['values']
        flags: Arguments['flags']
        properties: Arguments['properties']
    }>
    flags: Array<{
        name: string
        values: string[]
        arguments: Arguments
    }>
    values: string[]
    properties: {
        [key: string]: {
            name: string
            value?: string
        }
    }
}