import JSON from "../../../../core/utils/json"
import Logger from "../../../../core/utils/logger/logger.esm"
import Objects from "../../../../core/utils/objects"
import Component from "../components/component/component"
import VDOM from "./vdom"

/**
 * The interface for a VDOM node.
 */
export interface VNodeOptions {
    /**
     * The HTML tag name of the element.
     */
    tag?: string

    /**
     * The parent VNode.
     */
    parent?: VNode | null

    /**
     * Indicates whether this VNode represents a fragment.
     */
    isFragment?: boolean

    /**
     * The component associated with this VNode.
     */
    component?: Component

    /**
     * The intrinsic attributes of the element.
     */
    attributes: JSX.IntrinsicAttributes

    /**
     * The children VNodes of this VNode.
     */
    children: Array<VNode>

    /**
     * The HTML element or text node associated with this VNode.
     */
    element?: Element | Text | null

    /**
     * The root element to append the VDOM to
     */
    rootElement?: Element

    /**
     * The text element, if any
     */
    text?: Text|HTMLSpanElement

    /**
     * The render node, if the component has been rendered
     */
    renderNode?: VNode | null

    /**
     * The node to which this node is appended
     */
    appendedAt?: VNode | null

    /**
     * The element to which this node is appended
     */
    appendedAtElement?: Element | null

    /**
     * The nodes that are appended to this node
     */
    appendedNodes?: VNode[]
}

/**
 * A VDOM-node
 */
export default class VNode {
    /**
     * The VNode id
     */
    public id: number = ++VDOM.counter

    /**
     * Registered event listeners
     */
    public eventListeners: Record<string, (...args: any[]) => any> = {}

    /**
     * Whether or not the vnode is destroyed
     */
    public get destroyed(): boolean {
        return false
    }

    public get logger() {
        return new Logger()
    }

    /**
     * Filled when the node is a render node within this parent
     */
    public renderNodeParent: VNode|null = null

    /**
     * Get or set the HTML tag name of the element.
     */
    public get tag(): string | undefined {
        return this.options.tag
    }
    public set tag(tag: string | undefined) {
        this.options.tag = tag
    }

    /**
     * Get or set the HTML Text element of the vnode.
     */
    public get text(): Text | HTMLSpanElement | undefined {
        return this.options.text
    }
    public set text(text: Text | HTMLSpanElement | undefined) {
        this.options.text = text
    }

    /**
     * Get or set the renderNode of the vnode.
     */
    public get renderNode(): VNode | null | undefined {
        return this.options.renderNode
    }
    public set renderNode(renderNode: VNode | null | undefined) {
        this.options.renderNode = renderNode
    }

    /**
     * Gets the root vnode
     */
    public get root(): VNode|null {
        let parent: typeof this.parent = this.parent
        while (parent) {
            if (parent.parent) {
                parent = parent.parent
            }
            else {
                return parent
            }
        }
        return null
    }

    /**
     * The associated VDOM
     */
    private _vdom: VDOM|null = null

    /**
     * Gets or sets the latest VODM instance
     */
    public set vdom(vdom: VDOM|null) {
        let parent: typeof this.parent = this
        while (parent) {
            if (parent.renderNodeParent || parent.parent) {
                parent._vdom = null
                parent = parent.renderNodeParent || parent.parent
            }
            else {
                parent._vdom = vdom || parent._vdom
                break
            }
        }
    }
    public get vdom(): VDOM|null {
        const vdom = (((VDOM.window as any).VDOMS || []) as VDOM[]).find((v) => v.main === this.root?.rootElement)
        let lastVDOM: VDOM|null = null
        let parent: typeof this.parent = this
        while (parent) {
            if (parent.renderNodeParent || parent.parent) {
                lastVDOM = parent._vdom || lastVDOM
                parent = parent.renderNodeParent || parent.parent
            }
            else {
                if (parent._vdom !== vdom && vdom) {
                    parent._vdom = vdom
                    return vdom
                }
                return parent._vdom || lastVDOM
            }
        }
        return vdom || this._vdom
    }

    /**
     * Get or set the parent VNode.
     */
    public get parent(): VNode | undefined | null {
        return this.renderNodeParent || this.options.parent
    }
    public set parent(parent: VNode | undefined | null) {
        this.options.parent = parent
        if (this.options.parent) {
            this.options.parent.rootElement = this.rootElement
            this.options.rootElement = undefined
        }
    }

    /**
     * Get or set whether this VNode represents a fragment.
     */
    public get isFragment(): boolean | undefined {
        return this.options.isFragment
    }
    public set isFragment(isFragment: boolean | undefined) {
        this.options.isFragment = isFragment
    }

    /**
     * Get or set the component associated with this VNode.
     */
    public get component(): Component | undefined {
        return this.options.component
    }
    public set component(component: Component | undefined) {
        this.options.component = component
    }

    /**
     * Get or set the intrinsic attributes of the element.
     */
    public get attributes(): JSX.IntrinsicAttributes {
        return this.options.attributes
    }
    public set attributes(attributes: JSX.IntrinsicAttributes) {
        this.options.attributes = attributes
    }

    /**
     * Get or set the children VNodes of this VNode.
     */
    public get children(): VNode[] {
        return this.options.children
    }
    public set children(children: VNode[]) {
        this.options.children = children
    }

    /**
     * Get or set the HTML element or text node associated with this VNode.
     */
    public get element() {
        return this.options.element
    }
    public set element(element: VNodeOptions['element']) {
        this.options.element = element
    }

    /**
     * Get the root element this VNode is appended to
     */
    public get rootElement() {
        let root: typeof this.parent = this.renderNodeParent || this.parent
        if (root) {
            while (true) {
                if (root.element) {
                    if (root.element instanceof Text) {
                        this.logger.verbose({vnode: this})
                        throw Error(`A text element VNode has children.`)
                    }
                    return root.element
                }
                const parent: typeof this.parent = root.renderNodeParent || root.parent
                if (parent) {
                    root = parent
                }
                else {
                    break
                }
            }
            return root.options.rootElement
        }
        return this.options.rootElement
    }
    public set rootElement(rootElement: VNodeOptions['rootElement']) {
        let root = this.renderNodeParent || this.parent
        if (root) {
            while (true) {
                if (root.parent) {
                    root = root.parent
                }
                else {
                    break
                }
            }
            root.options.rootElement = rootElement
            this.options.rootElement = undefined
        }
        else {
            this.options.rootElement = rootElement
        }
    }

    /**
     * Whether the VNode should be updated
     */
    public shouldUpdate = false
    
    /**
     * Creates a new VNode instance.
     * @param options - The options for the VNode.
     */
    constructor(public options: VNodeOptions) {
        this.options.appendedNodes = options.appendedNodes || []
        if (this.options.component) {
            this.options.component.emitters.initialization.emit({
                component: this.options.component
            })
        }
    }

    /**
     * Destroys the VNode
     */
    public destroy() {
        if (this.destroyed) {
            return
        }
        Object.defineProperty(this, 'destroyed', {
            get: () => {
                return true
            }
        })
        this.setAttributes()
        for (const child of this.children) {
            child.destroy()
        }
        if (this.renderNode) {
            this.renderNode.destroy()
        }
    }

    /**
     * Replaces the VNode and mounts the replacement in its place in the DOM
     * @param vnode the vnode
     */
    public replace(vnode: VNode) {
        if (!this.rootElement) {
            this.logger.verbose({vnode: this, replaceWith: vnode})
            throw new Error(`Can't replace VNode, it has no root element.`)
        }
        const parent = (this.renderNodeParent ? this.renderNodeParent : this.parent)
        if (!parent) {
            this.logger.verbose({vnode: this, replaceWith: vnode})
            throw new Error(`Can't replace VNode, it has no parent`)
        }
        vnode.id = this.id
        vnode.parent = parent
        const indices = (this.component && this.renderNode) || this.isFragment || this.element
            ? vnode.getRootElementIndices()
            : parent
                ? new Array(this.getElements().length).fill('').map((v, i) => i + parent.children.map((v, i, a) => i >= a.indexOf(this) ? 0 : v.getElements().length).reduce((x, y) => x + y, 0))
                : []
        if (this.component && vnode.component) {
            (this.component as any).component = vnode.component
        }
        if (vnode.component) {
            vnode.isFragment = undefined
            vnode.text = undefined
            vnode.element = undefined
            if (this.component) {
                if (String((this.component as any).constructor) === String((vnode.component as any).constructor)) {
                    // Assign this state to current
                    vnode.component.state = Objects.deepAssign(vnode.component.state, this.component.state)
                }
                vnode.renderNode = vnode.component.render()
            }
            else if (vnode.renderNode === undefined) {
                vnode.renderNode = vnode.component.render()
            }
            if (vnode.renderNode) {
                vnode.renderNode.renderNodeParent = vnode
                vnode.renderNode.parent = vnode
                vnode.setRootElement(this.rootElement)
                this.logger.trace(`Mounting component: `, {
                    vnode,
                    name: (vnode.component as any).constructor.name,
                    component: vnode.component
                })
                vnode.mount(vnode.parent, indices[0] || null)
            }
        }
        else if (vnode.isFragment) {
            vnode.text = undefined
            vnode.element = undefined
            vnode.component = undefined
            vnode.renderNode = undefined
            vnode.setRootElement(this.rootElement)
            this.logger.trace(`Mounting fragment: `, {
                vnode
            })
            vnode.mount(vnode.parent, indices[0] || null)
        }
        else if (vnode.element) {
            vnode.component = undefined
            vnode.renderNode = undefined
            vnode.isFragment = undefined
            vnode.setRootElement(this.rootElement)
            this.logger.trace(`Mounting element: `, {
                element: vnode.element,
                vnode
            })
            vnode.mount(vnode.parent, indices[0] || null)
        }
        else {
            this.logger.verbose({vnode: this, replaceWith: vnode})
            throw new Error(`Could not finish replacing the VNode, because its replacement is invalid.`)
        }
        const elementCount = vnode.getElements().length
        for (let i = elementCount + indices[0] + indices.length - 1; i >= elementCount + indices[0]; i --) {
            const child = vnode.rootElement!.childNodes[i]
            if (child) {
                child.remove()
            }
            else {
                this.logger.verbose({child, vnode})
                throw new Error(`No child found with index: ${i}`)
            }
        }
        vnode.parent.children = vnode.parent.children.map((v) => v === this ? vnode : v)
        vnode.shouldUpdate = false
        this.shouldUpdate = false
        this.destroy()
    }

    /**
     * Sets the root element to a node and fixes broken root elements recursively
     * @param element the element to set as the root element
     */
    public setRootElement = (element: Element) => {
        this.rootElement = element
        if (this.element instanceof Element) {
            element = this.element
        }
        for (const child of this.children) {
            child.setRootElement(element)
        }
        if (this.renderNode) {
            for (const child of this.renderNode.children) {
                child.setRootElement(element)
            }
        }
    }

    /**
     * Get the elements of a vnode
     * @param elements the elements
     */
    public getElements(elements: Array<Element|Text> = []): Array<Element|Text> {
        if (this.component) {
            if (this.renderNode) {
                this.renderNode.getElements(elements)
            }
            else if (this.renderNode === undefined) {
                this.logger.verbose({vnode: this, elements})
                throw new Error(`Vnode was never rendered`)
            }
        }
        else if (this.isFragment) {
            for (const child of this.children) {
                child.getElements(elements)
            }
        }
        else if (this.element) {
            elements.push(this.element)
        }
        return elements
    }

    /**
     * Creates the elements within a root VNode
     */
    public createElements(originalNode: VNode|null = null) {
        if (this.component && !this.renderNode) {
            type State = {
                constructor: string,
                state: {}
            };
            (VDOM.window as any).states = (VDOM.window as any).states || [];
            const states: State[] = (VDOM.window as any).states
            const state = states.find((v) => v.constructor === String((this.component as any).constructor));
            const setState = () => {
                if (originalNode && originalNode.component) {
                    this.component!.state = {
                        ...Objects.deepAssign(this.component!.state, originalNode.component.state)
                    }
                }
            }
            if (!state) {
                ((VDOM.window as any).states as State[]).push({
                    constructor: String((this.component as any).constructor),
                    state: Objects.deepAssign({}, this.component.state)
                })
                setState()
            }
            else if (JSON.serialize(state.state) !== JSON.serialize(this.component.state)) {
                state.state = this.component.state
            }
            else {
                setState()
            }
            this.renderNode = this.component?.render()
            if (this.renderNode) {
                this.renderNode.renderNodeParent = this
                this.renderNode.createElements(originalNode)
            }
        }
        else if (!this.component) {
            if (this.isFragment) {
                for (let i = 0; i < this.children.length; i ++) {
                    this.children[i].createElements(originalNode?.children[i] || null)
                }
            }
            else if (this.text) {
                this.element = this.text
            }
            else if (this.tag) {
                this.element = VDOM.document.createElement(this.tag)
                this.setAttributes()
                for (let i = 0; i < this.children.length; i ++) {
                    this.children[i].createElements(originalNode?.children[i] || null)
                }
            }
            else {
                this.logger.verbose({vnode: this})
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
    public getNodeIndex(rootElement: Element, element: Element|Text): number {
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
     * @param current the current vnode
     */
    public getRootElementIndices(current: VNode = this, indices: Array<number> = []): Array<number> {
        if (!this.rootElement) {
            this.logger.verbose({base: this, current, indices})
            throw new Error(`Base has no root element.`)
        }
        const containingElement = this.rootElement
        if (current.component) {
            if (current.renderNode === undefined) {
                this.logger.verbose({base: this, current, indices})
                throw new Error(`Base has component but it hasn't been rendered yet, so it's not in the DOM.`)
            }
            if (current.renderNode) {
                return this.getRootElementIndices(current.renderNode, indices)
            }
        }
        else if (current.isFragment) {
            for (const child of current.children) {
                this.getRootElementIndices(child, indices)
            }
        }
        else if (current.element) {
            indices.push(this.getNodeIndex(containingElement, current.element))
        }
        else {
            this.logger.verbose({base: this, current, indices})
            throw Error(`Invalid VNode.`)
        }
        return indices.filter((v) => v !== -1)
    }

    /**
     * Mounts the VNode into the VDOM
     * @param appendTo the vnode to append everything to, must contain a Element
     * @param type the type of processing
     */
    public mount(appendTo: VNode|Element, index: null|number = null, insertions: {count: number} = {count: 0}) {
        const appendToElement = appendTo instanceof Element
            ? appendTo
            : appendTo.element || appendTo.rootElement
        if (!appendToElement) {
            throw new Error(`No element found to mount the DOM in.`)
        }
        if (!(appendToElement instanceof HTMLElement)) {
            throw new Error(`Append to element is not of type HTMLElement.`)
        }
        if (this.component) {
            if (this.renderNode) {
                this.renderNode.mount(appendTo, index, insertions)
            }
            else if (this.renderNode === undefined) {
                this.logger.verbose({vnode: this, appendTo})
                throw new Error(`VNode was never rendered`)
            }
        }
        else if (this.isFragment) {
            for (const child of this.children) {
                child.mount(appendTo, index, insertions)
            }
        }
        else if (this.element) {
            if (index !== null) {
                appendToElement.insertBefore(this.element, appendToElement.childNodes.item(index + insertions.count))
                insertions.count ++
            }
            else {
                appendToElement.append(this.element)
            }
            if (!(this.element instanceof Text)) {
                for (const child of this.children) {
                    child.mount(this.element)
                }
            }
        }
        else {
            this.logger.verbose({vnode: this, appendTo, index, insertions})
            throw new Error(`Invalid VNode object`)
        }
    }

    /**
     * Sets attributes to an element, also clears all event listeners
     * @param attributes the attributes
     * @param element the element
     */
    public setAttributes() {
        if (!(this.element instanceof Element)) {
            return
        }
        for (const name of Object.keys(this.eventListeners)) {
            const listener = this.eventListeners[name]
            this.element.removeEventListener(name, listener)
            delete this.eventListeners[name]
        }
        if (this.destroyed) {
            return
        }
        for (const name of Object.keys(this.attributes)) {
            const value = this.attributes[name]
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
                const eventListener = {
                    name: name.replace(/^on/g, '').toLowerCase(),
                    value
                }
                this.element.addEventListener(eventListener.name, eventListener.value)
                this.eventListeners[name] = eventListener.value
                this.logger.trace(`Added event listener "${eventListener.name}" to element`, {element: this.element})
            }
            else if (typeof value !== 'object') {
                this.element.setAttribute(name, String(value))
            }
            else {
                this.logger.verbose(`Unhandled attribute "${name}" on type "${this.element.tagName.toLowerCase()}"`)
            }
        }
    }

    /**
     * Gets the closest vnode containing component (if any)
     * @param vnode the vnode
     * @returns the closest vnode containing a component
     */
    public getComponent(vnode: VNode['parent'] = this): VNode|null {
        if (!vnode) {
            return null
        }
        if (vnode.component) {
            return vnode
        }
        else {
            return this.getComponent(vnode.renderNodeParent || vnode.parent)
        }
    }

    /**
     * Copies the VNode deeply into another VNode
     */
    public copy(): VNode {
        if (this.destroyed) {
            throw new Error(`Can't copy VNode, it's destroyed.`)
        }
        let copy = new VNode({
            ...this.options
        })
        copy = {
            ...copy,
            ...this,
            options: {
                ...copy.options
            }
        }
        for (const key of Object.keys(this.options) as Array<keyof VNode['options']>) {
            if (key === 'children') {
                const value = this[key]
                copy[key] = value
                    ? value.map((v) => {
                        v.parent = this
                        return v.copy()
                    })
                    : []
            }
            else if (key === 'component') {
                copy[key] = this[key]
                const value = copy[key]
                if (value) {
                    (value as any).vnode = copy
                }
            }
            else if (key === 'renderNode') {
                const value = this[key]
                if (value) {
                    copy[key] = value.copy()
                    if (copy[key]) {
                        copy[key]!['renderNodeParent'] = copy
                    }
                }
            }
        }

        return copy
    }
}