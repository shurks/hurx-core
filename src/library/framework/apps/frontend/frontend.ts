import { Server, createServer } from "http"
import Hurx from "../../hurx"
import { readFileSync } from "fs"
import { execSync } from "child_process"
import path from "path"

/**
 * Represents a frontend hurx application
 */
export default class Frontend {
    /**
     * The front-end server
     */
    public server: Server

    constructor(public port: number) {
        // TODO: remove keep-names in production
        execSync('npx esbuild ./src/frontend/index.tsx --keep-names --bundle --outfile=dist/bundle.min.js --target=es6 --external:"jsdom"', {
            cwd: process.cwd()
        })
        const bundleJS = readFileSync(path.join(process.cwd(), 'dist', 'bundle.min.js')).toString('utf8')
        this.server = createServer((req, res) => {
            if (req.url === '/bundle.min.js') {
                res.writeHead(200, {
                    'Content-Type': 'text/javascript'
                })
                res.end(bundleJS)
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                })
                res.end(`
                    <!doctype HTML>
                    <html>
                        <body>
                            <script src="bundle.min.js" type="module" defer></script>
                            <div id="main">
                            </div>
                        </body>
                    </html>
                `)
            }
        })
        this.server.listen(port, 'localhost', () => {
            Hurx.logger.info(`Server is running on http://localhost:${port}`)
        })
    }
}