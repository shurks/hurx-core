import Component from "./component"
import { VNode } from "./jsx"

/**
 * A component used as the page for a route
 */
export default abstract class Page<Props extends {} = {}> extends Component<Props> {
    /**
     * TODO: Additional page params
     */
    public params: Record<string, any>
    
    constructor(props: Props, public readonly children: VNode[]) {
        super(props, children)
        this.params = {}
    }
}