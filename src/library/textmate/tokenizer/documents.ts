import { Subject } from "rxjs"
import Logger from "../../utils/logger"
import TextDocument from "./text-processing/text-document"
import { accessSync, readFileSync } from "fs"
import { TMLanguage } from "./models/tm-language"
import Languages from "./languages"

/**
 * Keeps track of all documents in a language
 */
export default class Documents {
    /**
     * The logger
     */
    private readonly logger: Logger = new Logger()

    /**
     * All stored documents
     */
    public cache: TextDocument[] = []

    /**
     * All loading events
     */
    public events = {
        /**
         * The document has been loaded
         */
        loaded: new Subject<TextDocument>()
    }

    constructor(private readonly languages: Languages, public tmLanguage: TMLanguage) {}

    /**
     * Updates all the documents with a new tm language file
     * @param tmLanguage the tm language file
     */
    public update = (tmLanguage: TMLanguage) => {
        this.tmLanguage = tmLanguage
        for (const document of this.cache) {
            document.initialize(document.content, tmLanguage)
        }
    }

    /**
     * Loads a document
     * @param _path the path 
     * @param languageName the name of the language
     */
    public load = (_path: string, languageName: string): TextDocument => {
        let language = this.languages.cache[languageName]
        if (!language) {
            throw Error(`Language: "${languageName}" is not registered with the tokenizer.`)
        }
        
        let content = ''
        try {
            accessSync(_path)
            content = readFileSync(_path, 'utf8')
        }
        catch (err) {
            this.logger.error(`${err}\nCould not read/access file: "${_path}"`)
            throw err
        }
        
        let document = language.cache.find((d) => d.path === _path)
        if (document) {
            this.logger.trace(`Document "${_path}" was found in cache and will be replaced.`)
            document.initialize(content, language.tmLanguage)
        }
        else {
            this.logger.trace(`Document "${_path}" was found in cache and will be replaced.`)
            document = new TextDocument(content, language.tmLanguage, _path, this.languages)
        }

        return document
    }
}