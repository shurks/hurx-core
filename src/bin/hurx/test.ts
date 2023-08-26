import path from "path"
import Command from "../../library/framework/apps/cli/command"
import { CLICommand } from "../../library/framework/apps/cli/types"
import HurxCLI from "./hurx-cli"

export default class Test extends CLICommand<HurxCLI> {
    public commands = [
        new HurxCLI().convertToCommand(path.join('bin', 'hurx', 'entry.ts'), () => this.cli)
    ]
    public command = new Command(this.parent, 'test', 'tersting')
        .event('start', async() => {
            this.logger.info('TEST')
        })
}