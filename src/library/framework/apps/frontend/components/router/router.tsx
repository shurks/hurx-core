import Component from "../component/component"
import VDOM from "../../vdom/vdom"

/**
 * The router
 * TODO: work this out
 */
export class Router extends Component {
    public render() {
        return <div id="router">
            {
                this.children
            }
        </div>
    }
}