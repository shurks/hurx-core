/**
 * The keypress event of npm keypress
 */
export type KeypressEvent = {
    /**
     * The character that is pressed
     */
    char?: string

    /**
     * The key information
     */
    key?: {
        /**
         * The name of the key
         */
        name?: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' 
            | 'up'
            | 'down'
            | 'left'
            | 'right'
            | 'enter'
            | 'space'
            | 'tab'
            | 'backspace'
            | 'delete'
            | 'insert'
            | 'home'
            | 'end'
            | 'pageup'
            | 'pagedown'
            | 'escape'
            | 'return'
            | 'ctrl'
            | 'alt'
            | 'shift'
            | 'meta'
            | 'f1'
            | 'f2'
            | 'f3'
            | 'f4'
            | 'f5'
            | 'f6'
            | 'f7'
            | 'f8'
            | 'f9'
            | 'f10'
            | 'f11'
            | 'f12'
            | 'pause'
            | 'print'
            | 'scrollock'
            | 'capslock'

        /**
         * The full sequence of characters representing the key.
         */
        sequence?: string
        
        /**
         * Indicates if the Ctrl key is pressed.
         */
        ctrl?: boolean
        
        /**
         * Indicates if the Meta key (Windows key or Command key) is pressed.
         */
        meta?: boolean
        
        /**
         * Indicates if the Shift key is pressed.
         */
        shift?: boolean
        
        /**
         * Indicates if the Alt key is pressed.
         */
        alt?: boolean
        
        /**
         * The key code associated with the key.
         */
        code?: string
        
        /**
         * The raw sequence of characters without any key modifications.
         */
        raw?: string
        
        /**
         * Indicates if the keypress event is a repeat.
         */
        repeat?: boolean
    }

    /**
     * The callback for when the key or char matches the one in the keypress event
     */
    matched: () => Promise<void>
}