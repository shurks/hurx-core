import TextDocumentNode from "../text-document-node"
import TextPosition from "../text-position"
import TextRange from "../text-range"

/**
 * A token of the language
 */
export default class TextDocumentToken {
    /**
     * Read the text of the token
     */
    public get text(): string {
        if (!this.range) {
            return ''
        }
        let processed = ''
        for (let i = this.range.start.line; i <= this.range.end.line; i ++) {
            if (i === this.range.start.line) {
                if (i === this.range.end.line) {
                    processed = this.node.options.token.document.lines[i].substring(this.range.start.char, this.range.end.char)
                }
                else {
                    processed += this.node.options.token.document.lines[i].substring(this.range.start.char)
                }
            }
            else if (i === this.range.end.line) {
                processed += this.node.options.token.document.lines[i].substring(0, this.range.end.char)
            }
            processed += '\n'
        }
        return processed
    }

    /**
     * Gets the scopes, including
     */
    public scopes: string[] = this.node.options.token.scopes

    /**
     * The scope of this token
     */
    public scope: string | null = this.node.scope

    /**
     * The child tokens
     */
    public children: TextDocumentToken[] = []

    /**
     * The range of text positions for this token
     */
    public range: TextRange

    /**
     * Constructs a token
     * @param range The range of the token
     * @param document The document belonging to the file
     */
    constructor(private node: TextDocumentNode) {
        if (node.options.token.position.end) {
            this.range = new TextRange(
                node.options.token.position.start,
                node.options.token.position.end,
            )
        }
        else {
            this.range = new TextRange(
                node.options.token.position.start,
                new TextPosition(node.options.token.document.lines.length - 1, node.options.token.document.lines[node.options.token.document.lines.length - 1].length)
            )
        }
    }
}