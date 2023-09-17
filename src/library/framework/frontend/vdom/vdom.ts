import { ArrayOrNonArray } from '../../../core/types/types'
import JSON from '../../../core/utils/json'
import Logger from '../../../core/utils/logger/logger.esm'
import Component from '../components/component/component'
import SocketClient from '../socket/socket-client'
import VNode from './vnode'

/**
 * The virtual DOM utility class, if using with node.js create global.window of type JSDOM.window.
 */
export default class VDOM {
    /**
     * The counter for ID's
     */
    public static counter: number = 0

    /**
     * The window (either a JSDOM instance in case of Node.JS otherwise the browsers window object)
     */
    public static window = typeof global === 'undefined' ? window : global.window
    
    /**
     * The document in the window
     */
    public static document = this.window.document

    private static get logger() {
        return new Logger()
    }
    private get logger() {
        return VDOM.logger
    }

    /**
     * The VDOM type
     */
    public readonly VDOM = VDOM

    /**
     * The VDOM id
     */
    public id: number = ++VDOM.counter

    /**
     * The main element to mount the VDOM in.
     */
    public main: Element

    /**
     * Mounts the VDOM and adds an instance to the VDOM.instances array
     * @param id the id of the element to mount the VDOM in. (should be unique)
     * @param root the JSX to insert at the root
     */
    constructor(id: string, public root: VNode) {
        const main = document.querySelector(`#${id}`)
        if (!main) {
            throw new Error(`No element with id "${id}" could be found.`)
        }
        root.rootElement = main
        this.main = main
        this.initialize()
    }

    /**
     * Finds a Node by ID
     * @param id the ID
     */
    public findById(id: number): VNode|null {
        const findById = (vnode: VNode): VNode|null => {
            if (vnode.id === id && !vnode.destroyed) {
                return vnode
            }
            if (vnode.component) {
                if (vnode.renderNode) {
                    for (const child of vnode.renderNode.children) {
                        const result = findById(child)
                        if (result) {
                            return result
                        }
                    }
                }
                else if (vnode.renderNode === undefined) {
                    this.logger.verbose({vnode})
                    throw new Error(`VNode was never rendered`)
                }
            }
            for (const child of vnode.children) {
                const result = findById(child)
                if (result) {
                    return result
                }
            }
            return null
        }
        return findById(this.root)
    }

    /**
     * Updates all nodes that should be updated by re-mounting them.
     * To prevent errors, you must use the `this.markNodesToBeUpdated` function first.
     * @param previous the previous node
     * @param current the current node
     * @param previousDOM the previous VDOM
     * @param currentDOM the current VDOM
     * @param updatedParents the parents that are already updated
     * @returns true on success
     */
    private updateNodes = (previous: VNode, current: VNode, previousDOM: VDOM, currentDOM: VDOM): boolean => {
        // Validate
        if (!previous.rootElement) {
            throw new Error(`Previous has no root element`)
        }

        // Traverse through the nodes to be updated
        if (!previous.shouldUpdate || !current.shouldUpdate) {
            let success = true
            if (previous.component && current.component) {
                if (previous.renderNode && current.renderNode) {
                    for (let i = previous.renderNode.children.length - 1; i >= 0; i --) {
                        if (!this.updateNodes(previous.renderNode.children[i], current.renderNode.children[i], previousDOM, currentDOM)) {
                            success = false
                        }
                    }
                }
            }
            else if (!previous.text && !current.text) {
                if (previous.children.length == current.children.length && previous.children.length) {
                    for (let i = previous.children.length - 1; i >= 0; i --) {
                        if (!this.updateNodes(previous.children[i], current.children[i], previousDOM, currentDOM)) {
                            success = false
                        }
                    }
                }
            }
            return success
        }

        // Update the entire DOM
        if (previous === previousDOM.root) {
            this.logger.trace(`Updating entire DOM`)
            currentDOM.initializeDOM()

            // Replaces previous with current
            previousDOM.root = currentDOM.root
            return true
        }

        // Remove the old nodes
        const indices = previous.getRootElementIndices()
        console.log({indices, previous, query: (previous.renderNodeParent || previous.parent ? Math.max((previous.renderNodeParent ? previous.renderNodeParent : previous.parent)!.children.map((v, i, a) => i >= a.indexOf(previous) ? 0 : v.getElements().length).reduce((x, y) => x + y, 0), indices[0]) : null)})

        // Replace the previous node with the current node
        previous.replace(current)
        return true
    }

    /**
     * Marks all nodes to be updated or not.
     * @param previous the previous node
     * @param current the current node
     * @returns true if everything has changed inside
     */
    private markNodesToBeUpdated(previous: VNode, current: VNode, previousVDOM: VDOM, currentVDOM: VDOM): boolean {
        // Structural changes
        if (
            !!current.isFragment !== !!previous.isFragment
            || !!current.text !== !!previous.text
            || !!current.element !== !!previous.element
            || !!current.component !== !!previous.component
            || current.children.length !== previous.children.length
            || (current.component && previous.component && (
                !!previous.renderNode !== !!current.renderNode
                || previous.renderNode?.children.length !== current.renderNode?.children.length
            ))
        ) {
            previous.shouldUpdate = true
            current.shouldUpdate = true
            return true
        }
        else {
            if (current.component) {
                if (current.renderNode && previous.renderNode) {
                    let shouldUpdate = true
                    previous.shouldUpdate = true
                    current.shouldUpdate = true
                    for (let i = 0; i < current.renderNode.children.length; i ++) {
                        if (!this.markNodesToBeUpdated(previous.renderNode.children[i], current.renderNode.children[i], previousVDOM, currentVDOM)) {
                            shouldUpdate = false
                            previous.shouldUpdate = false
                            current.shouldUpdate = false
                        }
                    }
                    return shouldUpdate
                }
                else if (current.renderNode === undefined || previous.renderNode === undefined) {
                    this.logger.verbose({current, previous})
                    throw new Error(`Current or previous was never rendered`)
                }
                else {
                    previous.shouldUpdate = true
                    current.shouldUpdate = true
                    return true
                }
            }
            else if (current.isFragment) {
                this.logger.verbose('fragment')
                let shouldUpdate = true
                previous.shouldUpdate = true
                current.shouldUpdate = true
                for (let i = 0; i < current.children.length; i ++) {
                    if (!this.markNodesToBeUpdated(previous.children[i], current.children[i], previousVDOM, currentVDOM)) {
                        shouldUpdate = false
                        previous.shouldUpdate = false
                        current.shouldUpdate = false
                    }
                }
                return shouldUpdate
            }
            else if (current.element) {
                this.logger.verbose('element')
                if (previous.rootElement) {
                    previous.shouldUpdate = true
                    current.shouldUpdate = true
                    const values = {
                        current: current.element instanceof Text
                            ? current.element.textContent
                            : current.element.outerHTML,
                        previous: previous.element instanceof Text
                            ? previous.element.textContent
                            : previous.element!.outerHTML
                    }
                    if (values.current === values.previous) {
                        previous.shouldUpdate = false
                        current.shouldUpdate = false
                        return false
                    }
                    let shouldUpdate = true
                    if (current.element instanceof Element) {
                        for (let i = 0; i < current.children.length; i ++) {
                            if (!this.markNodesToBeUpdated(previous.children[i], current.children[i], previousVDOM, currentVDOM)) {
                                shouldUpdate = false
                                previous.shouldUpdate = false
                                current.shouldUpdate = false
                            }
                        }
                    }
                    return shouldUpdate
                }
                else {
                    this.logger.verbose({previous, current})
                    throw new Error(`Previous has no root element`)
                }
            }
            else {
                this.logger.verbose({invalid: current})
                throw new Error(`Invalid VNode`)
            }
        }
    }

    /**
     * Intializes the VDOM and mounts it into the main element
     * @param main the main element
     * @param root the root vnode
     */
    private initialize() {
        ((VDOM.window as any).VDOMS) = ((VDOM.window as any).VDOMS) || [] as VDOM[]
        const vdoms: VDOM[] = (VDOM.window as any).VDOMS
        const previous = vdoms.find((v) => v.main === this.main)
        const current = this
        current.root.rootElement = current.main
        
        // Update the VDOM
        if (previous) {
            // TODO: fix this!!
            // current.root = previous.root
            this.initializeDOM();
            // current.root.vdom = this
            // this.logger.verbose(`Updating DOM based on Hot Reload`)
            // current.root.createElements(previous.root)
            // const div = VDOM.document.createElement('div')
            // current.root.mount(div)
            // this.markNodesToBeUpdated(previous.root, current.root, previous, current)
            // if (!this.updateNodes(previous.root, current.root, previous, current)) {
            //     this.logger.verbose({previous, current})
            //     throw new Error(`Could not update nodes, updating DOM failed.`)
            // }
            // previous.root.setRootElement(previous.main)
            // current.root.setRootElement(previous.main)
            // current.root = previous.root;
            ((VDOM.window as any).VDOMS) = vdoms.map((v) => v.main === this.main ? this : v)
        }
        
        // Create the first VDOM
        else {
            current.root.vdom = this
            this.logger.verbose(`Initializing DOM`)
            this.initializeDOM()
            vdoms.push(this)
        }
    }

    /**
     * Initializes the content of the main element with the new content
     */
    private initializeDOM() {
        // Remove all nodes in the main div
        this.main.innerHTML = ''

        // Create and mount the VDOM
        this.root.createElements()
        this.root.mount(this.main)
    }

    /**
     * Creates a vnode from deepest nesting until the root of the VDOM (when a JSX element has been created)
     * @param tag the name of the tag, or a `Component` prototype
     * @param attributes the attributes of the JSX element
     * @param children the children that were created with this function before going to this parent node.
     */
    public static createNode (tag: string|(new(...args: ConstructorParameters<typeof Component>) => Component), attributes: VNode['attributes'] | null | undefined, ...children: ArrayOrNonArray<VNode|Text>[]): VNode {
        SocketClient.initialize()
        const processedChildren: VNode[] = [];
        (children || []).forEach(function processChild(child: ArrayOrNonArray<VNode|Text>) {
            if (Array.isArray(child)) {
                for (const c of child) {
                    processChild(c)
                }
            }
            else {
                if (child instanceof VNode) {
                    processedChildren.push(child)
                }
                else {
                    const vnode = new VNode({
                        text: child instanceof Text ? child : typeof child === 'object'
                            ? document.createElement('span')
                            : document.createTextNode(
                                typeof child === 'string'
                                    ? child
                                    : String(child)
                            ),
                        attributes: {},
                        children: []
                    })
                    if (vnode.text instanceof HTMLElement) {
                        vnode.text.innerHTML = JSON.serialize(child).replace(/\r\n|\r|\n/g, '<br/>').replace(/\s/g, '&nbsp;')
                    }
                    processedChildren.push(vnode)
                }
            }
        })
        this.logger.verbose({
            message: 'Create node called',
            tag,
            attributes,
            children,
            processedChildren
        })
        const vnode = new VNode({
            isFragment: typeof tag === 'string' ? false : tag.prototype instanceof Component ? false : true,
            tag: typeof tag === 'string' ? tag : void 0,
            component: typeof tag === 'string' ? void 0 : tag.prototype instanceof Component ? new tag({...attributes || {}, children: processedChildren}) : void 0,
            attributes: attributes || {},
            children: processedChildren
        })
        this.logger.verbose({
            message: 'new VNode',
            vnode
        })
        if (vnode.component) {
            (vnode.component as any).vnode = vnode
        }
        processedChildren.forEach((v) => {
            v.parent = vnode
        })
        return vnode
    }
}
