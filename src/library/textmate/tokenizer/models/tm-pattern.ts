/**
 * The original pattern type in a text mate grammar file
 * @author Stan Hurks
 */
export type TMPattern = {
    include?: `#${string}`|'$self' | string
    name?: string
    contentName?: string
    begin?: string
    beginCaptures?: { [regexNamedGroupIndex: string]: Pick<TMPattern, 'name'|'patterns'> }
    match?: string
    captures?: { [regexNamedGroupIndex: string]: Pick<TMPattern, 'name'|'patterns'> }
    end?: string
    endCaptures?: { [regexNamedGroupIndex: string]: Pick<TMPattern, 'name'|'patterns'> }
    while?: string
    whileCaptures?: { [regexNamedGroupIndex: string]: Pick<TMPattern, 'name'|'patterns'> }
    patterns?: Array<TMPattern>
    applyEndPatternLast?: 0|1
}