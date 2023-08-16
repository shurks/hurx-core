import TextPosition from "./text-position"

/**
 * A range of text
 */
export default class TextRange {
    constructor(public start: TextPosition, public end: TextPosition) {}

    /**
     * Check whether another range or position is included within this range
     * @param rangeOrPosition the range or position 
     */
    public includes(rangeOrPosition: TextRange|TextPosition): boolean {
        const range = rangeOrPosition instanceof TextRange
            ? rangeOrPosition
            : new TextRange(
                rangeOrPosition,
                rangeOrPosition
            )
        const includesPosition = (position: TextPosition) => {
            if (position.line >= this.start.line && position.line <= this.end.line) {
                if (position.line > this.start.line) {
                    if (position.line === this.end.line) {
                        return position.char <= this.end.char
                    }
                    return true
                }
                if (this.end.line - this.start.line > 0) {
                    return position.char >= this.start.line
                }
                return position.char >= this.start.char && position.char <= this.end.char
            }
            return false
        }
        return includesPosition(range.start) && includesPosition(range.end)
    }
}