import Logger from "../../../../../core/utils/logger/logger.esm"
import Emitter from "../../../../../core/utils/reactive/emitter"
import Listener from "../../../../../core/utils/reactive/listener"
import VDOM from "../../vdom/vdom"
import VNode from "../../vdom/vnode"
import ComponentEmitters from "./emitters"

/**
 * The base for the component props
 */
export type ComponentProps = {
    /**
     * The child nodes of this component
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
export default abstract class Component<Props extends ComponentProps = ComponentProps, State extends ComponentState = {}> {
    /**
     * The logger
     */
    public readonly logger = new Logger()
    
    /**
     * The associated VNode of this component
     */
    public vnode!: VNode
    
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
        this.emitters.umounted.listen.once(() => {
            [...this._listeners, ...this.listeners].forEach((l) => l.unsubscribe())
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
    public get state(): typeof this._state {
        return this._state
    }
    public set state(state: typeof this._state) {
        const deepProxy = (target: any, path: string[]) => new Proxy(target, {
            get: (obj, prop): any => {
                this.logger.verbose('get', path)
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
                    this.logger.verbose(`set called without any changes`, path)
                    return true
                }
                this.logger.verbose('set', path)
                obj[prop] = newValue
                this.rerender() // Trigger re-render when a mutation occurs
                return true // Indicate success
            }
        })
        
        // Set the actual state
        this._state = deepProxy(state, [])
        
        // Initialize the state
        if (!this._stateInitialized) {
            this._stateInitialized = true
        }
        else {
            // Rerender on the 2nd time or above setting this.state
            this.rerender()
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
        return this.props.children || []
    }
    public set children(value: VNode[]) {
        this.props.children = value
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
    public readonly rerender = () => {
        VDOM.rerenderComponent(this.vnode)
    }
}