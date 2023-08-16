import Regex from "../../utils/regex"
import { Pattern } from "./pattern"
import fs from 'fs'
import path from "path"
import { TMLanguage } from "../tokenizer/models/tm-language"
import { TMRepository } from "../tokenizer/models/tm-repository"
import { TMPattern } from "../tokenizer/models/tm-pattern"

/**
 * The root for the language file of a text-mate language.
 * 
 * @type RN repository names union
 * @type PN pattern names union
 * @type SpecifiedRepositoryNames the repository names that have been specified
 * @author Stan Hurks
 */
export default class TMLanguageBuilder<RN extends string = never, PN extends string = never, EmbeddedLanguages extends string = never, SpecifiedRepositoryNames extends string = never> {
    /**
     * The JSON schema for `.tmLanguage.json` files
     */
    public readonly $schema = 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json'

    /**
     * Convert this language model into the tmLanguage language format
     */
    public get tmLanguageLanguage() {
        return JSON.parse(
            JSON.stringify({
                $schema: this.$schema,
                name: this.name,
                scopeName: `source.${this.name}`,
                patterns: this.patterns,
                repository: this.repositories
            })
        ) as TMLanguage
    }

    /**
     * The repositories in the root of the grammar
     */
    private readonly repositories: Record<RN, TMRepository> = {} as any

    /**
     * The root patterns
     */
    private readonly patterns: Array<TMPattern> = []

    /**
     * Builds the grammar instance and adds `patterns` to the root of your tm grammar file
     * @param name the name
     * @param patterns the patterns or repository's to include with the prefix #
     * @type RN a union of the repository names
     * @type PN a union of the pattern names
     * @type EmbeddedLangauges a union of the embedded languages in your grammar file
     * @returns the instance
     */
    public static root<RN extends string, PN extends string, EmbeddedLanguages extends string = never>(name: string, ...patterns: Array<Pattern<RN, PN, EmbeddedLanguages> | `#${RN}`>): Pick<TMLanguageBuilder<RN, PN, EmbeddedLanguages>, 'repository'> {
        if (/[^a-zA-Z-]/g.test(name)) {
            throw Error('A text mate grammar name may not contain anything but letters and dashes.')
        }
        if (name.indexOf('-') === 0) {
            throw Error('A text mate grammar name may not start with a dash.')
        }
        return new TMLanguageBuilder<RN, PN, EmbeddedLanguages>(name, ...patterns)
    }

    /**
     * Construct the grammar instance
     * @param name the name
     * @param patterns the patterns
     */
    private constructor(private readonly name: string, ...patterns: Array<Pattern<RN, PN, EmbeddedLanguages> | `#${RN}`>) {
        patterns.forEach((pattern) => {
            if (typeof pattern === 'string') {
                this.patterns.push({
                    include: pattern
                })
            }
        })
    }

    /**
     * Initializes a repository and sets the context for `this.pattern` to the last
     * repository initialized with this function.
     * @param name the name of the repository
     * @param patterns the patterns to add to the repository
     * @returns the builder
     */
    public repository<Name extends RN>(name: Exclude<Name, SpecifiedRepositoryNames>, ...patterns: Array<`#${RN}` | (EmbeddedLanguages extends never ? never : `source.${EmbeddedLanguages}`) | Pattern<RN, PN, EmbeddedLanguages>>): TMLanguageBuilder<RN, PN, EmbeddedLanguages, SpecifiedRepositoryNames|Name> {
        this.repositories[name] = {
            // Process the patterns into the textmate object format
            patterns: (patterns as Array<PN | `#${RN}` | (EmbeddedLanguages extends never ? never : `source.${EmbeddedLanguages}`) | Pattern<RN, PN, EmbeddedLanguages>>).map(function map(patternOrRepository) {

                // Add repositories as includes
                if (typeof patternOrRepository === 'string') {

                    // Include a repository
                    if (patternOrRepository.startsWith('#')) {
                        return {
                            include: patternOrRepository
                        } as TMPattern
                    }

                    // Include an embedded language
                    else if (/^source\.([a-zA-Z0-9])+(\-|[a-zA-Z0-9])*$/g.test(patternOrRepository)) {
                        return {
                            include: patternOrRepository
                        } as TMPattern
                    }

                    // Add a pattern with only a name
                    else {
                        return {
                            name: patternOrRepository
                        } as TMPattern
                    }
                }

                // Include embedded language from name property
                else if (patternOrRepository.name && /^source\.([a-zA-Z0-9])+(\-|[a-zA-Z0-9])*$/g.test(patternOrRepository.name)) {
                    return {
                        include: patternOrRepository.name
                    } as TMPattern
                }

                // Initialize the pattern
                const pattern = patternOrRepository as Pattern<RN, PN, EmbeddedLanguages>
                let convertedPattern: TMPattern = {}

                // The pattern name / scope
                convertedPattern.name = pattern.name

                // The content name
                convertedPattern.contentName = pattern.contentName

                // Apply end pattern last
                convertedPattern.applyEndPatternLast = pattern.applyEndPatternLast
                    ? 1
                    : (
                        patternOrRepository.applyEndPatternLast === false
                            ? 0
                            : undefined
                    )

                // Convert the match and capture properties into the textmate pattern object
                const matchTypes = (<T extends string>(...t: T[]) => t)('begin', 'end', 'while', 'match')
                const captureTypes = (<T extends string>(...t: T[]) => t)('beginCaptures', 'endCaptures', 'whileCaptures', 'captures')
                matchTypes.map<[typeof matchTypes[number], typeof captureTypes[number]]>((matchType, i) => [matchType, captureTypes[i]])
                    .forEach(([matchType, captureType]) => {
                        if (pattern[matchType]) {
                            convertedPattern[matchType] = Regex.utils.helpers.captureGroups(...pattern[matchType]!).source

                            if (pattern[captureType] && Object.keys(pattern[captureType]!).length) {
                                convertedPattern[captureType] = {}
                                const patternRegex = convertedPattern[matchType]!
                                let consecutiveEscapes = 0
                                let groupCount = 0
                                let namedGroupCount = 0
                                const namedGroupIndices = Object.keys(pattern[captureType]!).map((index) => Number(index))

                                for (let i = 0; i < patternRegex.length; i++) {
                                    const evenNumberOfEscapes = consecutiveEscapes % 2 === 0
                                    const isNamedGroup = evenNumberOfEscapes && patternRegex.substring(i, i + 3) === '(?<'
                                    consecutiveEscapes = patternRegex[i] === '\\' ? consecutiveEscapes + 1 : 0

                                    if (evenNumberOfEscapes && patternRegex[i] === '(') {
                                        // Skip zero-length assertions, because textmate doesn't count those as groups
                                        if (
                                            // Lookbehind
                                            ['?<!', '?<=',].includes(patternRegex.substring(i + 1, i + 4))
                                            // Lookahead
                                            || ['?!', '?=',].includes(patternRegex.substring(i + 1, i + 3))
                                        ) {
                                            continue
                                        }

                                        // Increase group count
                                        groupCount++

                                        if (isNamedGroup) {

                                            // Insert the named group count
                                            namedGroupCount++

                                            // Map the capture group pattern into the converted patterns captures type
                                            if (namedGroupIndices.includes(namedGroupCount)) {
                                                convertedPattern[captureType]![String(groupCount)] = map(pattern[captureType]![namedGroupCount])
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })

                // Process the sub-patterns
                convertedPattern.patterns = pattern.children?.map(pattern => map(pattern))

                // Return the converted pattern
                return convertedPattern
            })
        }
        return this as any
    }

    /**
     * Build the grammar file
     * @param exportDirectoryPath the path to store the tm grammar file in, the file will be `${this.name}.tmLanguage.json`.
     */
    public build(exportDirectoryPath: string) {
        try {
            if (fs.existsSync(path.join(exportDirectoryPath, `${this.name}.tmLanguage.json`))) {
                fs.accessSync(path.join(exportDirectoryPath, `${this.name}.tmLanguage.json`))
            }
        }
        catch (err) {
            console.error('Not allowed to access the location of the filePath provided: ' + path.join(exportDirectoryPath, `${this.name}.tmLanguage.json`))
            throw err
        }
        try {
            fs.writeFileSync(
                path.join(exportDirectoryPath, `${this.name}.tmLanguage.json`),
                JSON.stringify(
                    {
                        $schema: this.$schema,
                        name: this.name,
                        scopeName: `source.${this.name}`,
                        patterns: this.patterns,
                        repository: this.repositories
                    },
                    null,
                    4
                )
            )
        }
        catch (err) {
            console.error('Not allowed to write to location: ' + path.join(exportDirectoryPath, `${this.name}.tmLanguage.json`))
            throw err
        }
    }
}