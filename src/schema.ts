import { writeFileSync } from 'fs'
import path from 'path'
import * as tsj from 'ts-json-schema-generator'

const schema = tsj.createGenerator({
    path: path.join(__dirname, './library', 'engine', 'hurx-json-file', 'hurx-json-file.ts'),
    tsconfig: path.join(__dirname, '../tsconfig.json'),
    type: '*'
})
.createSchema('HurxConfig')

writeFileSync(path.join(__dirname, '../', 'res', 'schemas', 'hurx.schema.json'), JSON.stringify(schema, null, 4))