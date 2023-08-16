import path from 'path'
import TMLanguageBuilder from '../../builder'
import { helpers, regex } from '../../../utils/regex'

// The grammar for the hurx language
TMLanguageBuilder
.root<
    'log' | 'collection',
    `${
        `meta${
            `.log`
        }`|
        `log${
            `.client${
                `.default`|
                `.name`|
                `.workspace${
                    `.name`
                }`|
                `.file${
                    `.path`|
                    `.line`|
                    `.char`|
                    `.at`
                }`|
                `.type`
            }`|
            `.server${
                `.default`|
                `.name`|
                `.workspace${
                    `.name`
                }`|
                `.file${
                    `.path`|
                    `.line`|
                    `.char`|
                    `.at`
                }`|
                `.type`
            }`
        }`
    }.hurx-output-vscode`
>('hurx-output-vscode', '#collection')

// Collection repository
.repository('collection', '#log')

// Log repository
.repository('log',
    {
        name: 'meta.log.hurx-output-vscode',
        begin: [
            /^\[/,
            /Client/,
            /\#[0-9]+/
        ],
        beginCaptures: {
            1: 'log.client.default.hurx-output-vscode',
            2: 'log.client.name.hurx-output-vscode',
            3: 'log.client.default.hurx-output-vscode'
        },
        children: [
            {
                match: [
                    /\s\(/,
                    /[^\)]+/,
                    /\)/
                ],
                captures: {
                    1: 'log.client.default.hurx-output-vscode',
                    2: 'log.client.workspace.name.hurx-output-vscode',
                    3: 'log.client.default.hurx-output-vscode'
                }
            },
            {
                match: [
                    /\]\:\s/,
                    regex(/.*?/, helpers.lookahead(/\@/)),
                    /\@/,
                    /[0-9]+/,
                    /\:/,
                    /[0-9]+/
                ],
                captures: {
                    1: 'log.client.default.hurx-output-vscode',
                    2: 'log.client.file.path.hurx-output-vscode',
                    3: 'log.client.file.at.hurx-output-vscode',
                    4: 'log.client.file.line.hurx-output-vscode',
                    5: 'log.client.file.at.hurx-output-vscode',
                    6: 'log.client.file.char.hurx-output-vscode'
                }
            }
        ],
        end: [
            /\s\(/,
            /[a-zA-Z]+/,
            /\)$/
        ],
        endCaptures: {
            1: 'log.client.default.hurx-output-vscode',
            2: 'log.client.type.hurx-output-vscode',
            3: 'log.client.default.hurx-output-vscode'
        }
    },
    {
        name: 'meta.log.hurx-output-vscode',
        begin: [
            /^\[/,
            /Server/,
            /\#[0-9]+/
        ],
        beginCaptures: {
            1: 'log.server.default.hurx-output-vscode',
            2: 'log.server.name.hurx-output-vscode',
            3: 'log.server.default.hurx-output-vscode'
        },
        children: [
            {
                match: [
                    /\s\(/,
                    /[^\)]+/,
                    /\)/
                ],
                captures: {
                    1: 'log.server.default.hurx-output-vscode',
                    2: 'log.server.workspace.name.hurx-output-vscode',
                    3: 'log.server.default.hurx-output-vscode'
                }
            },
            {
                match: [
                    /\]\:\s/,
                    regex(/.*?/, helpers.lookahead(/\@/)),
                    /\@/,
                    /[0-9]+/,
                    /\:/,
                    /[0-9]+/
                ],
                captures: {
                    1: 'log.server.default.hurx-output-vscode',
                    2: 'log.server.file.path.hurx-output-vscode',
                    3: 'log.server.file.at.hurx-output-vscode',
                    4: 'log.server.file.line.hurx-output-vscode',
                    5: 'log.server.file.at.hurx-output-vscode',
                    6: 'log.server.file.char.hurx-output-vscode'
                }
            }
        ],
        end: [
            /\s\(/,
            /[a-zA-Z]+/,
            /\)$/
        ],
        endCaptures: {
            1: 'log.server.default.hurx-output-vscode',
            2: 'log.server.type.hurx-output-vscode',
            3: 'log.server.default.hurx-output-vscode'
        }
    }
)

// build
.build(path.join(__dirname, '../../../../../res', 'languages', 'hurx-output-vscode'))