import TextPosition from './text-position'
import TextDocumentNode from './text-document-node'
import { Subject } from 'rxjs'
import TextRange from './text-range'
import TextDocumentLogger from './text-document-logger'
import Languages from '../languages'
import { TMLanguage } from '../models/tm-language'
import { TMPattern } from '../models/tm-pattern'
import TextDocumentToken from './information/text-document-token'
import TextDocumentInformation from './information/text-document-information'

/**
 * A text document
 */
export default class TextDocument {
    /**
     * The mode
     */
    public mode: 'test' | 'default' = 'default'

    /**
     * The text document contexts
     */
    public nodes: TextDocumentNode[] = []

    /**
     * The hierarchy nodes that determine the level
     */
    public hierarchyNodes: TextDocumentNode[] = []

    /**
     * The console
     */
    public get console(): TextDocumentLogger {
        return this.node.console
    }

    /**
     * The current text document node
     */
    public node!: TextDocumentNode

    /**
     * The document content
     */
    public content!: string

    /**
     * What's already processed
     */
    public processed!: string

    /**
     * The current text position
     */
    public position!: TextPosition

    /**
     * The events
     */
    public events = {
        changed: new Subject<TextPosition>,
        nextLine: new Subject<TextPosition>
    }

    /**
     * The substring of the line
     */
    public get substring(): string {
        return this.line.substring(this.position.char)
    }

    /**
     * Split the content into lines
    */
    public get lines(): string[] {
        return this.content.split(/\r\n|\r|\n/)
    }

    /**
     * Read a line from the document
     */
    public get line(): string {
        let line = this.lines[this.position.line] || ''
        let offset = this.node.options.data.captureIndicesOffset
        let endIndex = this.node.options.data.endIndex
            ? this.node.options.data.endIndex + (offset || 0)
            : line.length
        return line.substring(0, endIndex)
    }

    /**
     * Increase the current caret position
     * @param chars the amount of chars to move 
     **/
    public increasePosition(chars: number): 'exit' | undefined {
        if (chars <= 0) {
            return
        }
        this.processed += this.line[this.position.char]
        const line = this.lines[this.position.line] || ''
        if (this.position.char === line.length) {
            this.processed += '\n'
            this.position.char = 0
            this.position.line++
            if (this.position.line === this.lines.length) {
                this.console.verbose('EXIT106')
                return 'exit'
            }
            this.events.nextLine.next(this.position)
        }
        else {
            if (this.position.char > line.length - 1) {
                throw new Error(`Something is wrong, the char position is out of bounds.`)
            }
            this.position.char++
        }
        chars--
        this.console.position(`${this.position.line + 1}:${this.position.char + 1}`)
        if (chars > 0) {
            this.console.verbose('INCR (Function)')
            if (this.increasePosition(chars) === 'exit') {
                this.console.verbose('EXIT122')
                return 'exit'
            }
        }
        else {
            this.events.changed.next(this.position)
        }
    }

    /**
     * Processes the tm language object into tokens
     */
    public process(): TextDocumentInformation {
        while (true) {
            if (this.processLoop('increase').exit) {
                break
            }
        }
        return this.generateDocumentInformation()
    }

    /**
     * Test a repository
     * @param repositoryName 
     * @returns 
     */
    public test<RepositoryName extends string>(repositoryName: RepositoryName): TextDocumentInformation {
        if (!this.tmLanguage.repository[repositoryName]) {
            throw new Error(`Repository "${repositoryName}" does not exist on language "${this.tmLanguage.name}"`)
        }
        let content = this.content
        let tmLanguage = this.tmLanguage
        let processed = this.processed
        let position = this.position
        let node = this.node
        let nodes = this.nodes
        let hierarchyNodes = this.hierarchyNodes
        let mode = this.mode
        this.initialize(this.content, {
            ...this.tmLanguage,
            patterns: [
                {
                    include: `#${repositoryName}`
                }
            ]
        })
        this.console.trace(`Testing repository: "${repositoryName}"`)
        const info = this.process()
        this.mode = mode
        this.content = content
        this.tmLanguage = tmLanguage
        this.processed = processed
        this.position = position
        this.node = node
        this.nodes = nodes
        this.hierarchyNodes = hierarchyNodes
        return info
    }

    /**
     * Generates the document information
     * @returns the information
     */
    private generateDocumentInformation(): TextDocumentInformation {
        if (!this.nodes.length) {
            throw Error("Something is wrong with the tokenizer, there are no nodes.")
        }
        if (!this.nodes.includes(this.node.root)) {
            throw Error(`There is no root node found in the nodes.`)
        }
        let tokenRoot: TextDocumentToken
        let tokens: TextDocumentToken[] = []
        for (const node of this.nodes) {
            if (!node.options.token.position.end) {
                node.options.token.position.end = new TextPosition(this.lines.length - 1, this.lines[this.lines.length - 1].length)
            }
            let token = new TextDocumentToken(node)
            if (node === node.root) {
                tokenRoot = token
            }
            tokens.push(token)
            token.children = this.hierarchyNodes.filter((v) => v.options.data.parent === node).map((v) => new TextDocumentToken(node))
        }
        this.console.trace(`EOF`)
        return new TextDocumentInformation({
            root: tokenRoot!,
            all: tokens
        })
    }

    /**
     * Read a range of text
     * @param range the range of text
     * @returns the read text
     */
    public read = (range: TextRange) => {
        let processed = ''
        for (let i = range.start.line; i < this.lines.length; i++) {
            if (i === range.start.line) {
                if (i === range.end.line) {
                    processed = this.lines[i].substring(range.start.char, range.end.char)
                    return processed
                }
            }
            else if (i === range.end.line) {
                processed += this.lines[i].substring(0, range.end.char)
                return processed
            }
            else {
                processed += this.lines[i]
            }
            processed += '\n'
        }
    }

    /**
     * The loop of the process
     */
    private processLoop(mode: 'increase' | 'keep-count'): { increased: number, exit: boolean } {
        this.console.debug(`Processing loop started`)
        const currentNode = this.node
        let { increased, exit } = this.processNode()

        if (increased === 0 && this.node.options.data.patternsIndex === this.node.patterns.length) {
            // If there are no more patterns to process, check if the node is at the semiroot.
            if (this.node.semiroot === this.node) {
                // If the node is already at the semiroot, set increased to 1 to move to the next line.
                increased = 1
            } else {
                // If the node is not at the semiroot, move to the parent node.
                this.console.verbose(`PAR195`)
                this.node.parent()
            }
        }

        if (mode === 'increase') {
            this.console.verbose('INCR189')
            if (this.increasePosition(increased) === 'exit') {
                return {
                    increased,
                    exit: true
                }
            }
            return this.processNode()
        } else {
            return {
                increased,
                exit
            }
        }
    }

    /**
     * Processes the current node
     */
    private processNode(): { increased: number, exit: boolean } {
        this.console.debug(`Processing node`)
        const increased = this.processPatterns()
        return increased
    }

    /**
     * Processes the child patterns
     * @return the chars that have been processed
     */
    private processPatterns(): { increased: number, exit: boolean } {
        this.console.debug(`Processing patterns`)
        this.node.options.data.patternsIndex = 0
        for (const pattern of this.node.patterns) {
            if (this.node.options.data.endIndex && this.node.options.data.endIndex > this.position.line) {
                this.node.options.data.endIndex = undefined
            }
            const name = pattern.name || pattern.contentName || (pattern as any).scopeName || 'No name'
            this.console.debug(`Processing pattern${name?.length ? ` "${name}"` : ''}`)
            this.node.options.data.patternsIndex++
            if (pattern.include?.length) {
                if (pattern.include.startsWith('#')) {
                    const repository = this.node.repository(pattern.include.substring(1))
                    if (repository) {
                        this.console.verbose(`CHI240`)
                        this.node.child({
                            scopes: [],
                            type: 'repository',
                            status: [],
                            repository
                        })
                        return {
                            increased: 0,
                            exit: false
                        }
                    }
                    else {
                        this.console.warn(`Repository with name "${pattern.include.substring(1)}" was not found in language "${this.node.language.name}".`)
                    }
                }
                else {
                    const language = pattern.include === '$self' ? this.tmLanguage : this.languages.find(pattern.include)
                    if (language) {
                        this.console.verbose(`CHI259`)
                        this.node.child({
                            scopes: [language.scopeName],
                            type: 'language',
                            status: [],
                            language
                        })
                        return {
                            increased: 0,
                            exit: false
                        }
                    }
                    else {
                        this.console.warn(`Language with scopeName "${pattern.include}" could not be found as it was not loaded into the Language service.`)
                    }
                }
            }
            else if (pattern.begin?.length && !this.node.hasStatus('captures-done')) {
                const exec = this.convertPatternMatchToExecArray(pattern.begin)
                if (exec && exec[0] !== null) {
                    this.console.verbose(`CHI298`)
                    this.node.child({
                        endIndex: this.node.options.data.endIndex || (this.position.char + exec[0].length),
                        scopes: [pattern.name],
                        type: 'beginCaptures',
                        status: ['begin-matched', 'being-captured'],
                        captures: {
                            type: 'begin',
                            data: pattern.beginCaptures,
                            matches: {
                                begin: new TextRange(
                                    new TextPosition(this.position.line, this.position.char),
                                    new TextPosition(this.position.line, this.node.options.data.endIndex || (this.position.char + exec[0].length)),
                                )
                            }
                        },
                        pattern
                    })
                    const startIndex = this.position.char
                    const increased = this.processCaptureGroup(exec)
                    if (increased === 'exit') {
                        this.console.verbose(`EXIT352`)
                        return {
                            increased: this.position.char - startIndex,
                            exit: true
                        }
                    }
                    this.console.verbose('INCR314')
                    if (this.increasePosition(increased) === 'exit') {
                        return {
                            increased,
                            exit: true
                        }
                    }
                    return {
                        increased,
                        exit: false
                    }
                }
            }
            else if (pattern.match?.length) {
                const exec = this.convertPatternMatchToExecArray(pattern.match)
                if (exec && exec[0] !== null) {
                    this.console.verbose(`CHI353`)
                    this.node.child({
                        endIndex: this.node.options.data.endIndex || (this.position.char + exec[0].length),
                        scopes: [pattern.name],
                        type: 'captures',
                        status: ['being-captured'],
                        captures: {
                            type: 'match',
                            data: pattern.captures,
                            matches: {
                                match: new TextRange(
                                    new TextPosition(this.position.line, this.position.char),
                                    new TextPosition(this.position.line, this.node.options.data.endIndex || (this.position.char + exec[0].length)),
                                )
                            }
                        },
                        pattern
                    })
                    const startIndex = this.position.char
                    const increased = this.processCaptureGroup(exec)
                    if (increased === 'exit') {
                        this.console.verbose('EXIT417')
                        return {
                            increased: this.position.char - startIndex,
                            exit: true
                        }
                    }
                    this.console.verbose(`PAR368`, {
                        increased
                    })
                    const status = this.increasePosition(increased)
                    this.node.parent()
                    this.console.verbose('INCR370')
                    if (status === 'exit') {
                        this.console.verbose('EXIT30')
                        return {
                            increased: increased,
                            exit: true
                        }
                    }
                    return {
                        increased: increased,
                        exit: false
                    }
                }
            }
            else { }
            // else if (pattern.while?.length) {
            //     let match = this.substring.match(new RegExp(pattern.while, 'g'))
            //     if (!match && /(\((\?\<\=)|(\?\<\!)|(\?\:))/g.test(pattern.while)) {
            //         match = line.match(new RegExp(pattern.while, 'g'))
            //         if (!match || !this.substring.startsWith(match[0])) {
            //             match = null
            //         }
            //     }
            //     if (match) {
            //         level.nextLevel('captures', [pattern.name])
            //         this.processCaptureGroup(pattern, match)
            //         level.prevLevel()
            //         this.processPatterns(this.hierarchy.currentLevel.patterns)
            //         break
            //     }
            // }
            // else if (pattern.end?.length) {
            //     let match = this.substring.match(new RegExp(pattern.end, 'g'))
            //     if (!match && /(\((\?\<\=)|(\?\<\!)|(\?\:))/g.test(pattern.end)) {
            //         match = line.match(new RegExp(pattern.end, 'g'))
            //         if (!match || !this.substring.startsWith(match[0])) {
            //             match = null
            //         }
            //     }
            //     if (match) {
            //         level.nextLevel('captures', [pattern.name])
            //         this.processCaptureGroup(pattern, match)
            //         level.prevLevel()
            //         this.processPatterns(this.hierarchy.currentLevel.patterns)
            //         break
            //     }
            // }
            // else {
            //     this.logger.warning(`Invalid pattern`)
            //     this.logger.data(tm)
            // }
        }
        return {
            increased: 1,
            exit: false
        }
    }

    /**
     * Converts a pattern match to exec array
     * @param match the regex match source
     * @returns the exec array
     */
    private convertPatternMatchToExecArray = (match: string): RegExpExecArray|null => {
        let substring = this.substring
        let line = this.lines[this.position.line]
        // TODO: test ?: expression
        let hasZeroWidthAssertions: boolean = /(\((\?\<\=)|(\?\<\!))/g.test(match)
        let exec: RegExpExecArray | null = null
        if (hasZeroWidthAssertions && this.position.char > 0) {
            let lastExec: RegExpExecArray|null = exec
            for (let i = 0; i <= this.position.char; i ++) {
                exec = new RegExp(match).exec(line.substring(i))
                if (exec && exec[0] !== null) {
                    lastExec = exec
                }
                else {
                    return lastExec
                }
            }
            return lastExec
        }
        exec = new RegExp(`^${match}`, 'g').exec(substring)
        return exec
    }

    /**
     * Processes the current capture group
     */
    private processCaptureGroup(match: RegExpMatchArray): number | 'exit' {
        const captures = this.node.options.data.captures
        if (!captures) {
            throw Error(`Current node has no captures in its options and "processCaptureGroup" has been called.`)
        }
        if (!captures?.data || !Object.keys(captures.data).length) {
            this.node.options.data.status = this.node.options.data.status.filter((v) => v !== 'being-captured')
            return match[0].length
        }
        const startIndex = this.position.char
        const endIndex = startIndex + match[0].length
        let delta = endIndex - startIndex
        let subtractFromReturn = 0
        this.console.verbose(`CAP486`, {
            startIndex,
            endIndex,
            match,
            delta
        })
        if (Object.keys(captures.data || {}).length) {
            for (const captureId of Object.keys(captures.data || {})) {
                let processed = 0
                if (!/^[0-9]+$/.test(captureId)) {
                    continue
                }
                let startIndexCaptureGroup = subtractFromReturn
                let endIndexCaptureGroup = Number(match[Number(captureId)]?.length || 0) + this.position.char
                let deltaCaptureGroup = endIndexCaptureGroup - startIndexCaptureGroup
                this.console.verbose(`CAP534`, {
                    captureId,
                    startIndex,
                    startIndexCaptureGroup,
                    endIndex,
                    endIndexCaptureGroup,
                    deltaCaptureGroup,
                    subtractFromReturn
                })
                const pattern = (captures.data as any)[captureId] as TMPattern
                this.console.verbose(`CHI489`)
                const child = this.node.child({
                    type: 'captures-pattern',
                    endIndex: endIndexCaptureGroup,
                    captureIndicesOffset: processed + (this.node.options.data.captureIndicesOffset || 0),
                    pattern,
                    captures: captures,
                    scopes: [pattern.name],
                    status: []
                })
                if (pattern.patterns?.length) {
                    while (subtractFromReturn < endIndexCaptureGroup) {
                        const { increased } = this.processLoop('keep-count')
                        subtractFromReturn += increased
                        child.offset = increased
                        processed += increased
                        while (this.node !== child && this.node !== this.node.semiroot) {
                            this.console.verbose(`Node scopes: ${this.node.scope}`)
                            this.console.verbose(`PAR520`)
                            this.node.parent()
                        }
                    }
                    child.offset = 0
                    if (captureId === "0") {
                        this.console.verbose(`PAR527`, {
                            isSemiRoot: this.node === this.node.semiroot,
                            type: this.node.options.data.type,
                            status: this.node.options.data.status,
                            subtractFromReturn,
                            endIndex,
                            position: this.position,
                            patternsIndex: this.node.options.data.patternsIndex,
                            captureIndicesOffset: this.node.options.data.captureIndicesOffset
                        })
                        if (endIndex === this.position.char) {
                            this.node.options.data.status = this.node.options.data.status.filter((v) => v !== 'being-captured')
                            this.node.parent()
                            break
                        }
                        else {
                            this.console.verbose(`INCR535`)
                            if (this.increasePosition(endIndex - this.position.char) === 'exit') {
                                this.console.verbose(`EXIT572`)
                                return 'exit'
                            }
                            this.node.options.data.status = this.node.options.data.status.filter((v) => v !== 'being-captured')
                            this.console.verbose('VER537')
                            this.node.parent()
                        }
                        // TODO: should other captures still be tried to be captured as far as possible?
                        break
                    }
                    else {
                        // TODO: should other captures still be tried to be captured as far as possible?
                    }
                }
                else {
                    if (captureId === "0") {
                        this.console.verbose(`CAP590`)
                        if (Object.keys(captures.data).length > 1) {
                            this.console.verbose(`VER591`)
                            continue
                        }
                        else {
                            this.console.verbose(`PAR603`, {
                                start: startIndexCaptureGroup,
                                subtractFromReturn,
                                position: this.position,
                                endIndex,
                                endIndexCaptureGroup
                            })
                            this.node.parent()
                        }
                    }
                    else {
                        const increase = endIndexCaptureGroup - subtractFromReturn
                        if (increase) {
                            subtractFromReturn = endIndexCaptureGroup

                            this.console.verbose(`INCR623`)
                            if (this.increasePosition(increase) === 'exit') {
                                this.console.verbose('EXIT656')
                                return 'exit'
                            }
                        }
                        this.console.verbose(`PAR615`)
                        this.node.parent()
                    }
                }
            }
        }
        this.node.options.data.status = this.node.options.data.status.filter((v) => v !== 'being-captured')
        if (this.node.semiroot === this.node) {
            this.console.verbose(`CHI622`)
            this.node.child({
                type: 'pattern-body',
                pattern: this.node.options.data.pattern,
                captures: captures,
                scopes: [this.node.options.data.pattern?.contentName],
                status: ['begin-matched', 'captures-done']
            })
        }
        else {
            this.console.verbose(`PAR561`, {
                semiroot: this.node === this.node.semiroot,
                nodeName: this.node.name,
                scopes: this.node.scope,
                statuses: this.node.options.data.status,
                type: this.node.options.data.type,
                endIndex: this.node.options.data.endIndex,
                position: this.node.options.token.document.position,
                captures: this.node.options.data.captures,
                conditions: [
                    (this.node.hasStatus('begin-matched') && !this.node.hasStatus('end-matched') && this.node.isWithinSomeCapturesNode)
                    && this.node.options.data.endIndex !== this.position.char,
                    (this.node.hasStatus('begin-matched') && !this.node.hasStatus('end-matched'))
                    && this.node.options.data.type === 'pattern-body',
                    (this.node.hasStatus('begin-matched') && !this.node.hasStatus('end-matched'))
                ]
            })
            this.node.parent()
        }
        return match[0].length - subtractFromReturn
    }

    constructor(content: string, public tmLanguage: TMLanguage, public path: string, public languages: Languages) {
        this.content = content
        this.processed = ''
        this.position = new TextPosition(0, 0)
        this.node = new TextDocumentNode({
            data: {
                parent: null,
                type: 'language',
                status: [],
                language: this.tmLanguage
            },
            token: {
                position: { start: new TextPosition(this.position.line, this.position.char) },
                scopes: [this.tmLanguage.scopeName],
                document: this
            },
            services: {
                languages: this.languages
            }
        }, this.node, this.languages, this)
    }

    /**
     * (Re-)initializes the text document
     */
    public initialize(content: string, tmLanguage: TMLanguage) {
        this.content = content
        this.tmLanguage = tmLanguage
        this.processed = ''
        this.position = new TextPosition(0, 0)
        this.node = new TextDocumentNode({
            data: {
                parent: null,
                type: 'language',
                status: [],
                language: this.tmLanguage
            },
            token: {
                position: { start: new TextPosition(this.position.line, this.position.char) },
                scopes: [this.tmLanguage.scopeName],
                document: this
            },
            services: {
                languages: this.languages
            }
        }, this.node, this.languages, this)
    }
}