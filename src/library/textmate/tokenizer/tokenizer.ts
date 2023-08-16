import Logger from "../../utils/logger"
import Languages from "./languages"
import TextDocument from "./text-processing/text-document"

/**
 * The text mate tokenizer base manager
 * @author Stan Hurks
 */
export default class Tokenizer<LanguageNames extends string = never> {
    /**
     * The manager of all text mate languages
     */
    private readonly languages: Languages

    /**
     * The logger
     */
    private readonly logger: Logger = new Logger()

    constructor() {
        this.languages = new Languages()
    }

    /**
     * Loads a language
     * @param name the name
     * @param path the path
     * @returns 
     */
    public language<LanguageName extends string>(name: Exclude<LanguageName, LanguageNames>, path: string): Tokenizer<LanguageNames | LanguageName> {
        if (path) {
            this.languages.load(path)
        }
        return this
    }

    /**
     * Loads a document
     * @param name the name of the language
     * @param path the path to the document
     * @returns 
     */
    public document(languageName: LanguageNames, path: string): TextDocument {
        const documents = this.languages.cache[languageName]
        if (!documents) {
            throw Error(`Language with name "${languageName}" could not be found.`)
        }
        else {
            try {
                return documents.load(path, languageName)
            }
            catch (error: any) {
                throw this.logger.error(error || '')
            }
        }
    }
}