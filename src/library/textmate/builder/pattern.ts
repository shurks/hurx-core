import Regex from "../../utils/regex"

/**
 * A pattern in a text mate language grammar file
 * @type RN repository names union
 * @type PN pattern names union
 * @type EmbeddedLanguageRootScopes the languages embedded into this grammar file
 * @author Stan Hurks
 */
export class Pattern<RN extends string = string, PN extends string = string, EmbeddedLanguageRootScopes extends string = never> {
    /**
     * The pattern name, which will be used to identify the tokens of your language.
     * Tip: Look at other programming languages and declare your PatternNames type
     * by going to vscode and using the `Developer: Inspect Editor Tokens And Scopes`
     * to see what the scopes are of the language tokens in other languages.
     * 
     * An embedded language can also be specified as a name for the pattern,
     * by using the "source.[languageIdentifier]" notation.
     * E.g.: "source.hurx"
     */
    public name?: Exclude<PN | `$self` | EmbeddedLanguageRootScopes, never>

    /**
     * Similar to the `this.name` property, however it will only assign the pattern
     * name to everything matched between the begin and end/while property matches.
     */
    public contentName?: Exclude<PN | EmbeddedLanguageRootScopes, never>

    /**
     * Matches used to capture the current pattern.
     * With the begin technique the pattern will be used whenever the `begin` property matches the value of the languages token,
     * until the `end` property matches it, or while the `while` property matches it. Note that you will have to specify
     * the `end` or `while` property as well if you want your grammar to work properly.
     */
    public begin?: Array<RegExp | Regex<any, any>>

    /**
     * Map each count (index + 1) of the sub-regexes within the array used in `this.begin` by a pattern name
     * or by a repository name with the prefix #, so it will include the repository's patterns to create the captures.
     * Alternatively, a pattern may be used as well. Finally, a language can be embedded by using `source.[languageIdentifier]`
     */
    public beginCaptures?: { [regexNamedGroupIndex: number]: PN | `#${RN}` | Pattern<RN, PN, EmbeddedLanguageRootScopes> }

    /**
     * Matches used to capture the current pattern.
     */
    public match?: Array<RegExp | Regex<any, any>>

    /**
     * Map each count (index + 1) of the sub-regexes within the array used in `this.match` by a pattern name
     * or by a repository name with the prefix #, so it will include the repository's patterns to create the captures.
     * Alternatively, a pattern may be used as well. Finally, a language can be embedded by using `source.[languageIdentifier]`
     */
    public captures?: { [regexNamedGroupIndex: number]: PN | `#${RN}` | Pattern<RN, PN, EmbeddedLanguageRootScopes> }

    /**
     * Matches used to capture the current pattern.
     * See `this.begin`
     */
    public end?: Array<RegExp | Regex<any, any>>

    /**
     * Map each count (index + 1) of the sub-regexes within the array used in `this.end` by a pattern name
     * or by a repository name with the prefix #, so it will include the repository's patterns to create the captures.
     * Alternatively, a pattern may be used as well. Finally, a language can be embedded by using `source.[languageIdentifier]`
     */
    public endCaptures?: { [regexNamedGroupIndex: number]: PN | `#${RN}` | Pattern<RN, PN, EmbeddedLanguageRootScopes> }

    /**
     * Matches used to capture the current pattern.
     * `this.begin` is the pattern that starts the matching and `this.while` continues it.
     */
    public while?: Array<RegExp | Regex<any, any>>

    /**
     * Map each count (index + 1) of the sub-regexes within the array used in `this.while` by a pattern name
     * or by a repository name with the prefix #, so it will include the repository's patterns to create the captures.
     * Alternatively, a pattern may be used as well. Finally, a language can be embedded by using `source.[languageIdentifier]`
     */
    public whileCaptures?: { [regexNamedGroupIndex: number]: PN | `#${RN}` | Pattern<RN, PN, EmbeddedLanguageRootScopes> }

    /**
     * The array of patterns defined within this pattern and will be called when
     * the expressions in `this.begin` have matched the current language token.
     * This may also be used to include repositories with the prefix # to match
     * against its patterns.
     */
    public children?: Array<`#${RN}` | (EmbeddedLanguageRootScopes extends never ? never : `source.${EmbeddedLanguageRootScopes}`) | Pattern<RN, PN, EmbeddedLanguageRootScopes>>

    /**
     * If the `this.patterns` matches the `this.end` won't match, if it is not set to true then the end pattern takes presedence
     */
    public applyEndPatternLast?: boolean

    /**
     * Disables the pattern
     */
    public disabled?: boolean
}