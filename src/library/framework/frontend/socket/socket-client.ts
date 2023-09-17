import JSON from "../../../core/utils/json"
import VDOM from "../vdom/vdom"
import VNode from "../vdom/vnode"

/**
 * The front-end socket
 */
export default class SocketClient {
    /**
     * The web socket instance
     */
    public static socket: WebSocket|null = null

    /**
     * Initialize the socket client
     */
    public static initialize() {
        if (!(VDOM.window as any).socket) {
            this.socket = new WebSocket('ws://localhost:3000')
            this.socket.addEventListener('open', (event) => {
                console.log('Connected to web socket')
            })
            this.socket.addEventListener('message', (event) => {
                setTimeout(() => {
                    if (event.data === 'reload-script') {
                        document.querySelector('body >script[src^="bundle.min.js"]')?.remove()
                        const script = document.createElement('script')
                        script.src = `bundle.min.js`
                        script.type = 'text/javascript'
                        script.defer = true
                        document.body.append(script)
                    }
                    else if (event.data === 'reload-style') {
                        for (let i = 0; i < VDOM.document.head.childNodes.length; i ++) {
                            const node = VDOM.document.head.childNodes.item(i) as Element
                            if (node.tagName === 'link' && !node.classList.contains('font')) {
                                node.remove()
                            }
                        }
                        const link = document.createElement('link')
                        link.href = `bundle.min.css`
                        link.rel = 'stylesheet'
                        link.type = 'text/css'
                        VDOM.document.head.appendChild(link)
                    }
                })
            })
            this.socket.addEventListener('close', (event) => {
                console.log('Disconnected from web socket')
            });
            (VDOM.window as any).socket = this.socket
        }
    }

    /**
     * Sends a node to the server
     * @param vnode the vnode
     */
    public static sendNode(vnode: VNode) {
        if (!this.socket) {
            this.initialize()
        }
        this.socket!.send(JSON.serialize(vnode))
    }

    /**
     * Sends a VDOM to the server
     * @param vdom the vdom
     */
    public static sendDOM(vdom: VDOM) {
        if (!this.socket) {
            this.initialize()
        }
        this.socket!.send(JSON.serialize(vdom))
    }
}