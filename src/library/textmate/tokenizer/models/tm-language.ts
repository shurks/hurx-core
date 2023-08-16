import { TMPattern } from "./tm-pattern"
import { TMRepository } from "./tm-repository"

/**
 * The original text-mate language format, for documentation see `../hurx/language`
 */
export type TMLanguage = {
    /**
     * The JSON schema for `.tmLanguage.json` files
     */
    $schema: string,
    /**
     * The name
     */
    name: string,
    /**
     * A comment as an introduction to the language
     */
    comment: string,
    /**
     * The name of the root scope for this language
     */
    scopeName: string,
    /**
     * All the root patterns
     */
    patterns: Array<TMPattern>,
    /**
     * All repositories
     */
    repository: Record<string, TMRepository>

    /**
     * The file types for this language
     */
    fileTypes: string[]
}