import Component from "../library/framework/apps/frontend/component"
import JSX from "../library/framework/apps/frontend/jsx"
import Page from "../library/framework/apps/frontend/page"

export const mount = (main: HTMLElement|null, root: JSX.Element) => {
    console.log('mounting')
    if (!main) {
        throw new Error(`Main element is null`)
    }
    root.rootElement = main
    console.log({root})
    JSX.createElements(root)
    console.log({root})
    JSX.mountVDOM(root)
    console.log({root})
}

/**
 * Test
 */
export class TestComponent extends Component {
    public render() {
        return <div id="test-component" style="background: blue;">Test component</div>
    }
}

/**
 * The home page
 */
export class HomePage extends Page {
    public render() {
        return <div id="home" style="background: red;">
            Hello
            <TestComponent />
        </div>
    }
}

/**
 * The test page
 */
export class TestPage extends Page {
    public render() {
        return <div id="test" style="background: yellow;">
            Test page
            <TestComponent />
        </div>
    }
}

/**
 * A route
 */
export class Route extends Component<{
    /**
     * The path for the route
     */
    path: string
}> {
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
            test
        </div>
    }
}

/**
 * The router
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

mount(
    document.querySelector('#main'),
    <Router>
        test
        test
        <Route path="/test">
            <TestPage />
        </Route>
        <Route path="/">
            <HomePage />
        </Route>
        test
    </Router>
)