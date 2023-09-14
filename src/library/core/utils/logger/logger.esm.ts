import Theme from "../theme/theme"
import { default as LoggerBase } from "./logger.base"

/**
 * The interface for logger services.
 * @author Stan Hurks
 */
export default class Logger extends LoggerBase {
    /**
     * Get the current theme colors
     */
    public get colors() {
        return Theme.current.colors
    }

    /**
     * The process.argv arguments used for this logger
     */
    public get argv(): string[] {
        return window.location.search.split(/\?|\&/).filter(Boolean).map((v) => `--${v}`)
    }
}