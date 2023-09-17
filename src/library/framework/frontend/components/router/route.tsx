import VDOM from "../../vdom/vdom"
import Component, { ComponentProps } from "../component/component"

/**
 * The props for a Route component
 */
interface RouteProps extends ComponentProps {
    /**
     * The path for the route
     */
    path: string
}

/**
 * A route
 * TODO: work this out
 */
export class Route extends Component<RouteProps> {
    public render() {
        // Return null if the route is not matched
        if (this.props.path !== window.location.pathname) {
            return null
        }
        // Return the route
        return <div>
            {
                this.children
            }
        </div>
    }
}