import CLI from "../cli"
import readline from 'readline'

export default new CLI('hurx-respawn-plugin', 'Adds respawn functionality to your CLI')
    // The default after start event
    .event('end', async({cli}) => new Promise<void>(async(resolve, reject) => {
        const execute = async() => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })
            // When ctrl+c is pressed make sure the next line is called using console.log
            // then end the process, to continue to the previous cli or the terminal.
            rl.on('SIGINT', async() => {
                console.log()
                let current = cli.history[cli.history.length - 1]
                const find = (c: CLI<any, any, any>, o: CLI<any, any, any>): CLI<any,any,any>|null => {
                    const f = c.commands.find((v) => v === o)
                    if (f) {
                        return c
                    }
                    for (const command of c.commands.filter((v) => v !== c)) {
                        const f = find(command, o)
                        if (f) {
                            return command
                        }
                    }
                    return null
                }
                const found = find(cli, current)
                if (found) {
                    cli.history.push(found)
                    rl.close()
                    await execute()
                }
                else {
                    cli.argv = []
                    rl.close()
                    process.exit(0)    
                }
            })
            // Generate the question
            let question = ''
            let command: CLI<any, any, any>|undefined = cli.history[cli.history.length - 1]
            while (command) {
                question = command.name + ' > ' + question
                if (command.type === 'cli') {
                    break
                }
                command = command.parent
            }
            // Ask the question
            rl.question(question, async(command) => {
                // The argv arguments
                const argv = (command.match(/(?<=\s|^)"(?:\\"|[^"])*(?<!\\)"|\S+/g) || []).map((v) => v.replace(/^\"/g, '').replace(/\"$/g, '').replace(/\\\"/g, '"'))
    
                // Close the interface
                rl.close()
    
                // Start the CLI again
                try {
                    await cli.start(argv || [])
                }
                catch (err) {}

                // Execute the end again
                await execute()
            })
        }
        await execute()
    }))