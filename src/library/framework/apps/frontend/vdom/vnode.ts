import Logger from "../../../../core/utils/logger/logger.esm"
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
     * Copies the VNode deeply into another VNode
     */
    public copy(): VNode {
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
                    value.vnode = copy
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