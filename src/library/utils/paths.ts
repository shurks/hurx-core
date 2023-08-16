export default class Paths {
    /**
     * Adds a ./ to the start of a relative path
     * @param _path the path
     */
    public static relative(_path: string): string {
        _path = _path.replace(/(\\|\/)+/g, '/').replace(/^\/+/g, '')
        const valid = /^(?!.*\/\/)([\w.-]+\/?)*$/
        if (!valid.test(_path)) {
            throw Error(`hurx.json: path "${_path}" is not a valid relative path`)
        }
        return './' + _path.replace(/^\.(\\|\/)+/g, '')
    }

    /**
     * Converts any relative path to unix and removes the ./ at the start
     * @param _path the path
     */
    public static relativeWithoutDotSlash(_path: string): string {
        _path = _path.replace(/(\\|\/)+/g, '/').replace(/^\/+/g, '')
        const valid = /^(?!.*\/\/)([\w.-]+\/?)*$/
        if (!valid.test(_path)) {
            throw Error(`hurx.json: path "${_path}" is not a valid relative path`)
        }
        return _path.replace(/^\.(\\|\/)+/g, '').replace(/^\//g, '')
    }

    /**
     * Converts an absolute path to relative
     * @param base the to remove
     * @param _path the path
     * @returns the relative path
     */
    public static absoluteToRelative(base: string, _path: string): string {
        const validAbsolute = /^([a-zA-Z]:\\(?:[^\\]+\\)*[^\\]+)|(\/(?:[^\/]+\/)*[^\/]+)$/
        if (!validAbsolute.test(base)) {
            throw Error(`Value "base" must be absolute. (value: "${base}")`)
        }
        if (!validAbsolute.test(_path)) {
            throw Error(`Value "path" must be absolute. (value: "${_path}")`)
        }
        base = base.replace(/\\/g, '/')
        _path = _path.replace(/\\/g, '/')
        _path = _path.replace(base, '').replace(/(\\|\/)+/g, '/')
        const validRelative = /^(?!.*\/\/)([\w.-]+\/?)*$/
        if (!validRelative.test(_path)) {
            throw Error(`hurx.json: could not convert "${_path}" to relative by extracting the base: "${base}"`)
        }
        return `./` + _path
    }
}