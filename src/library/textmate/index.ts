import { copyFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from "fs"
import Tokenizer from "./tokenizer/tokenizer"
import path from "path"
import TextDocumentInformation from "./tokenizer/text-processing/information/text-document-information"
import Logger from "../utils/logger"
import chalk from "chalk"

try {
    // Generate the repository names
    const testNames = readdirSync(path.join(__dirname, '../', 'languages', 'test', 'tests'))

    // Copies the test tm language file to vscode folder
    copyFileSync(path.join(__dirname, '../', 'languages', 'test', 'test.tmLanguage.json'), path.join(__dirname, '../../', 'vscode', 'resources', 'languages', 'test', 'test.tmLanguage.json'))

    // Creates the tokenizer for the documents
    const language = new Tokenizer().language('test', path.join(__dirname, '../', 'languages', 'test', 'test.tmLanguage.json'))
    
    // Parce a processed document into JSON
    const parseProcessed = (processed: TextDocumentInformation) => {
        return JSON.stringify(processed.tokens.root, (key: any, value: any) => {
            if (key === 'node') {
                return
            }
            return value
        }, 4)
    }

    // Logger
    const logger = new Logger()

    // Testing
    if (process.argv.includes('--test')) {
        console.clear()
        logger.info(`Running ${testNames.length} tests`)
        for (const testName of testNames) {
            const base = path.join(__dirname, '../', 'languages', 'test', 'tests', testName, testName)
            const file = `${base}.test`
            let expected = `${base}.expected.json`
            if (!existsSync(expected)) {
                logger.label('warn', testName, `Missing file: "${expected}"`)
                continue
            }
            let result = parseProcessed(language.document('test', file).test(testName))
            writeFileSync(`${base}.result.json`, result)
            expected = readFileSync(expected).toString('utf8')
            if (result === expected) {
                console.log(`${chalk.bgHex('#1CFFA3').hex('#333333').bold(` ${testName} `)} ✅ Passed`)
            }
            else {
                console.log(`${chalk.bgHex('#1CFFA3').hex('#333333').bold(` ${testName} `)} ❌ Failed`)
            }
        }
    }

    // Run a file
    else if (process.argv.includes('--start')) {
        for (let i = 0; i < process.argv.length; i ++) {
            const argv = process.argv[i]
            logger.info(process.cwd())
            console.info(argv)
        }
        // console.clear()
        // const testName = process.argv[start + 1]
        // if (!testName?.length) {
        //     logger.error(`No name specified.`)
        //     logger.info(`Run yarn start [name]`)
        // }
        // if (testNames.includes(testName)) {
        //     logger.success('File found')
        //     const base = path.join(__dirname, '../', 'languages', 'test', 'tests', testName, testName)
        //     const file = `${base}.test`
        //     const result = parseProcessed(language.document('test', file).process())
        //     writeFileSync(`${base}.result.json`, result)
        // }
        // else {
        //     logger.error(`File with name "${testName}" does not exist.`)
        //     logger.info(`Run yarn start [name]`)
        // }
    }
}
catch (err) {
    console.error(err)
}