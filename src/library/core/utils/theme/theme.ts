/**
 * The theme
 */
export default class Theme {
    /**
     * The current theme
     */
    public static current: Theme = new Theme()

    /**
     * The colors
     */
    public colors = {
        selection: '#FF601C',
        primary: '#FF601C',
        secondary: '#0B75F2',
        light: '#FFFFFF',
        dark: '#333333',
        trace: '#1CFFA3',
        info: '#3DB9FE',
        debug: '#E7FF48',
        verbose: '#FF601C',
        warn: '#FED424',
        error: '#FF3F66',
        success: '#4BFE55'
    }
}