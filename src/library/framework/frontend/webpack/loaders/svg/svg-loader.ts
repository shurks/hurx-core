/**
 * TODO: update src path
 */
module.exports = function(source: string) {
    return `
        import VDOM from "@hurx/core/src/library/framework/frontend/vdom/vdom"
        import Component from "@hurx/core/src/library/framework/frontend/components/component/component"
        /**
         * An SVG element loaded as a component
         */
        export default class extends Component {
            public render() {
                return (
                    ${source}
                )
            }
        }
    `
}