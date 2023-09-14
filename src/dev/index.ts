#!/usr/bin/env node
import HurxCLI from "../library/cli/hurx-cli"
import CLI from "../library/framework/apps/cli/cli"
import hurxCorePlugin from "../library/framework/apps/cli/plugins/hurx-core-plugin"
import { CLIMaster } from "../library/framework/apps/cli/types"
import Schema from "./schema"

export default class Dev extends CLIMaster {
    public commands = [
        Schema
    ]
    public masters = [
        HurxCLI
    ]
    public cli = new CLI('dev', 'Internal development tools')
        .plugin(hurxCorePlugin)
        .event('start', async ({ cli, options }) => {
            if (!options.help) {
                await cli.executeArgv('-h')
            }
        })
} 
new Dev().initialize().then((s) => s.start())