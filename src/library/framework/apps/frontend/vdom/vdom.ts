import { ArrayOrNonArray } from '../../../../core/types/types'
import JSON from '../../../../core/utils/json'
import Logger from '../../../../core/utils/logger/logger.esm'
import Component from '../components/component/component'
import SocketClient from '../socket/socket-client'
import VNode from './vnode'

/**
 * The virtual DOM utility class
 */
export default class VDOM {
    /**
     * The counter for ID's
     */
    public static counter: number = 0

    /**
     * The window (either a JSDOM instance in case of Node.JS otherwise the browsers window object)
     */
    private static window = window || new (require('jsdom').JSDOM)().window
    
    /**
     * The document in the window
     */
    private static document = this.window.document

    private static get logger() {
        return new Logger()
    }
    private get logger() {
        return VDOM.logger
    }

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
        this.setVDOM()
    }

    /**
     * Updates all nodes that should be updated by re-mounting them.
     * To prevent errors, you must use the `this.markNodesToBeUpdated` function first.
     * @param previous the previous node
     * @param current the current node
     * @param previousDOM the previous VDOM
     * @param currentDOM the current VDOM
     * @returns true on success
     */
    private updateNodes = (previous: VNode, current: VNode, previousDOM: VDOM, currentDOM: VDOM): boolean => {
        // Validate
        if (!previous.rootElement) {
            throw new Error(`Previous has no root element`)
        }

        // Traverse through the nodes to be updated
        if (!previous.shouldUpdate && !current.shouldUpdate) {
            let success = true
            if (previous.component) {
                for (let i = previous.renderNode!.children.length - 1; i >= 0; i --) {
                    if (!this.updateNodes(previous.renderNode!.children[i], current.renderNode!.children[i], previousDOM, currentDOM)) {
                        success = false
                    }
                }
            }
            else if (!previous.text) {
                for (let i = previous.children.length - 1; i >= 0; i --) {
                    if (!this.updateNodes(previous.children[i], current.children[i], previousDOM, currentDOM)) {
                        success = false
                    }
                }
            }
            return success
        }

        // Update the entire DOM
        if (previous === previousDOM.root) {
            this.logger.trace(`Updating entire DOM`)
            currentDOM.replaceDOM(previousDOM)
            return true
        }

        // Remove the old nodes
        const indices = VDOM.getRootElementIndices(previous, previous)
        console.log({indices, previous})
        for (let i = indices[indices.length - 1]; i >= indices[0]; i --) {
            previous.rootElement.removeChild(previous.rootElement.childNodes[i])
        }

        // Re-initialize the previous node
        if (current.component) {
            previous.element = undefined
            previous.text = undefined
            previous.isFragment = false
            current.rootElement = previous.rootElement
            current.parent = previous.parent
            current.id = previous.id
            current.component.vnode = previous

            if (current.renderNode === null) {
                previous.renderNode = null
                this.logger.trace(`Updating component`, {
                    name: ((current.component as any).constructor.name),
                    current,
                    previous
                })
            }
            else {
                if (previous.component) {
                    if (String((previous.component as any).constructor) === String((current.component as any).constructor)) {
                        // Assign previous state to current
                        current.component.state = VDOM.deepAssign(current.component.state, previous.component.state)
                    }
                }
                previous.component = current.component
                current.renderNode = current.component.render()
                if (current.renderNode) {
                    VDOM.createElements(current.renderNode, previous.renderNode || null)
                    current.renderNode.renderNodeParent = previous
                    previous.renderNode = current.renderNode
                    this.logger.trace(`Updating component`, {
                        name: ((current.component as any).constructor.name),
                        current,
                        previous
                    })
                    VDOM.mountDOM(previous.renderNode, previous.rootElement, indices[0])
                }
                previous.component = current.component
            }
        }
        else if (current.isFragment) {
            current.element = undefined
            current.component = undefined
            current.renderNode = undefined
            current.rootElement = previous.rootElement
            current.parent = previous.parent
            current.isFragment = true
            current.id = previous.id
            this.logger.trace(`Updating fragment`, {
                current,
                previous
            })
            VDOM.mountDOM(current, previous.rootElement, previous.parent ? previous.parent.children.map((v, i, a) => i >= a.indexOf(previous) ? 0 : VDOM.getElements(v).length).reduce((x, y) => x + y, 0) : null)
            previous.parent!.children = previous.parent!.children.map((v) => v === previous ? current : v)
        }
        else if (current.text) {
            current.element = current.text
            current.component = undefined
            current.renderNode = undefined
            current.rootElement = previous.rootElement
            current.parent = previous.parent
            current.isFragment = false
            current.id = previous.id
            previous.parent!.children = previous.parent!.children.map((v) => v === previous ? current : v)
            this.logger.trace(`Updating text`, {
                current,
                previous
            })
            VDOM.mountDOM(current, previous.rootElement, indices[0])
        }
        else if (current.element) {
            current.component = undefined
            current.renderNode = undefined
            current.rootElement = previous.rootElement
            current.parent = previous.parent
            current.isFragment = true
            current.id = previous.id
            previous.parent!.children = previous.parent!.children.map((v) => v === previous ? current : v)
            if (previous.attributes && current.attributes !== previous.attributes) {
                previous.attributes = current.attributes
            }
            // Set the attributes
            if (current.element instanceof Element) {
                VDOM.setAttributes(current.attributes, current.element)
            }
            this.logger.trace(`Updating element`, {
                currentEl: current.element,
                previousEl: previous.element,
                current,
                previous
            })
            // Mount the element
            VDOM.mountDOM(current, previous.rootElement, indices[0])
        }
        current.shouldUpdate = false
        previous.shouldUpdate = false
        return true
    }

    /**
     * Marks all nodes to be updated or not.
     * @param previous the previous node
     * @param current the current node
     * @returns true if everything has changed inside
     */
    private markNodesToBeUpdated(previous: VNode, current: VNode, previousVDOM: VDOM, currentVDOM: VDOM): boolean {
        // Set the element
        if (current.text) {
            current.element = current.text
        }
        if (previous.text) {
            previous.element = previous.text
        }
        // Structural changes
        if (
            !!current.isFragment !== !!previous.isFragment
            || !!current.text !== !!previous.text
            || !!current.element !== !!previous.element
            || !!current.component !== !!previous.component
            || !!current.renderNode !== !!previous.renderNode
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
            else if (current.text) {
                this.logger.verbose('text')
                if (previous.rootElement) {
                    previous.shouldUpdate = true
                    current.shouldUpdate = true
                    const values = {
                        current: current.text instanceof Text
                            ? current.text.textContent
                            : current.text.outerHTML,
                        previous: previous.text instanceof Text
                            ? previous.text.textContent
                            : previous.text!.outerHTML
                    }
                    if (values.current === values.previous) {
                        previous.shouldUpdate = false
                        current.shouldUpdate = false
                        return false
                    }
                    return true
                }
                else {
                    this.logger.verbose({previous, current})
                    throw new Error(`Previous has no root element`)
                }
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
                        // Set the attributes, no further updating needed
                        if (current.attributes !== previous.attributes) {
                            previous.attributes = current.attributes
                            if (previous.element instanceof Element) {
                                VDOM.setAttributes(current.attributes, previous.element)
                            }
                        }
                        return false
                    }
                    let shouldUpdate = true
                    for (let i = 0; i < current.children.length; i ++) {
                        if (!this.markNodesToBeUpdated(previous.children[i], current.children[i], previousVDOM, currentVDOM)) {
                            shouldUpdate = false
                            previous.shouldUpdate = false
                            current.shouldUpdate = false
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
        return false
    }

    /**
     * Sets the VDOM and mounts it into the main element
     * @param main the main element
     * @param root the root vnode
     */
    private setVDOM() {
        ((VDOM.window as any).VDOMS) = ((VDOM.window as any).VDOMS) || [] as VDOM[]
        const vdoms: VDOM[] = (VDOM.window as any).VDOMS
        const previous = vdoms.find((v) => v.main === this.main)
        const current = this
        current.root.rootElement = current.main

        // Update the VDOM
        if (previous) {
            this.logger.verbose(`Updating DOM based on Hot Reload`)
            this.updateDOM(previous, current);
            // ((VDOM.window as any).VDOMS) = vdoms.map((v) => v.main === this.main ? this : v)
        }
        
        // Create the first VDOM
        else {
            this.logger.verbose(`Initializing DOM`)
            this.initializeDOM()
            vdoms.push(this)
        }
    }

    /**
     * Updates the DOM by comparing the current VDOM to the previous VDOM
     * @param previous the previous vdom
     * @param current the current vdom
     */
    private updateDOM(previous: VDOM, current: VDOM) {
        VDOM.createElements(current.root, previous.root)
        const div = VDOM.document.createElement('div')
        // VDOM.mountDOM(current.root, div)
        this.markNodesToBeUpdated(previous.root, current.root, previous, current)
        console.log(previous, current)
        if (!this.updateNodes(previous.root, current.root, previous, current)) {
            this.logger.verbose({previous, current})
            throw new Error(`Could not update nodes, updating DOM failed.`)
        }
    }

    /**
     * Replaces the content of the main element with the new content
     */
    private replaceDOM(previous: VDOM) {
        this.initializeDOM()

        // Replaces previous with current
        previous.root = this.root
    }

    /**
     * Initializes the content of the main element with the new content
     */
    private initializeDOM() {
        // Remove all nodes in the main div
        this.main.innerHTML = ''

        // Create and mount the VDOM
        VDOM.createElements(this.root, null)
        VDOM.mountDOM(this.root, this.main)
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
            vnode.component.vnode = vnode
        }
        processedChildren.forEach((v) => {
            v.parent = vnode
        })
        return vnode
    }

    /**
     * Deeply assigns objectB by objectA
     * @param objectA the object to assign to
     * @param objectB the object to assign with
     */
    private static deepAssign(objectA: {}, objectB: {}) {
        for (const key of Object.keys(objectB)) {
            if (typeof (objectA as any)[key] === 'object') {
                if (typeof (objectB as any)[key] === 'object') {
                    (objectA as any)[key] = this.deepAssign((objectA as any)[key], (objectB as any)[key])
                }
                else {
                    (objectA as any)[key] = (objectB as any)[key]
                }
            }
            else {
                (objectA as any)[key] = (objectB as any)[key]
            }
        }
        return objectA
    }

    /**
     * Get the elements of a vnode
     * @param vnode the vnode
     * @param elements the elements
     */
    private static getElements(vnode: VNode, elements: Array<Element|Text> = []): Array<Element|Text> {
        if (vnode.component) {
            if (vnode.renderNode) {
                this.getElements(vnode.renderNode, elements)
            }
            else if (vnode.renderNode === undefined) {
                this.logger.verbose({vnode, elements})
                throw new Error(`Vnode was never rendered`)
            }
        }
        else if (vnode.isFragment) {
            for (const child of vnode.children) {
                this.getElements(child, elements)
            }
        }
        else if (vnode.element) {
            elements.push(vnode.element)
        }
        return elements
    }

    /**
     * Creates the elements within a root VNode
     * @param vnode the root vnode
     */
    private static createElements(vnode: VNode, originalNode: VNode|null) {
        if (vnode.component && !vnode.renderNode) {
            type State = {
                constructor: string,
                state: {}
            };
            (this.window as any).states = (this.window as any).states || [];
            const states: State[] = (this.window as any).states
            const state = states.find((v) => v.constructor === String((vnode.component as any).constructor));
            const setState = () => {
                if (originalNode && originalNode.component) {
                    vnode.component!.state = {
                        ...this.deepAssign(vnode.component!.state, originalNode.component.state)
                    }
                }
            }
            if (!state) {
                ((this.window as any).states as State[]).push({
                    constructor: String((vnode.component as any).constructor),
                    state: this.deepAssign({}, vnode.component.state)
                })
                setState()
            }
            else if (JSON.serialize(state.state) !== JSON.serialize(vnode.component.state)) {
                state.state = vnode.component.state
            }
            else {
                setState()
            }
            vnode.renderNode = vnode.component?.render()
            if (vnode.renderNode) {
                vnode.renderNode.renderNodeParent = vnode
                this.createElements(vnode.renderNode, originalNode)
            }
        }
        else if (!vnode.component) {
            if (vnode.isFragment) {
                for (let i = 0; i < vnode.children.length; i ++) {
                    this.createElements(vnode.children[i], originalNode?.children[i] || null)
                }
            }
            else if (vnode.text) {
                vnode.element = vnode.text
            }
            else if (vnode.tag) {
                vnode.element = this.document.createElement(vnode.tag)
                this.setAttributes(vnode.attributes, vnode.element)
                for (let i = 0; i < vnode.children.length; i ++) {
                    this.createElements(vnode.children[i], originalNode?.children[i] || null)
                }
            }
            else {
                this.logger.verbose({vnode})
                throw new Error(`Unknown VNode syntax`)
            }
        }
        return null
    }

    /**
     * Finds the node index of element within the childNodes of rootElement
     * @param rootElement the root element containing the element
     * @param element the element
     * @returns the index or -1 if not found
     */
    private static getNodeIndex(rootElement: Element, element: Element|Text): number {
        // Get the child nodes of the element
        const children = rootElement.childNodes

        // Iterate through the child nodes
        for (let i = 0; i < children.length; i++) {
            const node = children[i]
            if (node === element) {
                return i
            }
        }

        // Return -1 if the node is not found within the element
        return -1
    }

    /**
     * Gets the element indices within any node
     * @param base 
     * @param current 
     */
    private static getRootElementIndices(base: VNode, current: VNode, indices: Array<number> = []): Array<number> {
        if (!base.rootElement) {
            this.logger.verbose({base, current, indices})
            throw new Error(`Base has no root element.`)
        }
        const containingElement = base.rootElement
        if (current.component) {
            if (current.renderNode === undefined) {
                this.logger.verbose({base, current, indices})
                throw new Error(`Base has component but it hasn't been rendered yet, so it's not in the DOM.`)
            }
            if (current.renderNode) {
                return this.getRootElementIndices(base, current.renderNode, indices)
            }
        }
        else if (current.isFragment) {
            for (const child of current.children) {
                this.getRootElementIndices(base, child, indices)
            }
        }
        else if (current.element) {
            indices.push(this.getNodeIndex(containingElement, current.element))
        }
        else {
            this.logger.verbose({base, current, indices})
            throw Error(`Invalid VNode.`)
        }
        return indices
    }

    /**
     * Updates the DOM based on a changed VDOM node that is a component 
     * @param vnode the vdom
     */
    public static rerenderComponent(vnode: VNode) {
        if (vnode.element && !vnode.parent?.rootElement) {
            this.logger.verbose({vnode})
            throw new Error(`VNode has element but no parent with root element.`)
        }
        if (!vnode.rootElement) {
            this.logger.verbose({vnode})
            throw new Error(`VNode has no root element.`)
        }
        if (vnode.component) {
            // Can't rerender an unrendered component
            if (!vnode.renderNode) {
                return
            }

            // Get the node indices
            const indices = this.getRootElementIndices(vnode, vnode)
            const min = indices[0]
            const max = indices[indices.length - 1]

            // Remove old nodes
            const element = vnode.rootElement
            for (let i = max; i >= min; i --) {
                element.removeChild(element.childNodes[i])
            }

            // Rerender
            vnode.renderNode = vnode.component?.render()
            if (vnode.renderNode) {
                vnode.renderNode.renderNodeParent = vnode

                // Create the newly rendered elements
                this.createElements(vnode.renderNode, null)
                
                // Get the elements of the renderNode
                const getElements = (vnode: VNode, elements: Array<Element | Text> = []): Array<Element | Text> => {
                    if (vnode.component) {
                        if (vnode.renderNode) {
                            getElements(vnode.renderNode, elements)
                        }
                        else if (vnode.renderNode === undefined) {
                            this.logger.verbose({vnode})
                            throw new Error(`VNode has a component, but no renderNode. Try calling \`this.createElements\` first.`)
                        }
                    }
                    else if (vnode.isFragment) {
                        for (const child of vnode.children) {
                            getElements(child, elements)
                        }
                    }
                    else if (vnode.element) {
                        elements.push(vnode.element)
                        if (!(vnode.element instanceof Text)) {
                            const fillElement = (element: Element, vnode: VNode) => {
                                if (vnode.component) {
                                    if (vnode.renderNode) {
                                        fillElement(element, vnode.renderNode)
                                    }
                                    else if (vnode.renderNode === undefined) {
                                        this.logger.verbose({vnode})
                                        throw new Error(`VNode of type component is not rendered`)
                                    }
                                }
                                else if (vnode.isFragment) {
                                    for (const child of vnode.children) {
                                        fillElement(element, child)
                                    }
                                }
                                else if (vnode.element) {
                                    if (vnode.element instanceof Text) {
                                        element.append(vnode.element)
                                    }
                                    else {
                                        element.append(vnode.element)
                                        for (const child of vnode.children) {
                                            fillElement(vnode.element, child)
                                        }
                                    }
                                }
                            }
                            for (const child of vnode.children) {
                                fillElement(vnode.element, child)
                            }
                        }
                        this.logger.verbose({el: vnode.element, children: vnode.children})
                    }
                    else {
                        this.logger.verbose({vnode})
                        throw new Error(`Invalid VNode.`)
                    }
                    return elements
                }
                const elements = getElements(vnode.renderNode)

                // Insert the elements
                for (let i = min; i < elements.length + min; i ++) {
                    element.insertBefore(elements[i - min], element.childNodes[i])
                }
            }
        }
        else {
            this.logger.verbose({vnode})
            throw new Error(`The rerenderComponent function is only for components.`)
        }
    }

    /**
     * Unmounts a VNode from the DOM
     * @param vnode the vnode
     */
    private static unmountDOM(vnode: VNode) {
        if (vnode.component) {
            if (vnode.renderNode) {
                this.unmountDOM(vnode.renderNode)
            }
            else if (vnode.renderNode === undefined) {
                this.logger.verbose({vnode})
                throw new Error(`VNode was never rendered.`)
            }
        }
        else if (vnode.isFragment) {
            vnode.children.forEach((c) => this.unmountDOM(c))
        }
        else if (vnode.element) {
            vnode.element.parentElement?.removeChild(vnode.element)
            vnode.element = null
        }
    }

    /**
     * Mounts the VDOM into the DOM after creating the elements
     * @param vnode the root vnode
     * @param appendTo the vnode to append everything to, must contain a Element
     * @param type the type of processing
     */
    private static mountDOM(vnode: VNode, appendTo: VNode|Element, index: null|number = null, insertions: {count: number} = {count: 0}) {
        const appendToElement = appendTo instanceof Element
            ? appendTo
            : appendTo.element || appendTo.rootElement
        if (!appendToElement) {
            throw new Error(`No element found to mount the DOM in.`)
        }
        if (!(appendToElement instanceof HTMLElement)) {
            throw new Error(`Append to element is not of type HTMLElement.`)
        }
        if (vnode.component) {
            if (vnode.renderNode) {
                this.mountDOM(vnode.renderNode, appendTo, index, insertions)
            }
            else if (vnode.renderNode === undefined) {
                this.logger.verbose({vnode, appendTo})
                throw new Error(`VNode was never rendered`)
            }
        }
        else if (vnode.isFragment) {
            for (const child of vnode.children) {
                this.mountDOM(child, appendTo, index, insertions)
            }
        }
        else if (vnode.element) {
            if (index !== null) {
                appendToElement.insertBefore(vnode.element, appendToElement.childNodes.item(index + insertions.count))
                insertions.count ++
            }
            else {
                appendToElement.appendChild(vnode.element)
            }
            if (!(vnode.element instanceof Text)) {
                for (const child of vnode.children) {
                    this.mountDOM(child, vnode.element)
                }
            }
        }
        else {
            this.logger.verbose({vnode, appendTo, index, insertions})
            throw new Error(`Invalid VNode object`)
        }
    }

    /**
     * Sets attributes to an element
     * @param attributes the attributes
     * @param element the element
     */
    private static setAttributes(attributes: VNode['attributes'], element: Element) {
        for (const name of Object.keys(attributes)) {
            const value = attributes[name]
            const eventHandlers = [
                'onAbort',
                'onAutoComplete',
                'onAutoCompleteError',
                'onBlur',
                'onCancel',
                'onCanPlay',
                'onCanPlayThrough',
                'onChange',
                'onClick',
                'onClose',
                'onContextMenu',
                'onCueChange',
                'onDBLCLick',
                'onDrag',
                'onDragEnd',
                'onDragEnter',
                'onDragLeave',
                'onDragOver',
                'onDragStart',
                'onDrop',
                'onDurationChange',
                'onEmptied',
                'onEnded',
                'onError',
                'onFocus',
                'onInput',
                'onInvalid',
                'onKeyDown',
                'onKeyPress',
                'onKeyUp',
                'onLoad',
                'onLoadedData',
                'onLoadedMetadata',
                'onLoadStart',
                'onMouseDown',
                'onMouseEnter',
                'onMouseLeave',
                'onMouseMove',
                'onMouseOut',
                'onMouseOver',
                'onMouseUp',
                'onMouseDown',
                'onMouseEnter',
                'onMouseLeave',
                'onMouseMove',
                'onMouseOut',
                'onMouseOver',
                'onMouseUp',
                'onMouseWheel',
                'onPause',
                'onPlay',
                'onPlaying',
                'onProgress',
                'onRateChange',
                'onReset',
                'onResize',
                'onScroll',
                'onSeeked',
                'onSeeking',
                'onSelect',
                'onShow',
                'onSort',
                'onStalled',
                'onSubmit',
                'onSuspend',
                'onTimeUpdate',
                'onToggle',
                'onVolumeChange',
                'onWaiting'
            ]
            if (eventHandlers.includes(name)) {
                element.addEventListener(name.replace(/^on/g, '').toLowerCase(), value)
            }
            else if (typeof value !== 'object') {
                element.setAttribute(name, String(value))
            }
            else {
                this.logger.verbose(`Unhandled attribute "${name}" on type "${element.tagName.toLowerCase()}"`)
            }
        }
    }
}
