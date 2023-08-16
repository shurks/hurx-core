import { Subject } from "rxjs"
import fs from 'fs'
import { TMLanguage } from "./models/tm-language"
import Logger from "../../utils/logger"
import Tokenizer from "./tokenizer"
import Documents from "./documents"

/**
 * The service for languages to be used for text mate processing
 */
export default class Languages {
    /**
     * The logger
     */
    private logger: Logger = new Logger()

    /**
     * All stored languages
     */
    public cache: Record<string, Documents> = {}

    public constructor() {}

    /**
     * All loading events
     */
    public events = {
        /**
         * Just after the loading ends
         */
        loaded: new Subject<TMLanguage>()
    }

    public find = (scopeName: string) => {
        for (const name of Object.keys(this.cache)) {
            const documents = this.cache[name]
            if (documents.tmLanguage.scopeName === scopeName) {
                return 
            }
        }
    }

    /**
     * Loads up a language
     * @param _path the path to the .tmLanguage file
     */
    public load = (_path: string) => {
        if (!fs.existsSync(_path)) {
            throw Error(`Language: with _path: "${_path}" does not exist.`)
        }

        // The raw data
        const data = fs.readFileSync(_path).toString('utf-8')

        // TODO: Convert from yaml to json

        // TODO: Convert from plist to json

        // TODO: Converrt from XML to json

        // Serialize the data to a grammar
        const serialized = JSON.parse(data) as TMLanguage

        // Validate that the grammar has a name and scope name
        if (!serialized.scopeName || !serialized.name) {
            if (!serialized.name) {
                throw this.logger.error(`Language has no name in the tmLanguage file.`)
            }
            else {
                throw this.logger.error(`Language "${serialized.name}" does not have a "scopeName" attribute in its root.`)
            }
        }

        // Add the language
        const documents = this.cache[serialized.name.toLowerCase()]
        if (documents) {
            this.logger.info(`Language "${serialized.name.toLowerCase()}" was already cached, but is will now be replaced replaced.`)
            documents.update(serialized)
        }
        else {
            this.cache[serialized.name] = new Documents(this, serialized)
            this.logger.trace(`Language: "${serialized.name.toLowerCase()}" has been loaded into the cache.`)
        }

        // Broadcast
        this.events.loaded.next(serialized)
    }
}