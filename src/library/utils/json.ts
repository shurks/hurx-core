/**
 * JSON utilities
 */
export default class JSON {
    // TODO: upgrade that circular works properly,
    // if a node has a .parent, dont remove the .children from the node
    /**
     * The replacer for the JSON.stringify function
     */
    public static get replacer() {
        const seen = new WeakSet()
        return (key: any, value: any) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return "circular"
                }
                seen.add(value)
            }
            // TODO: make this more detailed
            // TODO: styling
            if (typeof value === "function") {
                if (value.prototype && value.prototype.constructor === value) {
                    return `[class ${value.name}]`
                }
                else {
                    return `[function ${value.name}]`
                }
            }
            return value
        }
    }
    
    /**
     * Deserializes a json string into any object
     * @template T the type of object that is returned
     */
    public static get deserialize(): (<T>(...args: Parameters<typeof window['JSON']['parse']>) => T) {
        return typeof window === 'undefined'
            ? global.JSON.parse
            : window.JSON.parse
    }

    /**
     * Serializes any object into a json string
     */
    public static get serialize() {
        /**
         * Serializes any object into a json string
         * @param obj the object to serialize
         * @param indents the amount of indents per level of nesting at the start of each line
         * @param replacer a custom replacer, by default the Hurx replacer (JSON.replacer) is used
         */
        function serialize(obj: any, indents?: number, replacer?: any) {
            if (typeof window === 'undefined') {
                return global.JSON.stringify(obj, replacer || JSON.replacer, indents || 4)
            }
            else {
                return window.JSON.stringify(obj, replacer || JSON.replacer, indents || 4)
            }
        }
        return serialize
    }
}