import Logger from "../../../../core/utils/logger/logger.esm"
import Emitter from "../../../../core/utils/reactive/emitter"
import Listener from "../../../../core/utils/reactive/listener"
import VNode from "../../vdom/vnode"
import ComponentEmitters from "./emitters"

/**
 * The base for the component props
 */
export type ComponentProps = {
    /**
     * The child nodes of this.component component
     */
    children?: Array<VNode>
}

/**
 * The state of the component
 */
export type ComponentState = {}

/**
 * A component in the front-end
 */
export default abstract class Component<Props extends ComponentProps = any, State extends ComponentState = any> {    
    /**
     * The logger
     */
    private readonly logger = new Logger()

    /**
     * The component
     */
    private component = this
    
    /**
     * The associated VNode
     */
    private _vnode!: VNode

    /**
     * Get/set the associated VNode of this component
     */
    private get vnode(): VNode {
        return this.component._vnode
    }
    private set vnode(vnode: VNode) {
        this.component._vnode = vnode
    }
    
    /**
     * The component's event emitters, when extending this with your own emitters
     * use the spread syntax ...super.emitters in your object so they keep existing.
     */
    public readonly emitters: ComponentEmitters<Props> = {
        initialization: new Emitter(),
        mounted: new Emitter(),
        // TODO: 
        propsChanged: new Emitter(),
        // TODO: 
        beforeRender: new Emitter(),
        // TODO:
        afterRender: new Emitter(),
        // TODO:
        umounted: new Emitter()
    }

    /**
     * Here you can add your event listeners of `this.emitters`; they will be automatically
     * unsubscribed after the component unmounts. No worries about the cleanup there.
     */
    public listeners: Listener<any>[] = []

    /**
     * Event listeners that are there for every component
     */
    private _listeners: Listener<any>[] = [
        this.component.emitters.umounted.listen.once(() => {
            [...this.component._listeners, ...this.component.listeners].forEach((l) => l.unsubscribe())
        })
    ]

    /**
     * Whether or not the state has been initialized
     */
    private _stateInitialized = false

    /**
     * The internal state of the component
     */
    private _state: State = {} as State

    /**
     * Get or sets the state, if set a deep Proxy is created to
     * automatically call this.rerender() upon any changes anywhere
     * within the state object with infinite depth.
     */
    public get state(): typeof this.component._state {
        return this.component._state
    }
    public set state(state: typeof this.component._state) {
        const deepProxy = (target: any, path: string[]) => new Proxy(target, {
            get: (obj, prop): any => {
                this.component.logger.verbose('get', path)
                // Intercept property access
                const value = obj[prop]
                if (typeof value === 'object' && value !== null) {
                    // If the property is an object, create a deep proxy for it
                    const newPath = [...path, String(prop)]
                    return deepProxy(value, newPath)
                }
                return value
            },
            /**
             * Intercept property assignment
             */
            set: (obj: any, prop: any, newValue: any) => {
                // Avoid calling rerender twice
                if (obj[prop] === newValue) {
                    this.component.logger.verbose(`set called without any changes`, path)
                    return true
                }
                this.component.logger.verbose('set', path)
                obj[prop] = newValue
                this.component.rerender() // Trigger re-render when a mutation occurs
                return true // Indicate success
            }
        })
        
        // Set the actual state
        this.component._state = deepProxy(state, [])
        
        // Initialize the state
        if (!this.component._stateInitialized) {
            this.component._stateInitialized = true
        }
        else {
            // Rerender on the 2nd time or above setting this.component.state
            this.component.rerender()
        }
    }

    /**
     * The props, with a required children property for the child vnodes.
     */
    public readonly props: Props

    /**
     * Gets or sets the child nodes
     */
    public get children(): VNode[] {
        return this.component.props.children || []
    }
    public set children(value: VNode[]) {
        this.component.props.children = value
    }

    constructor(props: Props) {
        if (!props.children) {
            throw new Error(`Component props.children is not present`)
        }
        this.props = props as typeof this.props
        this.emitters.initialization.emit({
            component: this
        })
        this.emitters.propsChanged.emit({
            component: this,
            props: this.props
        })
    }
    
    /**
     * Renders the component into a VDOM node
     */
    public abstract render(): VNode|null

    /**
     * Rerenders the entire component in the VDOM, then applies it to the changes to the DOM right after.
     */
    public rerender() {
        const vnode = this.vnode
        if (!vnode.rootElement) {
            this.logger.verbose({vnode})
            throw new Error(`VNode has no root element.`)
        }
        if (vnode.element && !vnode.parent?.rootElement) {
            this.logger.verbose({vnode})
            throw new Error(`VNode has element but no parent with root element.`)
        }
        if (vnode.component) {
            // Can't rerender an unrendered component
            if (!vnode.renderNode) {
                return
            }

            // Get the node indices
            const indices = vnode.getRootElementIndices()
            const min = indices[0]
            const max = indices[indices.length - 1]
            console.log({
                indices,
                min,
                max,
                root: vnode.rootElement,
                el: vnode.element,
                vnode
            })

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
                vnode.renderNode.createElements()
                
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
}