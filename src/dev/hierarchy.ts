import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs"
import path from "path"
import CLI from "../library/framework/apps/cli/cli"

/**
 * The hierarchy command
 */
export default new CLI('hierarchy', 'Generates a folder hierarchy of the package src folder')
    .event('start', async() => {
        const hierarchy = (root: string, level: number = 0): string => {
            let textInner = ''
            const dir = readdirSync(path.join(root), {
                recursive: true,
                withFileTypes: true
            })
            if (level === 0) {
                textInner += 'src' + '\n'
            }
            for (const entry of dir) {
                if (entry.isFile()) {
                    textInner += new Array(level + 1).fill('').map((v) => '----').join('') + entry.name + '\n'
                }
                else if (entry.isDirectory()) {
                    textInner += new Array(level + 1).fill('').map((v) => '----').join('') + entry.name + '/' + '\n'
                    textInner += hierarchy(path.join(root, entry.name), level + 1)
                }
            }
            return textInner
        }
        const h = hierarchy(path.join(__dirname, '../'))
        if (!existsSync(path.join('../../', 'res', 'tmp'))) {
            mkdirSync(path.join(__dirname, '../../', 'res', 'tmp'), {
                recursive: true
            })
        }
        writeFileSync(path.join(__dirname, '../../', 'res', 'tmp', 'hierarchy.txt'), h)
        console.log(h)
    })