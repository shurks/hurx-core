import path from "path"
import Command from "../../src/library/framework/apps/cli/command"
import { CLICommand, CLIMaster } from "../../src/library/framework/apps/cli/types"
import HurxCLI from "../../src/bin/hurx/hurx-cli"
import CLI from "../../src/library/framework/apps/cli/cli"
import hurxCorePlugin from "../../src/library/framework/apps/cli/plugins/hurx-core-plugin"

export class AAA extends CLIMaster {
    public commands = []

    public cli = new CLI('abc', 'testestet')
        .plugin(hurxCorePlugin)
        .event('start', ({cli}) => {
            cli.logger.info('RTEGERsjgeirijogre')
        }) as any
}

export default class Test extends CLICommand<HurxCLI> {
    public commands = [
        new AAA().convertToCommand(path.join('bin', 'hurx', 'test2.ts'), () => this.cli),
        new HurxCLI().convertToCommand(path.join('bin', 'hurx', 'entry.ts'), () => this.cli)
    ]
    public command = new Command(this.parent, 'test', 'tersting')
        .event('start', async() => {
            this.logger.info('TEST')
        })
}