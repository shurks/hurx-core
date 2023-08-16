import { TMPattern } from "./tm-pattern"

/**
 * The original repository type in a text mate grammar file
 * @author Stan Hurks
 */
export type TMRepository = {
    /**
     * A comment as an introduction to the repository
     */
    comment?: string
    /**
     * All the patterns within this repository.
     */
    patterns: Array<TMPattern>
}