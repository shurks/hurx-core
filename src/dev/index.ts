#!/usr/bin/env node
import { readdirSync } from "fs"
import CLI from "../library/framework/apps/cli/cli"
import Command from "../library/framework/apps/cli/command"
import hurxCorePlugin from "../library/framework/apps/cli/plugins/hurx-core-plugin"
import { CLICommand, CLIMaster } from "../library/framework/apps/cli/types"
import path from "path"
import Hierarchy from "./hierarchy"
import Schema from "./schema"
import Build from "../bin/hurx/build/build"
import HurxCLI from "../bin/hurx/hurx-cli"

/**
 * Development tools for internal Hurx development
 */
export default class Dev extends CLIMaster {
    public commands = [
        new HurxCLI().convertToCommand(path.join('bin', 'hurx', 'entry.ts'), () => this.cli),
        Hierarchy,
        Schema,
        Build,
        ...[...readdirSync(path.join(__dirname), {
            recursive: true,
            withFileTypes: true
        }).filter((v) => v.isFile() && ![
            // To SKIP
            'index',
            'hierarchy',
            'schema',
            'build'
        ].includes(v.name.replace('.ts', ''))).map((v) => v.name.replace(/\.ts$/g, ''))].map(function (v) {
            return class extends CLICommand<Dev> {
                commands = []
                command = new Command(this.parent, v, `The "src/dev/${v}.ts" file (generated)`)
                    .event('start', async () => {
                        await import(path.join(__dirname, v))
                    })
            }
        })
    ] as any[]

    public cli = new CLI('dev', 'Internal development tools')
        .plugin(hurxCorePlugin)
        .event('start', async ({ cli }) => {
            await cli.executeArgv('-h')
        })
}
new Dev().start()