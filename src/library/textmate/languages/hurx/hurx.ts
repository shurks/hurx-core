import TMLanguageBuilder from '../../builder'
import { regex, helpers } from '../../../utils/regex'
import { PatternNames, RepositoryNames } from "./names"
import path from 'path'

// The meta options for a doc pseudo tag
export const docMetaOptions = `(${[
    'author',
    'inherit'
].join('|')})`

// The grammar for the hurx language
TMLanguageBuilder
.root<RepositoryNames, PatternNames>('hurx', '#collection')
//#region Collection
.repository('collection',
    {
        name: 'meta.meta.hurx',
        begin: [
            /^(?=\~)/
        ],
        children: [
            // TODO: verbetereen
            {
                name: 'meta.embedded.link.hurx',
                match: [
                    /\~/,
                    /file\:\/\/[^\\\/:"*?<>|\n]+((\.[a-zA-Z0-9]+)|(\\|\/))?/,
                    /\~/
                ],
                captures: {
                    1: 'punctuation.definition.string.begin.hurx',
                    2: 'meta.embedded.link.uri.hurx',
                    3: 'punctuation.definition.string.end.hurx'
                }
            },
            {
                name: 'meta.embedded.block.hurx',
                begin: [
                    /\~\@/,
                    /code/,
                    /\~/
                ],
                beginCaptures: {
                    2: 'meta.embedded.block.key.hurx'
                },
                children: [
                    '#code',
                    '#code.type.built-in.building-blocks.functionality'
                ],
                end: [
                    helpers.lookahead(/\~/)
                ]
            },
            {
                name: 'meta.meta.hurx',
                begin: [
                    /\~/,
                    /[^\\\/:"*?<>|\n]+/,
                    /\~/
                ],
                beginCaptures: {
                    2: 'meta.meta.key.hurx'
                },
                children: [
                    '#code.embed',
                    {
                        name: 'meta.meta.value.hurx',
                        begin: [
                            helpers.lookbehind(/~/)
                        ],
                        children: [
                            '#code.embed'
                        ],
                        end: [
                            /(\G^\s*$)|(?=(~))/
                        ]
                    }
                ],
                end: [
                    /(\G^\s*$)|(?=(~))/
                ]
            }
        ]
    },
    {
        begin: [
            /(?:^)/
        ],
        children: [
            '#code'
        ]
    }
)
//#endregion
//#endregion
//#region Code
.repository('code',
    '#code.type',
    '#code.pseudo',
)
    //#region Keyword
    .repository('code.keywords',
        '#code.type.built-in.basic.keywords',
        '#code.type.built-in.building-blocks.keywords',
        '#code.type.keyword'
    )
    //#endregion
    //#region Values that can be used to assign to variables or parameters
    .repository('code.value',
        '#code.type.built-in.basic.string',
        '#code.type.built-in.basic.number',
        '#code.type.built-in.basic.boolean',
        '#code.type.built-in.basic.empty',
        '#code.type.built-in.building-blocks.functionality.variable',
        '#code.type.built-in.building-blocks.class.body.func.parameter'
    )
    //#endregion
    //#region Embed
    .repository('code.embed',
        {
            name: 'meta.embedded.block.hurx',
            begin: [
                /\`\`\`/,
                /[a-zA-Z$_][a-zA-Z$_0-9]*/
            ],
            beginCaptures: {
                1: 'punctuation.definition.code.begin.hurx',
                2: 'punctuation.definition.code.begin.language.hurx'
            },
            end: [
                /\`\`\`/
            ],
            endCaptures: {
                1: 'punctuation.definition.code.end.hurx'
            },
            children: [
                '#code',
                '#code.type.body',
                '#code.type.built-in.building-blocks.functionality'
            ]
        },
        {
            name: 'meta.embedded.block.hurx',
            begin: [
                /\`/
            ],
            beginCaptures: {
                1: 'punctuation.definition.code.begin.hurx'
            },
            end: [
                /\`/
            ],
            endCaptures: {
                1: 'punctuation.definition.code.end.hurx'
            },
            children: [
                '#code',
                '#code.type.body',
                '#code.type.built-in.building-blocks.functionality'
            ]
        }
    )
    //#endregion
    //#region type
    .repository('code.type',
        {
            name: 'meta.type.hurx',
            begin: [
                helpers.lookbehind(/\W|^/),
                /(\-|\~)?/,
                /type/,
                /\s+/,
                /[A-Z][a-zA-Z0-9]*/
            ],
            beginCaptures: {
                1: {
                    name: 'storage.modifier.access.hurx',
                    children: [
                        {
                            name: 'storage.modifier.access.private.hurx',
                            match: [
                                /\-/
                            ]
                        },
                        {
                            name: 'storage.modifier.access.protected.hurx',
                            match: [
                                /\~/
                            ]
                        }
                    ]  
                },
                2: 'storage.type.keyword.hurx',
                4: 'entity.name.type.type.hurx'
            },
            children: [
                {
                    begin: [
                        /\</
                    ],
                    beginCaptures: {
                        1: 'punctuation.definition.block.type.body.hurx'
                    },
                    children: [
                        '#code.type.body'
                    ],
                    end: [
                        /\>/
                    ],
                    endCaptures: {
                        1: 'punctuation.definition.block.type.body.hurx'
                    }
                }
            ],
            end: [
                helpers.lookbehind(/\>/)
            ]
        },
        '#code.type.built-in',
        '#code.type.keyword'
    )
        //#region type without keyword
        .repository('code.type.initializer',
            // types
            {
                name: 'meta.type.initializer.hurx',
                begin: [
                    helpers.lookbehind(/\W|^/),
                    /([A-Z][a-zA-Z0-9]*\.)*[A-Z][a-zA-Z0-9]*/,
                    /\s*/,
                    /\</
                ],
                beginCaptures: {
                    1: {
                        name: 'entity.name.type.type.hurx',
                        children: [
                            {
                                name: 'entity.name.type.type.segment.hurx',
                                match: [
                                    /[a-zA-Z][a-zA-Z0-9]*/
                                ]
                            },
                            {
                                name: 'entity.name.type.type.segment.separator.hurx',
                                match: [
                                    /\./
                                ]
                            }
                        ]
                    },
                    3: 'punctuation.definition.block.type.body.hurx'
                },
                children: [
                    '#code.type.initializer'
                ],
                end: [
                    /\>/
                ],
                endCaptures: {
                    1: 'punctuation.definition.block.type.body.hurx'
                }
            },
            // Unfinished types
            '#code.type.initializer.unfinished',
            '#code.type.built-in.basic'
        )
            //#region Unfinished types
            .repository('code.type.initializer.unfinished',
                {
                    name: 'meta.type.initializer.hurx',
                    match: [
                        helpers.lookbehind(/\W|^/),
                        /([A-Z][a-zA-Z0-9]*\.)*[A-Z][a-zA-Z0-9]*/
                    ],
                    captures: {
                        1: {
                            name: 'entity.name.type.type.hurx',
                            children: [
                                {
                                    name: 'entity.name.type.type.segment.hurx',
                                    match: [
                                        /[A-Z][a-zA-Z0-9]*/
                                    ]
                                },
                                {
                                    name: 'entity.name.type.type.segment.separator.hurx',
                                    match: [
                                        /\./
                                    ]
                                }
                            ]
                        }
                    }
                }
            )
            //#endregion
        //#endregion
        //#region Body of a interface (between the {})
        .repository('code.type.body',
            // types
            {
                begin: [
                    helpers.lookbehind(/\W|^/),
                    /([A-Z][a-zA-Z0-9]*\.)*[A-Z][a-zA-Z0-9]*/,
                    /\s+/,
                    /\</
                ],
                beginCaptures: {
                    1: {
                        name: 'entity.name.type.type.hurx',
                        children: [
                            {
                                name: 'entity.name.type.type.segment.hurx',
                                match: [
                                    /[a-zA-Z][a-zA-Z0-9]*/
                                ]
                            },
                            {
                                name: 'entity.name.type.type.segment.separator.hurx',
                                match: [
                                    /\./
                                ]
                            }
                        ]
                    },
                    3: 'punctuation.definition.block.type.body.hurx'
                },
                children: [
                    '#code.type.body',
                    '#code'
                ],
                end: [
                    /\>/
                ],
                endCaptures: {
                    1: 'punctuation.definition.block.type.body.hurx'
                }
            },
            // Unfinished types
            {
                match: [
                    helpers.lookbehind(/\W|^/),
                    /([A-Z][a-zA-Z0-9]*\.)*[A-Z][a-zA-Z0-9]*/
                ],
                captures: {
                    1: {
                        name: 'entity.name.type.type.hurx',
                        children: [
                            {
                                name: 'entity.name.type.type.segment.hurx',
                                match: [
                                    /[A-Z][a-zA-Z0-9]*/
                                ]
                            },
                            {
                                name: 'entity.name.type.type.segment.separator.hurx',
                                match: [
                                    /\./
                                ]
                            }
                        ]
                    }
                }
            },
            '#code.type.built-in.building-blocks.functionality.variable'
        )
        //#endregion
        //#region Built-in
        .repository('code.type.built-in',
            '#code.type.built-in.basic',
            '#code.type.built-in.building-blocks'
        )
            //#region Basic
            .repository('code.type.built-in.basic',
                '#code.type.built-in.basic.number',
                '#code.type.built-in.basic.string',
                '#code.type.built-in.basic.boolean',
                '#code.type.built-in.basic.boolean',
                '#code.type.built-in.basic.date',
                '#code.type.built-in.basic.empty'
            )
                //#region Keywords
                .repository('code.type.built-in.basic.keywords',
                    '#code.type.built-in.basic.number.decimal.keyword',
                    '#code.type.built-in.basic.number.integer.keyword',
                    '#code.type.built-in.basic.number.keyword',
                    '#code.type.built-in.basic.string.keyword',
                    '#code.type.built-in.basic.boolean.true.keyword',
                    '#code.type.built-in.basic.boolean.false.keyword',
                    '#code.type.built-in.basic.date.keyword',
                    '#code.type.built-in.basic.empty.keyword',
                )
                //#endregion
                //#region Number repository
                .repository('code.type.built-in.basic.number',
                    '#code.type.built-in.basic.number.integer.range',
                    '#code.type.built-in.basic.number.decimal.range',
                    '#code.type.built-in.basic.number.decimal',
                    '#code.type.built-in.basic.number.integer',
                )
                    // TODO:
                    //#region Number keyword
                    .repository('code.type.built-in.basic.number.keyword', {})
                    //#endregion
                    //#region Integer values
                    .repository('code.type.built-in.basic.number.integer',
                        {
                            name: 'meta.number.integer.hurx',
                            match: [
                                helpers.lookbehind(/\W|^/),
                                /\-?[0-9]+/,
                                /(e[0-9]+)?/,
                                helpers.lookahead(/\W|$/)
                            ],
                            captures: {
                                1: 'constant.numeric.integer.hurx',
                                2: {
                                    name: 'meta.number.exponential.hurx',
                                    children: [
                                        {
                                            name: 'punctuation.definition.exponential.hurx',
                                            match: [
                                                /e/
                                            ]
                                        },
                                        {
                                            match: [
                                                /[0-9]+/
                                            ],
                                            captures: {
                                                1: {
                                                    name: 'punctuation.definition.exponential.quantifier.hurx',
                                                    children: [
                                                        '#code.type.built-in.basic.number'
                                                    ]
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            name: 'meta.number.integer.hurx',
                            match: [
                                helpers.lookbehind(/\W|^/),
                                /\-?[0-9]+/,
                                helpers.lookahead(/\W|$/),
                            ],
                            captures: {
                                1: 'constant.numeric.integer.hurx'
                            }
                        }
                    )
                    //#endregion
                        // TODO:
                        //#region Integer keyword
                        .repository('code.type.built-in.basic.number.integer.keyword', {})
                        //#endregion
                        //#region Range
                        .repository('code.type.built-in.basic.number.integer.range',
                            {
                                name: 'meta.number.integer.range.hurx',
                                match: [
                                    helpers.lookbehind(/\W|^/),
                                    /\-?[0-9]+(e[0-9]+)?/,
                                    /(\.\.\.([0-9]+(e[0-9]+)?)\.\.\.)|(\.\.\.)/,
                                    /\-?[0-9]+(e[0-9]+)?/,
                                    helpers.lookahead(/\W|$/)
                                ],
                                captures: {
                                    1: {
                                        children: [
                                            '#code.type.built-in.basic.number'
                                        ]
                                    },
                                    2: {
                                        name: 'meta.delimiter.range.hurx',
                                        children: [
                                            {
                                                match: [
                                                    /\.\.\./,
                                                    /([0-9]+(e[0-9]+)?)/,
                                                    /\.\.\./
                                                ],
                                                captures: {
                                                    2: {
                                                        children: [
                                                            '#code.type.built-in.basic.number.integer'
                                                        ]
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    3:{
                                        children: [
                                            '#code.type.built-in.basic.number'
                                        ]
                                    }
                                }
                            }
                        )
                        //#endregion
                    //#region Decimal values
                    .repository('code.type.built-in.basic.number.decimal',
                        {
                            name: 'meta.number.decimal.hurx',
                            match: [
                                helpers.lookbehind(/\W|^/),
                                /\-?[0-9]+/,
                                /(\.[0-9]+)?/,
                                /(e((\-)?[0-9]+))?/,
                                helpers.lookahead(/\W|$/)
                            ],
                            captures: {
                                1: {
                                    children: [
                                        '#code.type.built-in.basic.number.integer'
                                    ]
                                },
                                2: {
                                    children: [
                                        {
                                            name: 'meta.delimiter.decimal.hurx',
                                            match: [
                                                /\./
                                            ]
                                        },
                                        '#code.type.built-in.basic.number'
                                    ]
                                },
                                3: {
                                    name: 'meta.number.exponential.hurx',
                                    children: [
                                        {
                                            name: 'punctuation.definition.exponential.hurx',
                                            match: [
                                                /e/
                                            ]
                                        },
                                        {
                                            match: [
                                                /\-?[0-9]+/
                                            ],
                                            captures: {
                                                1:{
                                                    name: 'punctuation.definition.exponential.quantifier.hurx',
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    )
                    //#endregion
                        // TODO:
                        //#region Keyword
                        .repository('code.type.built-in.basic.number.decimal.keyword', {})
                        //#endregion
                        //#region Range
                        .repository('code.type.built-in.basic.number.decimal.range',
                            {
                                name: 'meta.number.decimal.range.hurx',
                                match: [
                                    helpers.lookbehind(/\W|^/),
                                    /\-?[0-9]+(\.[0-9]+)?(e(\-)?[0-9]+)?/,
                                    /(\.\.\.(\-?[0-9]+(\.[0-9]+)?(e(\-)?[0-9]+)?)\.\.\.)|(\.\.\.)/,
                                    /\-?[0-9]+(\.[0-9]+)?(e(\-)?[0-9]+)?/,
                                    helpers.lookahead(/\W|$/)
                                ],
                                captures: {
                                    1: {
                                        children: [
                                            '#code.type.built-in.basic.number'
                                        ]
                                    },
                                    2: {
                                        name: 'meta.delimiter.range.hurx',
                                        children: [
                                            {
                                                match: [
                                                    /\.\.\./,
                                                    /\-?[0-9]+(\.[0-9]+)?(e(\-)?[0-9]+)?/,
                                                    /\.\.\./
                                                ],
                                                captures: {
                                                    2: {
                                                        children: [
                                                            '#code.type.built-in.basic.number.decimal'
                                                        ]
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    3:{
                                        children: [
                                            '#code.type.built-in.basic.number'
                                        ]
                                    },
                                }
                            }
                        )
                        //#endregion
                //#endregion
                //#region Boolean
                .repository('code.type.built-in.basic.boolean',
                    '#code.type.built-in.basic.boolean.true',
                    '#code.type.built-in.basic.boolean.false'
                )
                    //#region Boolean.true
                    .repository('code.type.built-in.basic.boolean.true',
                        '#code.type.built-in.basic.boolean.true.keyword'
                    )
                        //#region Keyword
                        .repository('code.type.built-in.basic.boolean.true.keyword',
                            {
                                match: [
                                    helpers.lookbehind(/\W|^/),
                                    /True/,
                                    helpers.lookahead(/\W|$/)
                                ],
                                captures: {
                                    1: 'constant.language.boolean.true.hurx'
                                }
                            }
                        )
                        //#endregion
                        //#region Boolean.false
                        .repository('code.type.built-in.basic.boolean.false',
                            '#code.type.built-in.basic.boolean.false.keyword'
                        )
                            //#region Keyword
                            .repository('code.type.built-in.basic.boolean.false.keyword',
                                {
                                    match: [
                                        helpers.lookbehind(/\W|^/),
                                        /False/,
                                        helpers.lookahead(/\W|$/)
                                    ],
                                    captures: {
                                        1: 'constant.language.boolean.false.hurx'
                                    }
                                }
                            )
                            //#endregion
                        //#endregion
                    //#endregion
                //#endregion
                //#region Empty repository
                .repository('code.type.built-in.basic.empty',
                    '#code.type.built-in.basic.empty.keyword'
                )
                    //#region Keyword
                    .repository('code.type.built-in.basic.empty.keyword',
                        {
                            match: [
                                helpers.lookbehind(/\W|^/),
                                /Empty/,
                                helpers.lookahead(/\W|$/)
                            ],
                            captures: {
                                1: 'constant.language.null.hurx'
                            }
                        }
                    )
                    //#endregion
                //#endregion
                //#region Date
                //TODO:
                .repository('code.type.built-in.basic.date', {})
                //TODO:
                .repository('code.type.built-in.basic.date.keyword', {})
                //#region The string repository
                .repository('code.type.built-in.basic.string',
                    '#code.type.built-in.basic.string.quoted',
                    '#code.type.built-in.basic.string.template'
                )
                    //#region Keyword
                    .repository('code.type.built-in.basic.string.keyword', {})
                    //#endregion
                    //#region Quoted strings
                    .repository('code.type.built-in.basic.string.quoted',
                        '#code.type.built-in.basic.string.quoted.double'
                    )
                        //#region Double quoted
                        .repository('code.type.built-in.basic.string.quoted.double',
                            {
                                name: 'string.quoted.double.hurx',
                                begin: [
                                    /\"/
                                ],
                                beginCaptures: {
                                    1: 'punctuation.definition.string.begin.hurx'
                                },
                                end: [
                                    /\"/
                                ],
                                endCaptures: {
                                    1: 'punctuation.definition.string.end.hurx'
                                },
                                children: [
                                    {
                                        name: 'constant.character.escape.hurx',
                                        match: [
                                            /\\\"/
                                        ]
                                    }
                                ]
                            }
                        )
                        //#endregion
                    //#endregion
                    //#region String templates
                    // TODO: variables
                    .repository('code.type.built-in.basic.string.template',
                        {
                            name: 'string.template.hurx',
                            begin: [
                                /\`/
                            ],
                            beginCaptures: {
                                1: 'punctuation.definition.string.template.begin.hurx'
                            },
                            end: [
                                /\`/
                            ],
                            endCaptures: {
                                1: 'punctuation.definition.string.template.end.hurx'
                            },
                            children: [
                                {
                                    name: 'constant.character.escape.hurx',
                                    match: [
                                        /\\\`/
                                    ]
                                }
                            ]
                        }
                    )
                    //#endregion
                //#endregion
                //#endregion
            //#region Building blocks
            .repository('code.type.built-in.building-blocks',
                '#code.type.built-in.building-blocks.class',
                '#code.type.built-in.building-blocks.interface',
                '#code.type.built-in.building-blocks.enum'
            )
                //#region Keywords
                .repository('code.type.built-in.building-blocks.keywords',
                    '#code.type.built-in.building-blocks.class.keyword',
                    '#code.type.built-in.building-blocks.interface.keyword',
                    '#code.type.built-in.building-blocks.enum.keyword'
                )
                //#endregion
                // TODO:
                //#region Interface
                .repository('code.type.built-in.building-blocks.interface', {})
                .repository('code.type.built-in.building-blocks.interface.keyword', {})
                //#endregion
                // TODO:
                //#region Enum
                .repository('code.type.built-in.building-blocks.enum', {})
                .repository('code.type.built-in.building-blocks.enum.keyword', {})
                //#endregion
                //#region class
                .repository('code.type.built-in.building-blocks.class',
                    {
                        name: 'meta.class.hurx',
                        begin: [
                            helpers.lookbehind(/\W|^/),
                            /(\-|\~)?/,
                            /class/,
                            /\s+/,
                            /[A-Z][a-zA-Z0-9]*/
                        ],
                        beginCaptures: {
                            1: {
                                name: 'storage.modifier.access.hurx',
                                children: [
                                    {
                                        name: 'storage.modifier.access.private.hurx',
                                        match: [
                                            /\-/
                                        ]
                                    },
                                    {
                                        name: 'storage.modifier.access.protected.hurx',
                                        match: [
                                            /\~/
                                        ]
                                    }
                                ]  
                            },
                            2: 'storage.type.class.hurx',
                            4: 'entity.name.type.class.hurx'
                        },
                        children: [
                            {
                                begin: [
                                    helpers.lookbehind(/\s+[A-Z][a-zA-Z0-9]*/),
                                    helpers.lookahead(/\</)
                                ],
                                children: [
                                    '#code.type.built-in.building-blocks.generics'
                                ],
                                end: [
                                    helpers.lookahead(/\s+(\:|\{)/)
                                ]
                            },
                            {
                                name: 'meta.class.extend-implement.hurx',
                                begin: [
                                    /\:/
                                ],
                                beginCaptures: {
                                    1: 'storage.modifier.assignment.type.hurx'
                                },
                                children: [
                                    {
                                        begin: [
                                            helpers.lookbehind(/(\:)\s+/)
                                        ],
                                        children: [
                                            '#code.type.built-in.building-blocks.class.initializer',
                                        ],
                                        end: [
                                            helpers.lookahead(/\s+(\{|\:)/)
                                        ]
                                    }
                                ],
                                end: [
                                    helpers.lookahead(/\{|\:/)
                                ]
                            },
                            {
                                name: 'meta.class.body.hurx',
                                begin: [
                                    /\{/
                                ],
                                beginCaptures: {
                                    1: 'punctuation.definition.block.class.hurx'
                                },
                                children: [
                                    '#code.type.built-in.building-blocks.class.body'
                                ],
                                end: [
                                    /\}/
                                ],
                                endCaptures: {
                                    1: 'punctuation.definition.block.class.hurx'
                                }
                            }
                        ],
                        end: [
                            helpers.lookbehind(/\}/)
                        ]
                    },
                    '#code.type.built-in.building-blocks.class.keyword'
                )
                    //#region Initializer for a class
                    .repository('code.type.built-in.building-blocks.class.initializer',
                        {
                            name: 'meta.class.initializer.hurx',
                            begin: [
                                helpers.lookbehind(/\W|^/),
                                /[A-Z][a-zA-Z0-9]*/,
                                helpers.lookahead(/\</)
                            ],
                            beginCaptures: {
                                1: 'entity.name.type.class.hurx'
                            },
                            children: [
                                '#code.type.built-in.building-blocks.generics.initializer'
                            ],
                            end: [
                                helpers.lookbehind(/\>/)
                            ]
                        },
                        {
                            name: 'meta.class.initializer.hurx',
                            match: [
                                helpers.lookbehind(/\W|^/),
                                /[A-Z][a-zA-Z0-9]*/,
                                helpers.lookahead(/\W|$/)
                            ],
                            captures: {
                                1: 'entity.name.type.class.hurx'
                            }
                        }
                    )
                    //#endregion
                    //#region Keyword for a class
                    .repository('code.type.built-in.building-blocks.class.keyword',
                        {
                            name: 'storage.type.class.hurx',
                            match: [
                                helpers.lookbehind(/\W|^/),
                                /(\~|\-)?class/,
                                helpers.lookahead(/\W|$/)
                            ]
                        }
                    )
                    //#endregion
                    //#region Body of a class
                    .repository('code.type.built-in.building-blocks.class.body',
                        '#code.type.built-in.building-blocks.class.body.prop',
                        '#code.type.built-in.building-blocks.class.body.func',
                        '#code.type.built-in.building-blocks.class.body.task',
                        '#code.type',
                        '#code.pseudo'
                    )
                        //#region Tasks TODO:
                        .repository('code.type.built-in.building-blocks.class.body.task', {})
                        //#endregion
                        //#region properties
                        .repository('code.type.built-in.building-blocks.class.body.prop',
                            {
                                name: 'meta.class.body.prop.hurx',
                                begin: [
                                    helpers.lookbehind(/\W|^/),
                                    /(\-|\~)?/,
                                    /prop/,
                                    /\s+/,
                                    /[A-Z][a-zA-Z0-9]*/
                                ],
                                beginCaptures: {
                                    1: {
                                        name: 'storage.modifier.access.hurx',
                                        children: [
                                            {
                                                name: 'storage.modifier.access.private.hurx',
                                                match: [
                                                    /\-/
                                                ]
                                            },
                                            {
                                                name: 'storage.modifier.access.protected.hurx',
                                                match: [
                                                    /\~/
                                                ]
                                            }
                                        ]
                                    },
                                    2: 'storage.type.class.prop.hurx',
                                    4: 'entity.name.type.class.body.prop.hurx'
                                },
                                children: [
                                    {
                                        // TODO: refactor for more clear tokens
                                        begin: [
                                            /\:/,
                                            /\s+/
                                        ],
                                        beginCaptures: {
                                            1: 'storage.modifier.assignment.type.hurx'
                                        },
                                        children: [
                                            '#code.type.initializer',
                                            {
                                                begin: [
                                                    /\=/,
                                                    /\s+/,
                                                    /\{/
                                                ],
                                                beginCaptures: {
                                                    1: 'storage.modifier.assignment.value.hurx',
                                                    3: 'punctuation.definition.block.class.body.prop.hurx'
                                                },
                                                children: [
                                                    '#code.type.built-in.building-blocks.class.body.prop.initializer'
                                                ],
                                                end: [
                                                    /\}/
                                                ],
                                                endCaptures: {
                                                    1: 'punctuation.definition.block.class.body.prop.hurx'
                                                }
                                            }
                                        ],
                                        end: [
                                            helpers.lookahead(/\}|$/)
                                        ]
                                    }
                                ],
                                end: [
                                    helpers.lookahead(/\}|$/)
                                ]
                            },
                            '#code.type.built-in.building-blocks.class.body.prop.keyword'
                        )
                            //#region Initializer
                            .repository('code.type.built-in.building-blocks.class.body.prop.initializer',
                                {
                                    name: 'meta.class.body.prop.initializer.get.hurx',
                                    begin: [
                                        /(\-|\~)?/,
                                        /Get/,
                                        /\s+/,
                                        /\{/
                                    ],
                                    beginCaptures: {
                                        1: {
                                            name: 'storage.modifier.access.hurx',
                                            children: [
                                                {
                                                    name: 'storage.modifier.access.private.hurx',
                                                    match: [
                                                        /\-/
                                                    ]
                                                },
                                                {
                                                    name: 'storage.modifier.access.protected.hurx',
                                                    match: [
                                                        /\~/
                                                    ]
                                                }
                                            ]
                                        },
                                        2: 'storage.type.class.prop.initializer.get.hurx',
                                        4: 'punctuation.definition.block.class.body.prop.initializer.get.hurx'
                                    },
                                    children: [
                                        '#code.type.built-in.building-blocks.functionality'
                                    ],
                                    end: [
                                        /\}/
                                    ],
                                    endCaptures: {
                                        1: 'punctuation.definition.block.class.body.prop.initializer.get.hurx'
                                    }
                                },
                                {
                                    match: [
                                        /(\-|\~)?/,
                                        /Get/,
                                        helpers.lookahead(/\W|$/)
                                    ],
                                    captures: {
                                        1: {
                                            name: 'storage.modifier.access.hurx',
                                            children: [
                                                {
                                                    name: 'storage.modifier.access.private.hurx',
                                                    match: [
                                                        /\-/
                                                    ]
                                                },
                                                {
                                                    name: 'storage.modifier.access.protected.hurx',
                                                    match: [
                                                        /\~/
                                                    ]
                                                }
                                            ]
                                        },
                                        2: 'storage.type.class.prop.initializer.get.hurx',
                                    }
                                },
                                {
                                    name: 'meta.class.body.prop.initializer.set.hurx',
                                    begin: [
                                        /(\-|\~)?/,
                                        /Set/,
                                        /\s+/,
                                        /\{/
                                    ],
                                    beginCaptures: {
                                        1: {
                                            name: 'storage.modifier.access.hurx',
                                            children: [
                                                {
                                                    name: 'storage.modifier.access.private.hurx',
                                                    match: [
                                                        /\-/
                                                    ]
                                                },
                                                {
                                                    name: 'storage.modifier.access.protected.hurx',
                                                    match: [
                                                        /\~/
                                                    ]
                                                }
                                            ]
                                        },
                                        2: 'storage.type.class.prop.initializer.set.hurx',
                                        4: 'punctuation.definition.block.class.body.prop.initializer.set.hurx'
                                    },
                                    children: [
                                        '#code.type.built-in.building-blocks.functionality'
                                    ],
                                    end: [
                                        /\}/
                                    ],
                                    endCaptures: {
                                        1: 'punctuation.definition.block.class.body.prop.initializer.set.hurx'
                                    }
                                },
                                {
                                    match: [
                                        /(\-|\~)?/,
                                        /Set/,
                                        helpers.lookahead(/\W|$/)
                                    ],
                                    captures: {
                                        1: {
                                            name: 'storage.modifier.access.hurx',
                                            children: [
                                                {
                                                    name: 'storage.modifier.access.private.hurx',
                                                    match: [
                                                        /\-/
                                                    ]
                                                },
                                                {
                                                    name: 'storage.modifier.access.protected.hurx',
                                                    match: [
                                                        /\~/
                                                    ]
                                                }
                                            ]
                                        },
                                        2: 'storage.type.class.prop.initializer.set.hurx',
                                    }
                                }
                            )
                            //#endregion
                            //#region Keyword
                            .repository('code.type.built-in.building-blocks.class.body.prop.keyword',
                                {
                                    match: [
                                        helpers.lookbehind(/\W|^/),
                                        /prop/,
                                        helpers.lookahead(/\W|$/)
                                    ],
                                    captures: {
                                        1: 'storage.type.class.prop.hurx'
                                    }
                                }
                            )
                            //#endregion
                        //#endregion
                        //#region functions
                        .repository('code.type.built-in.building-blocks.class.body.func',
                            {
                                name: 'meta.class.body.func.hurx',
                                begin: [
                                    helpers.lookbehind(/\W|^/),
                                    /(\-|\~)?/,
                                    /func/,
                                    /\s+/,
                                    /[A-Z][a-zA-Z0-9]*/,
                                ],
                                beginCaptures: {
                                    1: {
                                        name: 'storage.modifier.access.hurx',
                                        children: [
                                            {
                                                name: 'storage.modifier.access.private.hurx',
                                                match: [
                                                    /\-/
                                                ]
                                            },
                                            {
                                                name: 'storage.modifier.access.protected.hurx',
                                                match: [
                                                    /\~/
                                                ]
                                            }
                                        ]
                                    },
                                    2: 'storage.type.class.func.hurx',
                                    4: 'entity.name.type.class.body.func.hurx'
                                },
                                children: [
                                    '#code.type.built-in.building-blocks.generics',
                                    {
                                        begin: [
                                            /\:/,
                                            /\s+/
                                        ],
                                        beginCaptures: {
                                            1: 'storage.modifier.assignment.type.hurx'
                                        },
                                        children: [
                                            '#code.type.initializer',
                                            {
                                                begin: [
                                                    /\=/,
                                                    /\s+/,
                                                    /\{/
                                                ],
                                                beginCaptures: {
                                                    1: 'storage.modifier.assignment.value.hurx',
                                                    3: 'punctuation.definition.block.class.body.func.hurx'
                                                },
                                                children: [
                                                    '#code.type.built-in.building-blocks.class.body.func.initializer'
                                                ],
                                                end: [
                                                    /\}/
                                                ],
                                                endCaptures: {
                                                    1: 'punctuation.definition.block.class.body.func.hurx'
                                                }
                                            }
                                        ],
                                        end: [
                                            helpers.lookahead(/\}|$/)
                                        ]
                                    }
                                ],
                                end: [
                                    helpers.lookahead(/\}|$/)
                                ]
                            },
                            '#code.type.built-in.building-blocks.class.body.func.keyword'
                        )
                            //#region Keyword TODO:
                            .repository('code.type.built-in.building-blocks.class.body.func.keyword', {})
                            //#endregion
                            //#region Initializer
                            .repository('code.type.built-in.building-blocks.class.body.func.initializer',
                                {
                                    name: 'meta.class.body.func.initializer.params.hurx',
                                    begin: [
                                        helpers.lookbehind(/\W|^/),
                                        /params/,
                                        /\s+/,
                                        /\{/
                                    ],
                                    beginCaptures: {
                                        1: 'storage.type.class.func.initializer.params.hurx',
                                        3: 'punctuation.definition.block.class.body.func.initializer.params.hurx'
                                    },
                                    children: [
                                        '#code.type.built-in.building-blocks.class.body.func.parameter',
                                        {
                                            match: [
                                                /\,/
                                            ],
                                            captures: {
                                                1: 'punctuation.separator.comma.hurx'
                                            }
                                        }
                                    ],
                                    end: [
                                        /\}/
                                    ],
                                    endCaptures: {
                                        1: 'punctuation.definition.block.class.body.func.initializer.params.hurx'
                                    }
                                },
                                {
                                    match: [
                                        helpers.lookbehind(/\W|^/),
                                        /params/,
                                        helpers.lookahead(/\W|$/)
                                    ],
                                    captures: {
                                        1: 'storage.type.class.func.initializer.params.hurx'
                                    }
                                }
                            )
                            //#endregion
                            //#region function parameters
                            .repository('code.type.built-in.building-blocks.class.body.func.parameter',
                                {
                                    name: 'meta.class.body.func.parameter.hurx',
                                    begin: [
                                        helpers.lookbehind(/\W|^/),
                                        /\$[a-z][A-Za-z0-9]*/,
                                        /\s*/,
                                        helpers.lookahead(/\:|\=/)
                                    ],
                                    beginCaptures: {
                                        1: 'entity.name.type.functionality.variable.parameter.hurx',
                                    },
                                    children: [
                                        {
                                            name: 'meta.functionality.assignment.type.hurx',
                                            begin: [
                                                /\:/,
                                                /\s*/
                                            ],
                                            beginCaptures: {
                                                1: 'storage.modifier.assignment.type.hurx'
                                            },
                                            children: [
                                                '#code.type.initializer'
                                            ],
                                            end: [
                                                helpers.lookahead(/\s*(\=|\,)/)
                                            ]
                                        },
                                        {
                                            name: 'meta.functionality.assignment.value.hurx',
                                            begin: [
                                                /\=/,
                                                /\s*/
                                            ],
                                            beginCaptures: {
                                                1: 'storage.modifier.assignment.value.hurx'
                                            },
                                            children: [
                                                '#code.value'
                                            ],
                                            end: [
                                                helpers.lookahead(/\s*(\,|\})/)
                                            ]
                                        }
                                    ],
                                    end: [
                                        helpers.lookahead(/\s*(\}|\,)/)
                                    ]
                                },
                                {
                                    match: [
                                        helpers.lookbehind(/\W|^/),
                                        /\$[a-z][A-Za-z0-9]*/,
                                        helpers.lookahead(/\W|$/)
                                    ],
                                    captures: {
                                        1: 'entity.name.type.functionality.variable.parameter.hurx'
                                    }
                                }
                            )
                            //#endregion
                        //#endregion
                    //#endregion
                //#endregion
                //#region functionality
                .repository('code.type.built-in.building-blocks.functionality',
                    '#code.type',
                    '#code.type.body',
                    '#code.type.built-in.building-blocks.functionality.variable'
                )
                    //#region Variables
                    //TODO: add const/let
                    //TODO: indexes, calling functions
                    .repository('code.type.built-in.building-blocks.functionality.variable', 
                        // Parameters
                        {
                            name: 'variable.other.parameter.hurx',
                            begin: [
                                helpers.lookbehind(/\W|^/),
                                /\$[a-z][A-Za-z0-9]*/,
                                /\s+/,
                                /\{/
                            ],
                            beginCaptures: {
                                1: 'entity.name.type.functionality.variable.parameter.hurx',
                                3: 'punctuation.definition.block.functionality.function.hurx'
                            },
                            children: [
                                '#code.type.built-in.basic',
                                '#code.type.body',
                                '#code.type.built-in.building-blocks.functionality.variable'
                            ],
                            end: [
                                /\)/
                            ],
                            endCaptures: {
                                1: 'punctuation.definition.block.functionality.function.hurx'
                            }
                        },
                        {
                            name: 'entity.name.type.functionality.variable.parameter.hurx',
                            match: [
                                helpers.lookbehind(/\W|^/),
                                /\$[a-z][A-Za-z0-9]*/,
                                helpers.lookahead(/\W|$/)
                            ]
                        },
                        // function variables
                        {
                            name: 'variable.other.hurx',
                            begin: [
                                helpers.lookbehind(/\W|^/),
                                /[a-z][A-Za-z0-9]*/,
                                /\s+/,
                                /\(/
                            ],
                            beginCaptures: {
                                1: 'entity.name.type.functionality.variable.hurx',
                                3: 'punctuation.definition.block.functionality.function.hurx'
                            },
                            children: [
                                '#code.type.built-in.basic',
                                '#code.type.body',
                                '#code.type.built-in.building-blocks.functionality.variable'
                            ],
                            end: [
                                /\)/
                            ],
                            endCaptures: {
                                1: 'punctuation.definition.block.functionality.function.hurx'
                            }
                        },    
                        {
                            name: 'entity.name.type.functionality.variable.hurx',
                            match: [
                                helpers.lookbehind(/\W|^/),
                                /[a-z][A-Za-z0-9]*/,
                                helpers.lookahead(/\W|$/)
                            ]
                        }
                    )
                //#endregion
                //#region Generics signature
                .repository('code.type.built-in.building-blocks.generics',
                    {
                        name: 'meta.type.parameters.hurx',
                        begin: [
                            /\</
                        ],
                        beginCaptures: {
                            1: 'punctuation.definition.typeparameters.begin.hurx'
                        },
                        children: [
                            // TODO: refactor for better tokens
                            {
                                name: 'meta.generic.hurx',
                                begin: [
                                    /[A-Z][a-zA-Z0-9]*/,
                                    /\s*/,
                                    /\:/,
                                    /\s+/,
                                ],
                                beginCaptures: {
                                    1: 'entity.name.type.generic.hurx',
                                    3: 'storage.modifier.assignment.type.hurx'
                                },
                                children: [
                                    '#code.type.initializer'
                                ],
                                end: [
                                    helpers.lookahead(/\s*(\>|\,|\=)/)
                                ]
                            },
                            {
                                name: 'meta.generic.value.hurx',
                                begin: [
                                    /\=/
                                ],
                                beginCaptures: {
                                    1: 'storage.modifier.assignment.value.hurx'
                                },
                                children: [
                                    '#code.type.initializer'
                                ],
                                end: [
                                    helpers.lookahead(/\s*(\>|\,)/)
                                ]
                            },
                            {
                                name: 'punctuation.separator.comma.hurx',
                                match: [
                                    /\,/
                                ]
                            }
                        ],
                        end: [
                            /\>/
                        ],
                        endCaptures: {
                            1: 'punctuation.definition.typeparameters.end.hurx'
                        }
                    }
                )
                    //#region Initializer
                    .repository('code.type.built-in.building-blocks.generics.initializer',
                        {
                            name: 'meta.type.parameters.hurx',
                            begin: [
                                /\</
                            ],
                            beginCaptures: {
                                1: 'punctuation.definition.typeparameters.begin.hurx'
                            },
                            children: [
                                '#code.type.initializer'
                            ],
                            end: [
                                /\>/
                            ],
                            endCaptures: {
                                1: 'punctuation.definition.typeparameters.end.hurx'
                            }
                        }
                    )
                    //#endregion
            //#endregion
        //#endregion
            //#endregion
        //#endregion
    //#endregion
        //#region Interface keywords
        .repository('code.type.keyword',
            {
                match: [
                    helpers.lookbehind(/^|\W/),
                    /(\~|\-)?type/,
                    helpers.lookahead(/\W|$/)
                ],
                captures: {
                    1: 'storage.type.interface.hurx'
                }
            },
            '#code.type.built-in.basic.number.decimal.keyword',
            '#code.type.built-in.basic.number.integer.keyword',
            '#code.type.built-in.basic.number.keyword',
            '#code.type.built-in.basic.string.keyword',
            '#code.type.built-in.basic.boolean.true.keyword',
            '#code.type.built-in.basic.boolean.false.keyword',
            '#code.type.built-in.basic.date.keyword',
            '#code.type.built-in.basic.empty.keyword'
        )
        //#endregion
    //#region Pseudo
    .repository('code.pseudo',
        '#code.pseudo.todo',
        '#code.pseudo.doc',
        '#code.pseudo.comment',
        '#code.pseudo.group',
        '#code.pseudo.keywords'
    )
        //#region Keywords
        .repository('code.pseudo.keywords',
            '#code.pseudo.todo.keyword',
            '#code.pseudo.doc.keyword',
            '#code.pseudo.comment.keyword',
            '#code.pseudo.group.keyword'
        )
        //#endregion
        // TODO:
        //#region group
        .repository('code.pseudo.group', {})
        .repository('code.pseudo.group.keyword', {})
        //#endregion
        //#region To-do
        .repository('code.pseudo.todo',
            {
                name: 'meta.todo.hurx',
                match: [
                    helpers.lookbehind(/^\s*/),
                    /\@todo/,
                    /\s+/,
                    /.*/,
                    /\s*$/
                ],
                captures: {
                    1: {
                        children: [
                            '#code.pseudo.todo.keyword'
                        ]
                    },
                    3: 'meta.todo.body.hurx'
                }
            },
            '#code.pseudo.todo.keyword'
        )
            //#region Keyword
            .repository('code.pseudo.todo.keyword',
                {
                    name: 'meta.todo.hurx',
                    match: [
                        helpers.lookbehind(/\W|^/),
                        /\@todo/,
                        helpers.lookahead(/\W|$/)
                    ],
                    captures: {
                        1: 'punctuation.definition.todo.hurx'
                    }
                }
            )
            //#endregion
        //#endregion
        //#region Docs
        .repository('code.pseudo.doc',
            {
                name: 'meta.doc.hurx',
                match: [
                    helpers.lookbehind(/^\s*/),
                    /\@doc/,
                    /(\:[A-Z][a-zA-Z0-9]*)?/,
                    /\s*/,
                    /.*/,
                    /\s*$/
                ],
                captures: {
                    1: 'punctuation.definition.doc.hurx',
                    2: {
                        children: [
                            {
                                name: 'punctuation.definition.doc.param.hurx',
                                match: [
                                    /\:/,
                                ],
                            },
                            {
                                name: 'meta.doc.param.hurx',
                                match: [
                                    /[A-Z][a-zA-Z0-9]*/
                                ]
                            }
                        ]
                    },
                    4: 'meta.doc.body.hurx'
                }
            },
            {
                name: 'meta.doc.hurx',
                match: [
                    helpers.lookbehind(/^\s*/),
                    /\@doc/,
                    regex(
                        regex(
                            new RegExp('(~' + docMetaOptions + ')?'),
                            /\s*/,
                            /.*/,
                            /\s*/
                        )
                        .or(
                            /\s*/,
                            /.*/,
                            /\s*/
                        )
                    )
                ],
                captures: {
                    1: 'punctuation.definition.doc.hurx',
                    2: {
                        children: [
                            {
                                name: 'punctuation.definition.doc.meta.hurx',
                                match: [
                                    /\~/,
                                ],
                            },
                            {
                                name: 'meta.doc.meta.hurx',
                                match: [
                                    new RegExp(docMetaOptions)
                                ]
                            }
                        ]
                    },
                    4: 'meta.doc.body.hurx'
                }
            },
            '#code.pseudo.doc.keyword'
        )
            //#region Keyword
            .repository('code.pseudo.doc.keyword',
                {
                    name: 'meta.doc.hurx',
                    match: [
                        helpers.lookbehind(/\W|^/),
                        /\@doc/,
                        helpers.lookahead(/\W|$/)
                    ],
                    captures: {
                        1: 'punctuation.definition.doc.hurx',
                    }
                }
            )
            //#endregion
        //#endregion
        //#region Comment
        .repository('code.pseudo.comment', 
            {
                name: 'meta.comment.hurx',
                match: [
                    helpers.lookbehind(/^\s*/),
                    /\@comment/,
                    /\s+/,
                    /.*/,
                    /\s*$/
                ],
                captures: {
                    1: 'punctuation.definition.comment.hurx',
                    3: 'meta.comment.body.hurx'
                }
            },
            '#code.pseudo.comment.keyword'
        )
            //#region Keyword
            .repository('code.pseudo.comment.keyword',
                {
                    name: 'meta.comment.hurx',
                    match: [
                        helpers.lookbehind(/\W|^/),
                        /\@comment/,
                        helpers.lookahead(/\W|$/)
                    ],
                    captures: {
                        1: 'punctuation.definition.comment.hurx'
                    }
                }
            )
            //#endregion
        //#endregion
    //#endregion      
//#endregion

// Build the grammar file
.build(path.join(__dirname, '../../../../../res', 'languages', 'hurx'))