/**
 * A flag in a process.argv command
 */
export type CommandFlag = {
    name: string

    [propertyName: string]: string
}