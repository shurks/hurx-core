import { writeFileSync } from 'fs'
import path from 'path'
import * as tsj from 'ts-json-schema-generator'
import { CLICommand } from '../library/framework/apps/cli/types'
import Dev from '.'
import Command from '../library/framework/apps/cli/command'

/**
 * The schema command
 */
export default class Schema extends CLICommand<Dev> {
    public commands = []
    public command = new Command(this.parent, 'schema', 'Generates a JSON schema for the hurx.json file')
        .event('start', async({cli}) => {
            const schema = tsj.createGenerator({
                path: path.join(__dirname, '../library', 'framework', 'hurx-json', 'hurx-json-file.ts'),
                tsconfig: path.join(__dirname, '../../', 'tsconfig.json'),
                type: '*'
            })
            .createSchema('HurxConfig')
            writeFileSync(path.join(__dirname, '../../', 'res', 'schemas', 'hurx.schema.json'), JSON.stringify(schema, null, 4))
            cli.logger.success(`JSON schema generated at "${path.join(__dirname, '../../', 'res', 'schemas', 'hurx.schema.json')}"`)
        })
}