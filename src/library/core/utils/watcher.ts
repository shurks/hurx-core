import fs from 'fs'
import path from 'path'
import Emitter from './reactive/emitter'

/**
 * The hurx file watcher
 */
export default class Watcher {
    /**
     * The data
     */
    private data = {
        watches: {} as Record<string, fs.FSWatcher>,
        fileWatches: {} as Record<string, fs.StatWatcher>,
        files: {} as Record<string, number|null>
    }

    /**
     * When a file got removed
     */
    public removed = new Emitter<string>()

    /**
     * When a file got modified
     */
    public modified = new Emitter<string>()
    
    /**
     * When a file got created
     */
    public created = new Emitter<string>()

    /**
     * Watch a directory recursively
     */
    public watch(_path: string) {
        if (this.data.watches[_path]) {
            return
        }
        this.data.watches[_path] = fs.watch(_path, {
            recursive: true
        }, async (event, fileName) => {
            if (!fileName) {
                return
            }
            let action : 'removed' | 'created' | 'modified' | 'renamed' | 'none' = 'none'
            const filePath = path.join(_path, fileName)
            let mtimeMs: number|null = null

            // Attempt to read the modification timestamp of the file
            try {
                mtimeMs = fs.lstatSync(filePath).mtimeMs
            }
            catch (error) {
                mtimeMs = null
            }

            // Update the file in cache
            if (this.data.files[filePath] !== mtimeMs) {
                if (event === 'change') {
                    action = 'modified'
                    this.data.files[filePath] = mtimeMs
                }
                else if (event === 'rename') {
                    if (fs.existsSync(filePath)) {
                        action = 'created'
                        this.data.files[filePath] = mtimeMs
                    }
                    else {
                        action = 'removed'
                        this.data.files[filePath] = null
                    }
                }
                switch (action) {
                    case 'created': {
                        this.created.emit(filePath)
                        break
                    }
                    case 'modified': {
                        this.modified.emit(filePath)
                        break
                    }
                    case 'removed': {
                        this.removed.emit(filePath)
                        break
                    }
                }
            }
        })
    }

    /**
     * Watches a file
     * @param _file the file
     */
    public watchFile(_file: string) {
        if (this.data.fileWatches[_file]) {
            return
        }
        this.data.fileWatches[_file] = fs.watchFile(_file, {}, async (curr, prev) => {
            if (curr.mtimeMs !== prev.mtimeMs) {
                this.modified.emit(_file)
            }
        })
    }
}