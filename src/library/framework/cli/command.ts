import CLI from "./cli"

/**
 * Represents a command in a CLI
 */
export default class Command<Name extends string, Options extends string, Middlewares extends string> extends CLI<Name, Options, Middlewares> {
    /**
     * Configures a new sub-command in a command line interface (CLI) instance.
     * @param name the name of the command
     * @param parent the CLI
     */
    constructor(parent: { cli?: CLI<any, Options, Middlewares>, command?: CLI<any, Options, Middlewares> }, name: Name, description: string) {
        super(name as any, description, parent.cli)
        if (parent.command) {
            parent.command.commands.push(this as any)
        }
        else if (parent.cli) {
            parent.cli.commands.push(this as any)
        }
    }
}