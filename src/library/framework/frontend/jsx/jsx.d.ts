import VNode from "../vdom/vnode"
import { Hurx } from "./hurx"
import Component, { ComponentProps } from "../components/component/component"

declare global {
	declare namespace JSX {
		/**
		 * This interface extends HTMLElement, indicating that the result of a JSX expression will be an HTML element.
		 */
		interface Element extends VNode {}
		/**
		 * All the available JSX elements
		 */
		interface IntrinsicElements extends Hurx.Elements.IntrinsicElements {}
		/**
		 * This interface defines the shape of a class or constructor for JSX elements.
		 */
		interface ElementClass extends Component {}
		/**
		 * This interface specifies that the "props" property is used to pass attributes to JSX elements.
		 */
		interface ElementAttributesProperty {
			props: ComponentProps
		}
	}
}
