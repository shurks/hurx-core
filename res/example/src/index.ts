import CLI, { CLICommand, CLIMaster, Command, hurxCorePlugin } from '@hurx/core/cli'

class SomeInnerCommand extends CLICommand<SomeInnerCLI> {
    public command = new Command(this.parent, 'some-command', 'This is some command in the inner cli')
        .option('--option -o <someProp:string|number> <someOptionalProp?>', 'Some option')
        .event('start', async({cli}) => {
            cli.logger.info('Started some-command')
        })
}

class SomeInnerCLI extends CLIMaster {
    public commands = [
        SomeInnerCommand
    ]
    public cli = new CLI('inner-cli', 'This is a nested cli inside the main cli')
        .plugin(hurxCorePlugin)
        .initialization('Inner cli init', async({cli, next}) => {
            cli.logger.info('Inner cli init')
            // Always await next, otherwise the program will think that the initialization failed
            await next()
        })
        .event('start', async({cli, options}) => {
            if (!options.help) {
                await cli.executeArgv('-h')
            }
        })
}

class SomeCLI extends CLIMaster {
    public masters = [
        SomeInnerCLI
    ]
    public cli = new CLI('some-cli', 'Some description of the cli')
        .plugin(hurxCorePlugin)
        .initialization('Cli init', async({cli, next}) => {
            cli.logger.info('Cli init')
            // Always await next, otherwise the program will think that the initialization failed
            await next()
        })    
        .event('start', async({cli, options}) => {
            if (!options.help) {
                await cli.executeArgv('-h')
            }
        })
}

new SomeCLI().initialize().then(async(cli) => {
    await cli.start()
})