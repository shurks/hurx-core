/**
 * Base options for a control
 */
export default interface ControlOptions {
    /**
     * The output stream
     */
    stdout?: NodeJS.WriteStream

    /**
     * The input stream
     */
    stdin?: NodeJS.ReadStream
}