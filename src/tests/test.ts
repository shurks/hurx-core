import Command from "../library/framework/apps/cli/command"
import { CLICommand } from "../library/framework/apps/cli/types"
import Tests from "./tests"

export class Test extends CLICommand<Tests> {
    public commands = []
    public command = new Command(this.parent, 'test', 'Some test command')
        .event('start', async({cli}) => {
            const argv = cli.logger.argv
            cli.logger.argv = ['--verbose']
            cli.logger.debug('Some textual data', {
                data: 12
            })
            cli.logger.error('Some textual data', {
                data: 12
            })
            cli.logger.error(new Error('Test error'))
            cli.logger.info('Some textual data', {
                data: 12
            })
            cli.logger.success('Some textual data', {
                data: 12
            })
            cli.logger.trace('Some textual data', {
                data: 12
            })
            cli.logger.verbose('Some textual data', {
                data: 12
            })
            cli.logger.warn('Some textual data', {
                data: 12
            })
            cli.logger.argv = argv
        })
}