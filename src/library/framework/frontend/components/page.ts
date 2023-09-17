import Component from "./component/component"

/**
 * A component used as the page for a route
 * TODO: work this out
 */
export default abstract class Page<Props extends {} = {}> extends Component<Props> {
    /**
     * TODO: Additional page params
     */
    public params: Record<string, any>
    
    constructor(props: Props) {
        super(props)
        this.params = {}
    }
}