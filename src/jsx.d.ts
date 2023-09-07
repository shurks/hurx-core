import Component from "./library/framework/apps/frontend/component"
import { VNode } from "./library/framework/apps/frontend/jsx"

declare global {
	declare namespace JSX {
		/**
		 * This interface extends HTMLElement, indicating that the result of a JSX expression will be an HTML element.
		 */
		interface Element extends VNode { }

		/**
		 * This interface defines the shape of the IntrinsicElements object, which maps element names (e.g., "div", "span", etc.)
		 * to their expected attributes and children.
		 */
		interface IntrinsicElements {
			[elementName: string]: any
		}

		/**
		 * This interface defines the shape of a class or constructor for JSX elements.
		 */
		interface ElementClass extends Component { }

		/**
		 * This interface specifies that the "props" property is used to pass attributes to JSX elements.
		 */
		interface ElementAttributesProperty {
			props: {}
		}

		/**
		 * This interface allows you to add any custom attributes you want to support in JSX elements.
		 */
		interface IntrinsicAttributes {
			[key: string]: any
			/**
			 * The ID of the HTML element
			 */
			id?: string
			/**
			 * Classes to add, as a html string or an object with booleans to determine whether to add the class
			 */
			class?: string|Record<string, boolean>
		}
	}
}