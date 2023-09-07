import { VNode } from "./jsx"

/**
 * A component in the front-end
 */
export default abstract class Component<Props extends {} = {}> {
    /**
     * The associated VNode of this component
     */
    public vnode?: VNode

    constructor(public readonly props: Props, public readonly children: Array<VNode>) {}
    
    public abstract render(): JSX.Element|null
}