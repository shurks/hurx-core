import TextDocument from "../text-document"
import TextDocumentToken from "./text-document-token"

/**
 * The information you get for processing a text document
 * with the tm language tokenizer.
 */
export default class TextDocumentInformation {    
    /**
     * @param document The associated text document
     */
    constructor(
        /**
         * The token information
         */
        public readonly tokens: {
            /**
             * The token starting from the root
             */
            root: TextDocumentToken
            /**
             * All the tokens
             */
            all: TextDocumentToken[]
        }
    ) {}
}