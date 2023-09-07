import { ArrayOrNonArray } from '../../../types/types'
import Logger from '../../../utils/logger'
import Component from './component'

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
    text?: Text

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
export class VNode {
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
    public get text(): Text | undefined {
        return this.options.text
    }
    public set text(text: Text | undefined) {
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
    public get root(): VNode {
        let parent: VNode = this
        while (true) {
            if (parent.parent) {
                parent = parent.parent
            }
            else {
                return parent
            }
        }
    }

    /**
     * Get or set the parent VNode.
     */
    public get parent(): VNode | undefined | null {
        return this.options.parent
    }
    public set parent(parent: VNode | undefined | null) {
        this.options.parent = parent
        if (this.options.parent) {
            this.options.parent.rootElement = this.rootElement
        }
        this.options.rootElement = undefined
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
     * Get or set the VNode at which this VNode is appended.
     */
    public get appendedAtElement() {
        return this.options.appendedAtElement
    }
    public set appendedAtElement(appendedAtElement: VNodeOptions['appendedAtElement']) {
        this.options.appendedAtElement = appendedAtElement
    }

    /**
     * Get or set the element at which this VNode is appended.
     */
    public get appendedAt() {
        return this.options.appendedAt
    }
    public set appendedAt(appendedAt: VNodeOptions['appendedAt']) {
        // Remove from old appendedAt parent
        if (this.appendedAt && this.appendedAt !== appendedAt) {
            this.appendedAt.appendedNodes = this.appendedAt.appendedNodes.filter((v) => v !== this)
        }

        // Set the appendedAt
        this.options.appendedAt = appendedAt
        if (this.options.appendedAt && !this.options.appendedAt.appendedNodes.find(v => v === this)) {
            this.options.appendedAt.appendedNodes = [
                ...this.options.appendedAt.appendedNodes,
                this
            ]
        }

        // Set the appendedToElement
        if (this.options.appendedAt) {
            let element = this.options.appendedAt.element || this.options.appendedAt.rootElement
            if (!(element instanceof Element)) {
                console.debug({
                    vnode: this,
                    arguments
                })
                throw new Error(`VNode appendedAt has been set while it has no element in its node or any of its parents.`)
            }
            this.options.appendedAtElement = element
        }
    }

    /**
     * Get or set the VNode's appended to this VNode
     */
    public get appendedNodes() {
        return this.options.appendedNodes!
    }
    public set appendedNodes(appendedNodes: VNode[]) {
        this.options.appendedNodes = appendedNodes
    }

    /**
     * Get the root element this VNode is appended to
     */
    public get rootElement() {
        let root: typeof this.parent = this
        if (root) {
            while (true) {
                if (root.element) {
                    if (root.element instanceof Text) {
                        console.debug({vnode: this})
                        throw Error(`A text element VNode has children.`)
                    }
                    return root.element
                }
                if (root.parent) {
                    root = root.parent
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
        let root = this.parent
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
        }
        this.options.rootElement = rootElement
    }
    
    /**
     * Creates a new VNode instance.
     * @param options - The options for the VNode.
     */
    constructor(private options: VNodeOptions) {
        this.options.appendedNodes = options.appendedNodes || []
    }

    /**
     * Finds the closest parent containing a certain element
     * @param element the element to find, will match any element when its undefined
     */
    public findClosestParentWithElement(element?: Element | Text): VNode | null {
        if (this.parent) {
            if (element) {
                return this.parent.element === element
                    ? this.parent
                    : this.parent.findClosestParentWithElement(element)
            }
            return this.parent.element
                ? this.parent
                : this.parent.findClosestParentWithElement(element)
        }
        else {
            return null
        }
    }
}

/**
 * JSX functionality
 */
export default class JSX {
    /**
     * The window (either a JSDOM instance in case of Node.JS otherwise the browsers window object)
     */
    private static window = window || new (require('jsdom').JSDOM)().window
    
    /**
     * The document in the window
     */
    private static document = this.window.document

    /**
     * Creates a vnode from deepest nesting until the root of the VDOM (when a JSX element has been created)
     * @param tag the name of the tag, or a `Component` prototype
     * @param attributes the attributes of the JSX element
     * @param children the children that were created with this function before going to this parent node.
     */
    public static createVNode (tag: string|(new(...args: ConstructorParameters<typeof Component>) => Component), attributes: VNode['attributes'] | null | undefined, ...children: ArrayOrNonArray<VNode|Text>[]): JSX.Element {
        const processedChildren: VNode[] = [];
        (children || []).forEach(function processChild(child: ArrayOrNonArray<VNode|Text>) {
            if (Array.isArray(child)) {
                for (const c of child) {
                    processChild(c)
                }
            }
            else {
                if (child instanceof Text || typeof child === 'string') {
                    processedChildren.push(new VNode({
                        text: child,
                        attributes: {},
                        children: []
                    }))
                }
                else if (child instanceof VNode) {
                    processedChildren.push(child)
                }
            }
        })
        const vnode = new VNode({
            isFragment: typeof tag === 'string' ? false : tag.prototype instanceof Component ? false : true,
            tag: typeof tag === 'string' ? tag : void 0,
            component: typeof tag === 'string' ? void 0 : tag.prototype instanceof Component ? new tag(attributes || {}, processedChildren) : void 0,
            attributes: attributes || {},
            children: processedChildren
        })
        processedChildren.forEach((v) => {
            v.parent = vnode
        })
        return vnode
    }

    /**
     * Creates the elements within a root VNode
     * @param vnode the root vnode
     */
    public static createElements(vnode: VNode) {
        if (vnode.component && !vnode.renderNode) {
            vnode.renderNode = vnode.component?.render()
            if (vnode.renderNode) {
                this.createElements(vnode.renderNode)
            }
        }
        else if (!vnode.component) {
            if (vnode.isFragment) {
                for (const child of vnode.children) {
                    this.createElements(child)
                }
            }
            else if (vnode.text) {
                vnode.element = vnode.text
            }
            else if (vnode.tag) {
                vnode.element = this.document.createElement(vnode.tag)
                for (const name of Object.keys(vnode.attributes)) {
                    const value = vnode.attributes[name]
                    if (typeof value === 'string') {
                        vnode.element.setAttribute(name, value)
                    }
                    else {
                        console.debug(`Unhandled attribute "${name}" on type "${vnode.tag}"`)
                    }
                }
                for (const child of vnode.children) {
                    this.createElements(child)
                }
            }
            else {
                console.debug({vnode})
                throw new Error(`Unknown VNode syntax`)
            }
        }
        return null
    }

    /**
     * Mounts the VDOM after creating the elements
     * @param vnode the root vnode
     * @param appendTo the vnode to append everything to, must contain a Element
     */
    public static mountVDOM(vnode: VNode, appendTo: VNode = vnode) {
        if (!(appendTo.rootElement instanceof Element)) {
            console.debug({arguments, appendTo})
            throw new Error(`No root element was found while mounting VDOM.`)
        }
        const appendToElement = appendTo.rootElement
        if (vnode.component) {
            if (vnode.renderNode) {
                this.mountVDOM(vnode.renderNode, vnode)
            }
            else if (vnode.renderNode === undefined) {
                console.debug({vnode, appendTo})
                throw new Error(`VNode has a component, but no renderNode. Try calling \`this.createElements\` first.`)
            }
        }
        else if (vnode.isFragment) {
            for (const child of vnode.children) {
                const parent = child.findClosestParentWithElement()
                if (parent) {
                    this.mountVDOM(child, parent.element instanceof Element ? parent : appendTo)
                    if (parent.element instanceof Text) {
                        console.debug({vnode, appendTo})
                        throw new Error(`Fragment VNode has Text node as a parent.`)
                    }
                }
                else {
                    console.debug({vnode, appendTo})
                    throw new Error(`Fragment type VNode has no parent with an element.`)
                }
            }
        }
        else if (vnode.text) {
            if (vnode.element) {
                console.log(vnode.element)
                appendToElement.innerHTML += vnode.element
                if (appendTo instanceof Element) {
                    vnode.appendedAtElement = appendTo
                }
                else {
                    vnode.appendedAt = appendTo
                }
            }
            else {
                console.debug({vnode, appendTo})
                throw new Error(`VNode has text, but no element. Try calling \`this.createElements\` first.`)
            }
        }
        else if (vnode.tag) {
            if (vnode.element) {
                appendToElement.appendChild(vnode.element)
                if (appendTo instanceof Element) {
                    vnode.appendedAtElement = appendTo
                }
                else {
                    vnode.appendedAt = appendTo
                }
                for (const child of vnode.children) {
                    this.mountVDOM(child, vnode)
                }
            }
            else if (vnode.element === undefined) {
                console.debug({vnode, appendTo})
                throw new Error(`VNode has a tag, but no element. Try calling \`this.createElements\` first.`)
            }
        }
    }
}
