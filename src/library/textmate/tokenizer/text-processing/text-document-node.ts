import TextDocument from "./text-document"
import TextPosition from "./text-position"
import TextRange from "./text-range"
import TextDocumentLogger from "./text-document-logger"
import { TMPattern } from "../models/tm-pattern"
import Languages from "../languages"
import { TMLanguage } from "../models/tm-language"
import { TMRepository } from "../models/tm-repository"

/**
 * The context type
 */
export type TextDocumentNodeType = 'pattern-body' | 'begin-pattern' | 'repository' | 'language' | 'captures-pattern' | 'captures' | 'beginCaptures' | 'whileCaptures' | 'endCaptures'

/**
 * The capture type
 */
export type TextDocumentNodeCaptureType = 'begin' | 'end' | 'while' | 'match'

/**
 * The statuses
 */
export type TextDocumentNodeStatus = 'begin-matched' | 'end-matched' | 'begin-captures-done' | 'captures-done' | 'end-captures-done' | 'while-captures-done' | 'being-captured'

/**
 * The options for a node
 */
export type TextDocumentNodeOptions = {
    /**
     * The data of this node
     */
    data: {
        /**
         * The parent node
         */
        parent?: TextDocumentNode | null
        /**
         * The type of this node
         */
        type: TextDocumentNodeType
        /**
         * The statuses of this node
         */
        status: TextDocumentNodeStatus[],
        /**
         * The index at which it must stop matching
         */
        endIndex?: number
        /**
         * The captures of this node, if its a capture type
         */
        captures?: {
            /**
             * The capture type
             */
            type: TextDocumentNodeCaptureType
            /**
             * The capture groups
             */
            data: TMPattern['captures']
            /**
             * The capture matches
             */
            matches?: {
                begin?: TextRange
                end?: TextRange
                while?: TextRange
                match?: TextRange
            }
        },
        /**
         * The pattern of this node, if its a pattern
         */
        pattern?: TMPattern
        /**
         * The index in `this.patterns`
         */
        patternsIndex?: number
        /**
         * Capture indices processed that should still be included in the this.line
         */
        captureIndicesOffset?: number
        /**
         * The repository of this node, if its a repository
         */
        repository?: TMRepository
        /**
         * The language of this node, if its a language
         */
        language?: TMLanguage
    }
    /**
     * The token data
     */
    token: {
        /**
         * The position, used to generate a token from this
         */
        position: {
            start: TextPosition,
            end?: TextPosition
        }
        /**
         * The scopes for this node only
         */
        scopes: string[]
        /**
         * The text document
         */
        document: TextDocument
    }
    /**
     * The services
     */
    services: {
        languages: Languages
    }
}

/**
 * The base document node options
 */
export type BaseTextDocumentNodeOptions = {
    /**
     * The scopes to add
     */
    scopes: (string | undefined)[]
    /**
     * The index at which it must stop matching
     */
    endIndex?: number
    /**
     * The type of this node
     */
    type: TextDocumentNodeType
    /**
     * Capture indices processed that should still be included in the this.line
     */
    captureIndicesOffset?: number
    /**
     * The statuses of this node
     */
    status: TextDocumentNodeStatus[]
    /**
     * The captures of this node, if its a capture type
     */
    captures?: {
        /**
         * The capture type
         */
        type: TextDocumentNodeCaptureType
        /**
         * The capture groups
         */
        data: TMPattern['captures']
        /**
         * The capture matches
         */
        matches?: {
            begin?: TextRange
            end?: TextRange
            while?: TextRange
            match?: TextRange
        }
    }
    /**
     * The pattern of this node, if its a pattern
     */
    pattern?: TMPattern
    /**
     * The repository of this node, if its a repository
     */
    repository?: TMRepository
    /**
     * The language of this node, if its a language
     */
    language?: TMLanguage
}

/**
 * A text document node
 */
export default class TextDocumentNode {
    /**
     * Get the root node
     */
    public get root(): TextDocumentNode {
        let node = this
        while (node.options.data.parent) {
            node = node.options.data.parent as any
        }
        return node
    }

    /**
     * The node options
     */
    public options: TextDocumentNodeOptions

    /**
     * The console for this node
     */
    public console: TextDocumentLogger

    /**
     * Get the highest level of node that can be set to its parent
     */
    public get semiroot(): TextDocumentNode {
        let node = this;

        const isTheSemiroot = () => {
            if (node.hasStatus('begin-matched') && !node.hasStatus('end-matched')) {
                if (node.options.data.endIndex !== undefined && node.options.data.captures?.type === 'begin' && node.options.data.captures?.matches?.begin?.end.char === node.options.data.endIndex) {
                    return node.options.data.endIndex === node.options.token.document.position.char
                }
                if (node.isWithinSomeCapturesNode) {
                    return node.options.data.endIndex !== this.options.token.document.position.char;
                } 
                else if (node.options.data.type === 'pattern-body') {
                    return true
                }
                return true
            }
            return false
        }

        if (isTheSemiroot()) {
            this.console.verbose(`VER231`, {
                nodeName: node.name,
                scopes: node.scope,
                statuses: node.options.data.status,
                type: node.options.data.type,
                endIndex: node.options.data.endIndex,
                position: node.options.token.document.position,
                captures: node.options.data.captures,
                conditions: [
                    (node.hasStatus('begin-matched') && !node.hasStatus('end-matched') && node.isWithinSomeCapturesNode)
                    && node.options.data.endIndex !== this.options.token.document.position.char,
                    (node.hasStatus('begin-matched') && !node.hasStatus('end-matched'))
                    && node.options.data.type === 'pattern-body',
                    (node.hasStatus('begin-matched') && !node.hasStatus('end-matched'))
                ],
            })
            return node
        }

        while (node.options.data.parent) {
            node = node.options.data.parent as any;
            if (isTheSemiroot()) {
                this.console.verbose(`VER240`, {
                    nodeName: node.name,
                    scopes: node.scope,
                })
                return node
            }
        }

        this.console.verbose(`VER247`, {
            nodeName: node.name,
            scopes: node.scope,
        })
        return node;
    }

    /**
     * Whether this node is the closest to the root with the given status
     * @param status the status
     */
    public isClosestToRootWithStatus(status: TextDocumentNodeStatus) {
        let node = this
        if (!node.hasStatus(status)) {
            return false
        }
        while (node.options.data.parent) {
            node = node.options.data.parent as any
            if (!node.hasStatus(status)) {
                return false
            }
        }
        return true
    }

    /**
     * Whether this node is within a captures node
     */
    public get isWithinSomeCapturesNode(): boolean {
        let node = this
        while (node.options.data.parent) {
            node = node.options.data.parent as any
            if (['beginCaptures', 'whileCaptures', 'captures', 'endCaptures', 'captures-pattern'].includes(node.options.data.type)) {
                return true
            }
        }
        return false
    }

    /**
     * Get the level of this node
     */
    public get level(): number {
        let node = this
        let level = 0
        while (node.options.data.parent) {
            node = node.options.data.parent as any
            level++
        }
        return level
    }

    /**
     * Gets all the scopes that are new, compared to the scopes of its parents
     */
    public get scope(): string | null {
        return this.options.token.scopes[this.options.token.scopes.length - 1] || null
    }

    /**
     * Set the offset for the node so the substring/line is longer at the start for matching
     * the child patterns and child captures within capture groups.
     */
    public set offset(offset: number) {
        this.options.data.captureIndicesOffset = offset
    }

    /**
     * The range of text this context has covered
     */
    public get range(): TextRange | null {
        return this.options.token.position.end
            ? new TextRange(this.options.token.position.start, this.options.token.position.end)
            : null
    }

    /**
     * Get the language for this node
     */
    public get language(): TMLanguage {
        let node = this
        if (node.options.data.language) {
            return node.options.data.language
        }
        while (node.options.data.parent) {
            node = node.options.data.parent as any
            if (node.options.data.language) {
                return node.options.data.language
            }
        }
        return this.root.language
    }

    /**
     * Get a repository
     */
    public repository(repositoryName?: string): TMRepository | null {
        return repositoryName?.length
            ? this.language.repository[repositoryName] || null
            : null
    }

    /**
     * Checks whether this node has a given status
     * @param status the status
     * @param includeParents whether to include the parent nodes
     * @returns 
     */
    public hasStatus = (status: TextDocumentNodeStatus, includeParents: boolean = false) => {
        let node = this
        if (includeParents) {
            if (node.options.data.status.includes(status)) {
                return true
            }
            while (node.options.data.parent) {
                node = node.options.data.parent as any
                if (node.options.data.status.includes(status)) {
                    return true
                }
            }
        }
        return node.options.data.status.includes(status)
    }

    /**
     * Get a name for this node
     */
    public get name(): string | null {
        switch (this.options.data.type) {
            case 'whileCaptures':
            case 'captures':
            case 'endCaptures':
            case 'beginCaptures': {
                return null
            }
            case 'captures-pattern':
            case 'begin-pattern':
            case 'pattern-body': {
                return this.options.data.pattern?.name || null
            }
            case 'repository': {
                const name = Object.keys(this.language.repository).map(v => ({ repository: this.language.repository[v], name: v })).find((v) => v.repository === this.options.data.repository)?.name
                return name || null
            }
            case 'language': {
                return this.options.data.language?.name || null
            }
        }
    }

    /**
     * Get the patterns within this node, if there are any
     */
    public get patterns(): TMPattern[] {
        switch (this.options.data.type) {
            case 'whileCaptures':
            case 'captures':
            case 'endCaptures':
            case 'beginCaptures':
            case 'captures-pattern':
            case 'begin-pattern':
            case 'pattern-body': {
                return this.options.data.pattern?.patterns || []
            }
            case 'repository': {
                return this.options.data.repository?.patterns || []
            }
            case 'language': {
                return this.options.data.language?.patterns || []
            }
        }
    }

    constructor(options: TextDocumentNodeOptions, parent: TextDocumentNode | null, languages: Languages, document: TextDocument) {
        this.options = {
            data: {
                endIndex: options.data.endIndex === undefined
                    ? parent?.options.data.endIndex === undefined
                        ? undefined
                        : parent?.options.data.endIndex
                    : options.data.endIndex,
                captures: options.data.captures,
                language: options.data.language,
                parent,
                pattern: options.data.pattern,
                repository: options.data.repository,
                status: [...options.data.status],
                type: options.data.type,
                captureIndicesOffset: options.data.captureIndicesOffset
            },
            services: {
                languages
            },
            token: {
                document,
                position: {
                    start: new TextPosition(parent?.options.token.document.position.line || 0, (parent?.options.token.document.position.char || 0) + (options.data.captureIndicesOffset || 0))
                },
                scopes: [...parent?.options.token.scopes || [], ...options.token.scopes].filter((v) => v?.length) as string[]
            }
        }
        this.console = new TextDocumentLogger(this)
        this.console.child(this)
        this.options.token.document.nodes.push(this)
        this.options.token.document.hierarchyNodes.push(this)
        this.options.token.document.node = this
    }

    /**
     * Creates a child node and replaces this one in the document and returns it
     * @param options the options
     * @returns the child
     */
    public child = (options: BaseTextDocumentNodeOptions): TextDocumentNode => {
        const child = new TextDocumentNode({
            data: {
                endIndex: options.endIndex === undefined
                    ? this?.options.data.endIndex === undefined
                        ? undefined
                        : this?.options.data.endIndex
                    : options.endIndex,
                captures: options.captures,
                language: options.language,
                parent: this,
                pattern: options.pattern,
                repository: options.repository,
                status: [...options.status],
                type: options.type,
                captureIndicesOffset: options.captureIndicesOffset
            },
            services: this.options.services,
            token: {
                document: this.options.token.document,
                position: {
                    start: new TextPosition(this.options.token.document.position.line, this.options.token.document.position.char + (options.captureIndicesOffset || 0))
                },
                scopes: [...this.options.token.scopes, ...options.scopes].filter((v) => v?.length) as string[]
            }
        }, this, this.options.services.languages, this.options.token.document)
        return child
    }

    /**
     * Go back to the parent node
     */
    public parent = () => {
        if (this === this.semiroot) {
            return
        }
        this.options.token.position.end = new TextPosition(this.options.token.document.position.line, this.options.token.document.position.char)
        if (this.options.data.parent) {
            this.console.parent(`< ${this.options.data.parent.scope?.length ? this.options.data.parent.scope : this.options.data.parent.name || ''}`)
            this.options.token.document.node = this.options.data.parent
            return this.options.data.parent
        }
        return null
    }
}