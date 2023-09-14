import Component from "../../../library/framework/apps/frontend/components/component/component"
import VDOM from "../../../library/framework/apps/frontend/vdom/vdom"
import Page from "../../../library/framework/apps/frontend/components/page"
import { Router } from "../../../library/framework/apps/frontend/components/router/router"
import { Route } from "../../../library/framework/apps/frontend/components/router/route"

/**
 * Test
 */
export class TestComponent extends Component {
    public render() {
        return (
            <div id="test-component" style="background: orange; padding: 5px;">
                <div style="background: black; color: white;">Test</div>
                {
                    new Array(3).fill('').map((v, i) => <>Test components {i + 1}<br/></>)
                }
            </div>
        )
    }
}

/**
 * The home page
 */
export class HomePage extends Page {
    public render() {
        return <div id="home" style={{
            background: 'red',
        }} onClick={(e) => {
            
        }}>
            homeesssssss
            <TestComponent />
        </div>
    }
}

/**
 * The test page
 */
export class TestPage extends Page {
    public render() {
        return <div id="test" style="background: yellow; padding: 5px;">
            Test pagessaads
            <TestComponent />
        </div>
    }
}

class A extends Component<any, { test: number }> {
    constructor(props: any) {
        super(props)
        this.state = {
            test: 12
        }
    }

    public render() {
        return <>
            {/* Parent.parent */}
            <div id={this.state.test} onClick={() => {
                this.state.test ++
                console.log(this)
            }}>
                <div>
                    {this.state.test}
                </div>
                <div>tesst</div>
                <div>tesst</div>
                <div>tesst</div>
                <div>tesst</div>
                <div>tesst</div>
            </div>
            <div>
                Yoloaa
            </div>
            Test
        </>
    }
}

new VDOM(
    'main',
    <div>
        <div style="background: red; color: white; padding: 5px;"><div>Start of VDOM</div></div>
        <>
            <TestPage />
            <Router>
                <div>Route tes12sst</div>
                <div>Route tes12t</div>
                <div>Route tes12t</div>
                <div>Route tes12tss</div>
                <div>Route tes12tss</div>
                <A />
                AAAA
                <Route path="/test">
                    <TestPage />
                    <TestPage />
                </Route>
                <Route path="/test2">
                    <TestPage />
                    <TestPage />
                    <TestPage />
                    <TestPage />
                </Route>
                <Route path="/">
                    <HomePage />
                </Route>
                test12345678
            </Router>
        </>
        <div style="background: maroon; color: white; padding: 5px;"><div>End of VDOM</div></div>
    </div>
)