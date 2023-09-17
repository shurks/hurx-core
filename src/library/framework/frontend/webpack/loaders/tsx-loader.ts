import { readFileSync } from 'fs'
import path from 'path'
import ts from 'typescript'

module.exports = function(source: string) {
    const transformedCode = ts.transpileModule(source, JSON.parse(readFileSync(path.join(process.cwd(), 'tsconfig.json')).toString('utf8')))
    return transformedCode.outputText
}