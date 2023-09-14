import Component from "./library/framework/apps/frontend/component"
import VNode from "../library/framework/apps/frontend/vdom/vnode"

declare global {
	declare namespace JSX {
		/**
		 * This interface extends HTMLElement, indicating that the result of a JSX expression will be an HTML element.
		 */
		interface Element extends VNode {}

		/**
		 * All the available JSX elements
		 */
		interface IntrinsicElements {
			[elementName: string]: any
			/**
			 * Represents the root (top-level element) of an HTML document, so it is also referred to as the root element. All other elements must be descendants of this element.
			 */
			html: Hurx.Elements.HTML
			/**
			 * Specifies the base URL to use for all relative URLs in a document. There can be only one such element in a document.
			 */
			base: Hurx.Elements.Metadata.Base
			/**
			 * Contains machine-readable information (metadata) about the document, like its title, scripts, and style sheets.
			 */
			head: Hurx.Elements.Metadata.Head
			/**
			 * Specifies relationships between the current document and an external resource. This element is most commonly used to link to CSS but is also used to establish site icons (both "favicon" style icons and icons for the home screen and apps on mobile devices) among other things.
			 */
			link: Hurx.Elements.Metadata.Link
			/**
			 * Represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> and <title>.
			 */
			meta: Hurx.Elements.Metadata.Meta
			/**
			 * Contains style information for a document or part of a document. It contains CSS, which is applied to the contents of the document containing this element.
			 */
			style: Hurx.Elements.Metadata.Style
			/**
			 * Defines the document's title that is shown in a browser's title bar or a page's tab. It only contains text; tags within the element are ignored.
			 */
			title: Hurx.Elements.Metadata.Title
			/**
			 * represents the content of an HTML document. There can be only one such element in a document.
			 */
			body: Hurx.Elements.Metadata.Body
			/**
			 * Indicates that the enclosed HTML provides contact information for a person or people, or for an organization.
			 */
			address: Hurx.Elements.ContentSectioning.Address
			/**
			 * Represents a self-contained composition in a document, page, application, or site, which is intended to be independently distributable or reusable (e.g., in syndication). Examples include a forum post, a magazine or newspaper article, a blog entry, a product card, a user-submitted comment, an interactive widget or gadget, or any other independent item of content.
			 */
			article: Hurx.Elements.ContentSectioning.Article
			/**
			 * Represents a portion of a document whose content is only indirectly related to the document's main content. Asides are frequently presented as sidebars or call-out boxes.
			 */
			aside: Hurx.Elements.ContentSectioning.Aside
			/**
			 * Represents a footer for its nearest ancestor sectioning content or sectioning root element. A <footer> typically contains information about the author of the section, copyright data, or links to related documents.
			 */
			footer: Hurx.Elements.ContentSectioning.Footer
			/**
			 * Represents introductory content, typically a group of introductory or navigational aids. It may contain some heading elements but also a logo, a search form, an author name, and other elements.
			 */
			header: Hurx.Elements.ContentSectioning.Header
			/**
			 * Represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.
			 */
			h1: Hurx.Elements.ContentSectioning.H1
			/**
			 * Represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.
			 */
			h2: Hurx.Elements.ContentSectioning.H2
			/**
			 * Represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.
			 */
			h3: Hurx.Elements.ContentSectioning.H3
			/**
			 * Represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.
			 */
			h4: Hurx.Elements.ContentSectioning.H4
			/**
			 * Represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.
			 */
			h5: Hurx.Elements.ContentSectioning.H5
			/**
			 * Represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.
			 */
			h6: Hurx.Elements.ContentSectioning.H6
			/**
			 * Represents a heading grouped with any secondary content, such as subheadings, an alternative title, or a tagline.
			 */
			hgroup: Hurx.Elements.ContentSectioning.HGroup
			/**
			 * Represents the dominant content of the body of a document. The main content area consists of content that is directly related to or expands upon the central topic of a document, or the central functionality of an application.
			 */
			main: Hurx.Elements.ContentSectioning.Main
			/**
			 * Represents a section of a page whose purpose is to provide navigation links, either within the current document or to other documents. Common examples of navigation sections are menus, tables of contents, and indexes.
			 */
			nav: Hurx.Elements.ContentSectioning.Nav
			/**
			 * Represents a generic standalone section of a document, which doesn't have a more specific semantic element to represent it. Sections should always have a heading, with very few exceptions.
			 */
			section: Hurx.Elements.ContentSectioning.Section
			/**
			 * Represents a part that contains a set of form controls or other content related to performing a search or filtering operation.
			 */
			search: Hurx.Elements.ContentSectioning.Search
			/**
			 * Indicates that the enclosed text is an extended quotation. Usually, this is rendered visually by indentation. A URL for the source of the quotation may be given using the cite attribute, while a text representation of the source can be given using the <cite> element.
			 */
			blockquote: Hurx.Elements.TextContent.Blockquote
			/**
			 * Provides the description, definition, or value for the preceding term (<dt>) in a description list (<dl>).
			 */
			dd: Hurx.Elements.TextContent.DD
			/**
			 * The generic container for flow content. It has no effect on the content or layout until styled in some way using CSS (e.g., styling is directly applied to it, or some kind of layout model like flexbox is applied to its parent element).
			 */
			div: Hurx.Elements.TextContent.Div
			/**
			 * Represents a description list. The element encloses a list of groups of terms (specified using the <dt> element) and descriptions (provided by <dd> elements). Common uses for this element are to implement a glossary or to display metadata (a list of key-value pairs).
			 */
			dl: Hurx.Elements.TextContent.DL
			/**
			 * Specifies a term in a description or definition list, and as such must be used inside a <dl> element. It is usually followed by a <dd> element; however, multiple <dt> elements in a row indicate several terms that are all defined by the immediate next <dd> element.
			 */
			dt: Hurx.Elements.TextContent.DT
			/**
			 * Represents a caption or legend describing the rest of the contents of its parent <figure> element.
			 */
			figcaption: Hurx.Elements.TextContent.Figcaption
			/**
			 * Represents self-contained content, potentially with an optional caption, which is specified using the <figcaption> element. The figure, its caption, and its contents are referenced as a single unit.
			 */
			figure: Hurx.Elements.TextContent.Figure
			/**
			 * Represents a thematic break between paragraph-level elements: for example, a change of scene in a story, or a shift of topic within a section.
			 */
			hr: Hurx.Elements.TextContent.HR
			/**
			 * Represents an item in a list. It must be contained in a parent element: an ordered list (<ol>), an unordered list (<ul>), or a menu (<menu>). In menus and unordered lists, list items are usually displayed using bullet points. In ordered lists, they are usually displayed with an ascending counter on the left, such as a number or letter.
			 */
			li: Hurx.Elements.TextContent.LI
			/**
			 * A semantic alternative to <ul>, but treated by browsers (and exposed through the accessibility tree) as no different than <ul>. It represents an unordered list of items (which are represented by <li> elements).
			 */
			menu: Hurx.Elements.TextContent.Menu
			/**
			 * Represents an ordered list of items — typically rendered as a numbered list.
			 */
			ol: Hurx.Elements.TextContent.OL
			/**
			 * Represents a paragraph. Paragraphs are usually represented in visual media as blocks of text separated from adjacent blocks by blank lines and/or first-line indentation, but HTML paragraphs can be any structural grouping of related content, such as images or form fields.
			 */
			p: Hurx.Elements.TextContent.P
			/**
			 * Represents preformatted text which is to be presented exactly as written in the HTML file. The text is typically rendered using a non-proportional, or monospaced, font. Whitespace inside this element is displayed as written.
			 */
			pre: Hurx.Elements.TextContent.Pre
			/**
			 * Represents an unordered list of items, typically rendered as a bulleted list.
			 */
			ul: Hurx.Elements.TextContent.UL
			/**
			 * Together with its href attribute, creates a hyperlink to web pages, files, email addresses, locations within the current page, or anything else a URL can address.
			 */
			a: Hurx.Elements.InlineTextSemantics.A
			/**
			 * Represents an abbreviation or acronym.
			 */
			abbr: Hurx.Elements.InlineTextSemantics.Abbr
			/**
			 * Used to draw the reader's attention to the element's contents, which are not otherwise granted special importance. This was formerly known as the Boldface element, and most browsers still draw the text in boldface. However, you should not use <b> for styling text or granting importance. If you wish to create boldface text, you should use the CSS font-weight property. If you wish to indicate an element is of special importance, you should use the strong element.
			 */
			b: Hurx.Elements.InlineTextSemantics.B
			/**
			 * Tells the browser's bidirectional algorithm to treat the text it contains in isolation from its surrounding text. It's particularly useful when a website dynamically inserts some text and doesn't know the directionality of the text being inserted.
			 */
			bdi: Hurx.Elements.InlineTextSemantics.BDI
			/**
			 * Overrides the current directionality of text, so that the text within is rendered in a different direction.
			 */
			bdo: Hurx.Elements.InlineTextSemantics.BDO
			/**
			 * Produces a line break in text (carriage-return). It is useful for writing a poem or an address, where the division of lines is significant.
			 */
			br: Hurx.Elements.InlineTextSemantics.BR
			/**
			 * Used to mark up the title of a cited creative work. The reference may be in an abbreviated form according to context-appropriate conventions related to citation metadata.
			 */
			cite: Hurx.Elements.InlineTextSemantics.Cite
			/**
			 * Displays its contents styled in a fashion intended to indicate that the text is a short fragment of computer code. By default, the content text is displayed using the user agent's default monospace font.
			 */
			code: Hurx.Elements.InlineTextSemantics.Code
			/**
			 * Links a given piece of content with a machine-readable translation. If the content is time- or date-related, the<time> element must be used.
			 */
			data: Hurx.Elements.InlineTextSemantics.Data
			/**
			 * Used to indicate the term being defined within the context of a definition phrase or sentence. The ancestor <p> element, the <dt>/<dd> pairing, or the nearest section ancestor of the <dfn> element, is considered to be the definition of the term.
			 */
			dfn: Hurx.Elements.InlineTextSemantics.DFN
			/**
			 * Marks text that has stress emphasis. The <em> element can be nested, with each nesting level indicating a greater degree of emphasis.
			 */
			em: Hurx.Elements.InlineTextSemantics.EM
			/**
			 * Represents a range of text that is set off from the normal text for some reason, such as idiomatic text, technical terms, and taxonomical designations, among others. Historically, these have been presented using italicized type, which is the original source of the <i> naming of this element.
			 */
			i: Hurx.Elements.InlineTextSemantics.I
			/**
			 * Represents a span of inline text denoting textual user input from a keyboard, voice input, or any other text entry device. By convention, the user agent defaults to rendering the contents of a <kbd> element using its default monospace font, although this is not mandated by the HTML standard.
			 */
			kbd: Hurx.Elements.InlineTextSemantics.KBD
			/**
			 * Represents text which is marked or highlighted for reference or notation purposes due to the marked passage's relevance in the enclosing context.
			 */
			mark: Hurx.Elements.InlineTextSemantics.Mark
			/**
			 * Indicates that the enclosed text is a short inline quotation. Most modern browsers implement this by surrounding the text in quotation marks. This element is intended for short quotations that don't require paragraph breaks; for long quotations use the <blockquote> element.
			 */
			q: Hurx.Elements.InlineTextSemantics.Q
			/**
			 * Used to provide fall-back parentheses for browsers that do not support the display of ruby annotations using the <ruby> element. One <rp> element should enclose each of the opening and closing parentheses that wrap the <rt> element that contains the annotation's text.
			 */
			rp: Hurx.Elements.InlineTextSemantics.RP
			/**
			 * Specifies the ruby text component of a ruby annotation, which is used to provide pronunciation, translation, or transliteration information for East Asian typography. The <rt> element must always be contained within a <ruby> element.
			 */
			rt: Hurx.Elements.InlineTextSemantics.RT
			/**
			 * Represents small annotations that are rendered above, below, or next to base text, usually used for showing the pronunciation of East Asian characters. It can also be used for annotating other kinds of text, but this usage is less common.
			 */
			ruby: Hurx.Elements.InlineTextSemantics.Ruby
			/**
			 * Renders text with a strikethrough, or a line through it. Use the <s> element to represent things that are no longer relevant or no longer accurate. However, <s> is not appropriate when indicating document edits; for that, use the del and ins elements, as appropriate.
			 */
			s: Hurx.Elements.InlineTextSemantics.S
			/**
			 * Used to enclose inline text which represents sample (or quoted) output from a computer program. Its contents are typically rendered using the browser's default monospaced font (such as Courier or Lucida Console).
			 */
			samp: Hurx.Elements.InlineTextSemantics.Samp
			/**
			 * Represents side-comments and small print, like copyright and legal text, independent of its styled presentation. By default, it renders text within it one font size smaller, such as from small to x-small.
			 */
			small: Hurx.Elements.InlineTextSemantics.Small
			/**
			 * A generic inline container for phrasing content, which does not inherently represent anything. It can be used to group elements for styling purposes (using the class or id attributes), or because they share attribute values, such as lang. It should be used only when no other semantic element is appropriate. <span> is very much like a div element, but div is a block-level element whereas a <span> is an inline-level element.
			 */
			span: Hurx.Elements.InlineTextSemantics.Span
			/**
			 * Indicates that its contents have strong importance, seriousness, or urgency. Browsers typically render the contents in bold type.
			 */
			strong: Hurx.Elements.InlineTextSemantics.Strong
			/**
			 * Specifies inline text which should be displayed as subscript for solely typographical reasons. Subscripts are typically rendered with a lowered baseline using smaller text.
			 */
			sub: Hurx.Elements.InlineTextSemantics.Sub
			/**
			 * Specifies inline text which is to be displayed as superscript for solely typographical reasons. Superscripts are usually rendered with a raised baseline using smaller text.
			 */
			sup: Hurx.Elements.InlineTextSemantics.Sup
			/**
			 * Represents a specific period in time. It may include the datetime attribute to translate dates into machine-readable format, allowing for better search engine results or custom features such as reminders.
			 */
			time: Hurx.Elements.InlineTextSemantics.Time
			/**
			 * Represents a span of inline text which should be rendered in a way that indicates that it has a non-textual annotation. This is rendered by default as a simple solid underline but may be altered using CSS.
			 */
			u: Hurx.Elements.InlineTextSemantics.U
			/**
			 * Represents the name of a variable in a mathematical expression or a programming context. It's typically presented using an italicized version of the current typeface, although that behavior is browser-dependent.
			 */
			var: Hurx.Elements.InlineTextSemantics.Var
			/**
			 * Represents a word break opportunity—a position within text where the browser may optionally break a line, though its line-breaking rules would not otherwise create a break at that location.
			 */
			wbr: Hurx.Elements.InlineTextSemantics.WBR
			/**
			 * Defines an area inside an image map that has predefined clickable areas. An image map allows geometric areas on an image to be associated with hyperlink.
			 */
			area: Hurx.Elements.ImageAndMultimedia.Area
			/**
			 * Used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the source element: the browser will choose the most suitable one. It can also be the destination for streamed media, using a MediaStream.
			 */
			audio: Hurx.Elements.ImageAndMultimedia.Audio
			/**
			 * Embeds an image into the document.
			 */
			img: Hurx.Elements.ImageAndMultimedia.Img
			/**
			 * Used with <area> elements to define an image map (a clickable link area).
			 */
			map: Hurx.Elements.ImageAndMultimedia.Map
			/**
			 * Used as a child of the media elements, audio and video. It lets you specify timed text tracks (or time-based data), for example to automatically handle subtitles. The tracks are formatted in WebVTT format (.vtt files)—Web Video Text Tracks.
			 */
			track: Hurx.Elements.ImageAndMultimedia.Track
			/**
			 * Embeds a media player which supports video playback into the document. You can also use <video> for audio content, but the audio element may provide a more appropriate user experience.
			 */
			video: Hurx.Elements.ImageAndMultimedia.Video
			/**
			 * Embeds external content at the specified point in the document. This content is provided by an external application or other source of interactive content such as a browser plug-in.
			 */
			embed: Hurx.Elements.EmbeddedContent.Embed
			/**
			 * Represents a nested browsing context, embedding another HTML page into the current one.
			 */
			iframe: Hurx.Elements.EmbeddedContent.Iframe
			/**
			 * Represents an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin.
			 */
			object: Hurx.Elements.EmbeddedContent.Object
			/**
			 * Contains zero or more <source> elements and one <img> element to offer alternative versions of an image for different display/device scenarios.
			 */
			picture: Hurx.Elements.EmbeddedContent.Picture
			/**
			 * Enables the embedding of another HTML page into the current one to enable smoother navigation into new pages.
			 */
			portal: Hurx.Elements.EmbeddedContent.Portal
			/**
			 * Specifies multiple media resources for the picture, the audio element, or the video element. It is a void element, meaning that it has no content and does not have a closing tag. It is commonly used to offer the same media content in multiple file formats in order to provide compatibility with a broad range of browsers given their differing support for image file formats and media file formats.
			 */
			source: Hurx.Elements.EmbeddedContent.Source
			/**
			 * Container defining a new coordinate system and viewport. It is used as the outermost element of SVG documents, but it can also be used to embed an SVG fragment inside an SVG or HTML document.
			 */
			svg: Hurx.Elements.SVGAndMathML.SVG
			/**
			 * The top-level element in MathML. Every valid MathML instance must be wrapped in it. In addition, you must not nest a second <math> element in another, but you can have an arbitrary number of other child elements in it.
			 */
			math: Hurx.Elements.SVGAndMathML.Math
			/**
			 * Container element to use with either the canvas scripting API or the WebGL API to draw graphics and animations.
			 */
			canvas: Hurx.Elements.Scripting.Canvas
			/**
			 * Defines a section of HTML to be inserted if a script type on the page is unsupported or if scripting is currently turned off in the browser.
			 */
			noscript: Hurx.Elements.Scripting.Noscript
			/**
			 * Used to embed executable code or data; this is typically used to embed or refer to JavaScript code. The <script> element can also be used with other languages, such as WebGL's GLSL shader programming language and JSON.
			 */
			script: Hurx.Elements.Scripting.Script
			/**
			 * Represents a range of text that has been deleted from a document. This can be used when rendering "track changes" or source code diff information, for example. The <ins> element can be used for the opposite purpose: to indicate text that has been added to the document.
			 */
			del: Hurx.Elements.DemarcatingEdits.Del
			/**
			 * Represents a range of text that has been added to a document. You can use the <del> element to similarly represent a range of text that has been deleted from the document.
			 */
			ins: Hurx.Elements.DemarcatingEdits.Ins
			/**
			 * Specifies the caption (or title) of a table.
			 */
			caption: Hurx.Elements.TableContent.Caption
			/**
			 * Defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.
			 */
			col: Hurx.Elements.TableContent.Col
			/**
			 * Defines a group of columns within a table.
			 */
			colgroup: Hurx.Elements.TableContent.Colgroup
			/**
			 * Represents tabular data — that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data.
			 */
			table: Hurx.Elements.TableContent.Table
			/**
			 * Encapsulates a set of table rows (<tr> elements), indicating that they comprise the body of the table (<table>).
			 */
			tBody: Hurx.Elements.TableContent.TBody
			/**
			 * Defines a cell of a table that contains data. It participates in the table model.
			 */
			td: Hurx.Elements.TableContent.TD
			/**
			 * Defines a set of rows summarizing the columns of the table.
			 */
			tfoot: Hurx.Elements.TableContent.TFoot
			/**
			 * Defines a cell as a header of a group of table cells. The exact nature of this group is defined by the scope and headers attributes.
			 */
			th: Hurx.Elements.TableContent.TH
			/**
			 * Defines a set of rows defining the head of the columns of the table.
			 */
			thead: Hurx.Elements.TableContent.THead
			/**
			 * Defines a row of cells in a table. The row's cells can then be established using a mix of <td> (data cell) and <th> (header cell) elements.
			 */
			tr: Hurx.Elements.TableContent.TR
			/**
			 * An interactive element activated by a user with a mouse, keyboard, finger, voice command, or other assistive technology. Once activated, it performs an action, such as submitting a form or opening a dialog.
			 */
			button: Hurx.Elements.Forms.Button
			/**
			 * Contains a set of <option> elements that represent the permissible or recommended options available to choose from within other controls.
			 */
			datalist: Hurx.Elements.Forms.Datalist
			/**
			 * Used to group several controls as well as labels (<label>) within a web form.
			 */
			fieldset: Hurx.Elements.Forms.Fieldset
			/**
			 * Represents a document section containing interactive controls for submitting information.
			 */
			form: Hurx.Elements.Forms.Form
			/**
			 * Used to create interactive controls for web-based forms to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent. The <input> element is one of the most powerful and complex in all of HTML due to the sheer number of combinations of input types and attributes.
			 */
			input: Hurx.Elements.Forms.Input
			/**
			 * Represents a caption for an item in a user interface.
			 */
			label: Hurx.Elements.Forms.Label
			/**
			 * Represents a caption for the content of its parent <fieldset>.
			 */
			legend: Hurx.Elements.Forms.Legend
			/**
			 * Represents either a scalar value within a known range or a fractional value.
			 */
			meter: Hurx.Elements.Forms.Meter
			/**
			 * Creates a grouping of options within a <select> element.
			 */
			optgroup: Hurx.Elements.Forms.Optgroup
			/**
			 * Used to define an item contained in a select, an <optgroup>, or a <datalist> element. As such, <option> can represent menu items in popups and other lists of items in an HTML document.
			 */
			option: Hurx.Elements.Forms.Option
			/**
			 * Container element into which a site or app can inject the results of a calculation or the outcome of a user action.
			 */
			output: Hurx.Elements.Forms.Output
			/**
			 * Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.
			 */
			progress: Hurx.Elements.Forms.Progress
			/**
			 * Represents a control that provides a menu of options.
			 */
			select: Hurx.Elements.Forms.Select
			/**
			 * Represents a multi-line plain-text editing control, useful when you want to allow users to enter a sizeable amount of free-form text, for example, a comment on a review or feedback form.
			 */
			textarea: Hurx.Elements.Forms.Textarea
			/**
			 * Creates a disclosure widget in which information is visible only when the widget is toggled into an "open" state. A summary or label must be provided using the <summary> element.
			 */
			details: Hurx.Elements.Interactive.Details
			/**
			 * Represents a dialog box or other interactive component, such as a dismissible alert, inspector, or subwindow.
			 */
			dialog: Hurx.Elements.Interactive.Dialog
			/**
			 * Specifies a summary, caption, or legend for a details element's disclosure box. Clicking the <summary> element toggles the state of the parent <details> element open and closed.
			 */
			summary: Hurx.Elements.Interactive.Summary
		}

		/**
		 * This interface defines the shape of a class or constructor for JSX elements.
		 */
		interface ElementClass extends Component {}

		/**
		 * This interface specifies that the "props" property is used to pass attributes to JSX elements.
		 */
		interface ElementAttributesProperty {
			props: {}
		}

		/**
		 * This interface allows you to add any custom attributes you want to support in JSX elements.
		 * TODO: Add all HTML properties like react has
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
			class?: string | Record<string, boolean>
		}
	}
	/**
	 * Hurx elements for JSX
	 */
	declare namespace Hurx {
		/**
		 * TODO: 
		 * This namespace contains interfaces for all HTML elements
		 */
		namespace Elements {
			interface Element<T extends HTMLElement> {
				// Any property
				[key: string]: any

				// GLobal properties
				// TODO: 

				// Aria
				// TODO:

				// Event handlers
				// TODO:
				onAbort?: (event: Hurx.Events.AbortEvent<T>) => any
				onAutoComplete?: (event: Hurx.Events.AutoCompleteEvent<T>) => any
				onAutoCompleteError?: (event: Hurx.Events.AutoCompleteErrorEvent<T>) => any
				onBlur?: (event: Hurx.Events.BlurEvent<T>) => any
				onCancel?: (event: Hurx.Events.CancelEvent<T>) => any
				onCanPlay?: (event: Hurx.Events.CanPlayEvent<T>) => any
				onCanPlayThrough?: (event: Hurx.Events.CanPlayThroughEvent<T>) => any
				onChange?: (event: Hurx.Events.ChangeEvent<T>) => any
				onClick?: (event: Hurx.Events.ClickEvent<T>) => any
				onClose?: (event: Hurx.Events.CloseEvent<T>) => any
				onContextMenu?: (event: Hurx.Events.ContextMenuEvent<T>) => any
				onCueChange?: (event: Hurx.Events.CueChangeEvent<T>) => any
				onDBLCLick?: (event: Hurx.Events.DBLCLickEvent<T>) => any
				onDrag?: (event: Hurx.Events.DragEvent<T>) => any
				onDragEnd?: (event: Hurx.Events.DragEndEvent<T>) => any
				onDragEnter?: (event: Hurx.Events.DragEnterEvent<T>) => any
				onDragLeave?: (event: Hurx.Events.DragLeaveEvent<T>) => any
				onDragOver?: (event: Hurx.Events.DragOverEvent<T>) => any
				onDragStart?: (event: Hurx.Events.DragStartEvent<T>) => any
				onDrop?: (event: Hurx.Events.DropEvent<T>) => any
				onDurationChange?: (event: Hurx.Events.DurationChangeEvent<T>) => any
				onEmptied?: (event: Hurx.Events.EmptiedEvent<T>) => any
				onEnded?: (event: Hurx.Events.EndedEvent<T>) => any
				onError?: (event: Hurx.Events.ErrorEvent<T>) => any
				onFocus?: (event: Hurx.Events.FocusEvent<T>) => any
				onInput?: (event: Hurx.Events.InputEvent<T>) => any
				onInvalid?: (event: Hurx.Events.InvalidEvent<T>) => any
				onKeyDown?: (event: Hurx.Events.KeyDownEvent<T>) => any
				onKeyPress?: (event: Hurx.Events.KeyPressEvent<T>) => any
				onKeyUp?: (event: Hurx.Events.KeyUpEvent<T>) => any
				onLoad?: (event: Hurx.Events.LoadEvent<T>) => any
				onLoadedData?: (event: Hurx.Events.LoadedDataEvent<T>) => any
				onLoadedMetadata?: (event: Hurx.Events.LoadedMetadataEvent<T>) => any
				onLoadStart?: (event: Hurx.Events.LoadStartEvent<T>) => any
				onMouseDown?: (event: Hurx.Events.MouseDownEvent<T>) => any
				onMouseEnter?: (event: Hurx.Events.MouseEnterEvent<T>) => any
				onMouseLeave?: (event: Hurx.Events.MouseLeaveEvent<T>) => any
				onMouseMove?: (event: Hurx.Events.MouseMoveEvent<T>) => any
				onMouseOut?: (event: Hurx.Events.MouseOutEvent<T>) => any
				onMouseOver?: (event: Hurx.Events.MouseOverEvent<T>) => any
				onMouseUp?: (event: Hurx.Events.MouseUpEvent<T>) => any
				onMouseDown?: (event: Hurx.Events.MouseDownEvent<T>) => any
				onMouseEnter?: (event: Hurx.Events.MouseEnterEvent<T>) => any
				onMouseLeave?: (event: Hurx.Events.MouseLeaveEvent<T>) => any
				onMouseMove?: (event: Hurx.Events.MouseMoveEvent<T>) => any
				onMouseOut?: (event: Hurx.Events.MouseOutEvent<T>) => any
				onMouseOver?: (event: Hurx.Events.MouseOverEvent<T>) => any
				onMouseUp?: (event: Hurx.Events.MouseUpEvent<T>) => any
				onMouseWheel?: (event: Hurx.Events.MouseWheelEvent<T>) => any
				onPause?: (event: Hurx.Events.PauseEvent<T>) => any
				onPlay?: (event: Hurx.Events.PlayEvent<T>) => any
				onPlaying?: (event: Hurx.Events.PlayingEvent<T>) => any
				onProgress?: (event: Hurx.Events.ProgressEvent<T>) => any
				onRateChange?: (event: Hurx.Events.RateChangeEvent<T>) => any
				onReset?: (event: Hurx.Events.ResetEvent<T>) => any
				onResize?: (event: Hurx.Events.ResizeEvent<T>) => any
				onScroll?: (event: Hurx.Events.ScrollEvent<T>) => any
				onSeeked?: (event: Hurx.Events.SeekedEvent<T>) => any
				onSeeking?: (event: Hurx.Events.SeekingEvent<T>) => any
				onSelect?: (event: Hurx.Events.SelectEvent<T>) => any
				onShow?: (event: Hurx.Events.ShowEvent<T>) => any
				onSort?: (event: Hurx.Events.SortEvent<T>) => any
				onStalled?: (event: Hurx.Events.StalledEvent<T>) => any
				onSubmit?: (event: Hurx.Events.SubmitEvent<T>) => any
				onSuspend?: (event: Hurx.Events.SuspendEvent<T>) => any
				onTimeUpdate?: (event: Hurx.Events.TimeUpdateEvent<T>) => any
				onToggle?: (event: Hurx.Events.ToggleEvent<T>) => any
				onVolumeChange?: (event: Hurx.Events.VolumeChangeEvent<T>) => any
				onWaiting?: (event: Hurx.Events.WaitingEvent<T>) => any
			}
			/**
			 * Represents the root (top-level element) of an HTML document, so it is also referred to as the root element. All other elements must be descendants of this element.
			 */
			interface HTML extends Element<HTMLHtmlElement> {}
			/**
			 * Metadata contains information about the page.
			 * This includes information about styles, scripts and data to help software (search engines, browsers, etc.) use and render the page.
			 * Metadata for styles and scripts may be defined in the page or linked to another file that has the information.
			 */
			namespace Metadata {
				interface Element<T extends HTMLElement> extends Elements.Element<T> {}
				/**
				 * Specifies the base URL to use for all relative URLs in a document. There can be only one such element in a document.
				 */
				interface Base extends Element<HTMLBaseElement> {}
				/**
				 * Contains machine-readable information (metadata) about the document, like its title, scripts, and style sheets.
				 */
				interface Head extends Element<HTMLHeadElement> {}
				/**
				 * Specifies relationships between the current document and an external resource. This element is most commonly used to link to CSS but is also used to establish site icons (both "favicon" style icons and icons for the home screen and apps on mobile devices) among other things.
				 */
				interface Link extends Element<HTMLLinkElement> {}
				/**
				 * Represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> and <title>.
				 */
				interface Meta extends Element<HTMLMetaElement> {}
				/**
				 * Contains style information for a document or part of a document. It contains CSS, which is applied to the contents of the document containing this element.
				 */
				interface Style extends Element<HTMLStyleElement> {}
				/**
				 * Defines the document's title that is shown in a browser's title bar or a page's tab. It only contains text; tags within the element are ignored.
				 */
				interface Title extends Element<HTMLTitleElement> {}
				/**
				 * represents the content of an HTML document. There can be only one such element in a document.
				 */
				interface Body extends Element<HTMLBodyElement> {}
			}
			/**
			 * Content sectioning elements allow you to organize the document content into logical pieces. Use the sectioning elements to create a broad outline for your page content, including header and footer navigation, and heading elements to identify sections of content.
			 */
			namespace ContentSectioning {
				interface Element<T extends HTMLElement> extends Elements.Element<T> {}
				/**
				 * Indicates that the enclosed HTML provides contact information for a person or people, or for an organization.
				 */
				interface Address extends Element<HTMLElement> {}
				/**
				 * Represents a self-contained composition in a document, page, application, or site, which is intended to be independently distributable or reusable (e.g., in syndication). Examples include a forum post, a magazine or newspaper article, a blog entry, a product card, a user-submitted comment, an interactive widget or gadget, or any other independent item of content.
				 */
				interface Article extends Element<HTMLElement> {}
				/**
				 * Represents a portion of a document whose content is only indirectly related to the document's main content. Asides are frequently presented as sidebars or call-out boxes.
				 */
				interface Aside extends Element<HTMLElement> {}
				/**
				 * Represents a footer for its nearest ancestor sectioning content or sectioning root element. A <footer> typically contains information about the author of the section, copyright data, or links to related documents.
				 */
				interface Footer extends Element<HTMLElement> {}
				/**
				 * Represents introductory content, typically a group of introductory or navigational aids. It may contain some heading elements but also a logo, a search form, an author name, and other elements.
				 */
				interface Header extends Element<HTMLElement> {}
				/**
				 * Represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.
				 */
				interface H1 extends Element<HTMLHeadingElement> {}
				/**
				 * Represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.
				 */
				interface H2 extends Element<HTMLHeadingElement> {}
				/**
				 * Represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.
				 */
				interface H3 extends Element<HTMLHeadingElement> {}
				/**
				 * Represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.
				 */
				interface H4 extends Element<HTMLHeadingElement> {}
				/**
				 * Represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.
				 */
				interface H5 extends Element<HTMLHeadingElement> {}
				/**
				 * Represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.
				 */
				interface H6 extends Element<HTMLHeadingElement> {}
				/**
				 * Represents a heading grouped with any secondary content, such as subheadings, an alternative title, or a tagline.
				 */
				interface HGroup extends Element<HTMLElement> {}
				/**
				 * Represents the dominant content of the body of a document. The main content area consists of content that is directly related to or expands upon the central topic of a document, or the central functionality of an application.
				 */
				interface Main extends Element<HTMLElement> {}
				/**
				 * Represents a section of a page whose purpose is to provide navigation links, either within the current document or to other documents. Common examples of navigation sections are menus, tables of contents, and indexes.
				 */
				interface Nav extends Element<HTMLElement> {}
				/**
				 * Represents a generic standalone section of a document, which doesn't have a more specific semantic element to represent it. Sections should always have a heading, with very few exceptions.
				 */
				interface Section extends Element<HTMLElement> {}
				/**
				 * Represents a part that contains a set of form controls or other content related to performing a search or filtering operation.
				 */
				interface Search extends Element<HTMLElement> {}
			}
			/**
			 * Use HTML text content elements to organize blocks or sections of content placed between the opening <body> and closing </body> tags. Important for accessibility and SEO, these elements identify the purpose or structure of that content.
			 */
			namespace TextContent {
				interface Element<T extends HTMLElement> extends Elements.Element<T> {}
				/**
				 * Indicates that the enclosed text is an extended quotation. Usually, this is rendered visually by indentation. A URL for the source of the quotation may be given using the cite attribute, while a text representation of the source can be given using the <cite> element.
				 */
				interface Blockquote extends Element<HTMLElement> {}
				/**
				 * Provides the description, definition, or value for the preceding term (<dt>) in a description list (<dl>).
				 */
				interface DD extends Element<HTMLElement> {}
				/**
				 * The generic container for flow content. It has no effect on the content or layout until styled in some way using CSS (e.g., styling is directly applied to it, or some kind of layout model like flexbox is applied to its parent element).
				 */
				interface Div extends Element<HTMLDivElement> {}
				/**
				 * Represents a description list. The element encloses a list of groups of terms (specified using the <dt> element) and descriptions (provided by <dd> elements). Common uses for this element are to implement a glossary or to display metadata (a list of key-value pairs).
				 */
				interface DL extends Element<HTMLElement> {}
				/**
				 * Specifies a term in a description or definition list, and as such must be used inside a <dl> element. It is usually followed by a <dd> element; however, multiple <dt> elements in a row indicate several terms that are all defined by the immediate next <dd> element.
				 */
				interface DT extends Element<HTMLElement> {}
				/**
				 * Represents a caption or legend describing the rest of the contents of its parent <figure> element.
				 */
				interface Figcaption extends Element<HTMLElement> {}
				/**
				 * Represents self-contained content, potentially with an optional caption, which is specified using the <figcaption> element. The figure, its caption, and its contents are referenced as a single unit.
				 */
				interface Figure extends Element<HTMLElement> {}
				/**
				 * Represents a thematic break between paragraph-level elements: for example, a change of scene in a story, or a shift of topic within a section.
				 */
				interface HR extends Element<HTMLHRElement> {}
				/**
				 * Represents an item in a list. It must be contained in a parent element: an ordered list (<ol>), an unordered list (<ul>), or a menu (<menu>). In menus and unordered lists, list items are usually displayed using bullet points. In ordered lists, they are usually displayed with an ascending counter on the left, such as a number or letter.
				 */
				interface LI extends Element<HTMLLIElement> {}
				/**
				 * A semantic alternative to <ul>, but treated by browsers (and exposed through the accessibility tree) as no different than <ul>. It represents an unordered list of items (which are represented by <li> elements).
				 */
				interface Menu extends Element<HTMLMenuElement> {}
				/**
				 * Represents an ordered list of items — typically rendered as a numbered list.
				 */
				interface OL extends Element<HTMLOListElement> {}
				/**
				 * Represents a paragraph. Paragraphs are usually represented in visual media as blocks of text separated from adjacent blocks by blank lines and/or first-line indentation, but HTML paragraphs can be any structural grouping of related content, such as images or form fields.
				 */
				interface P extends Element<HTMLParagraphElement> {}
				/**
				 * Represents preformatted text which is to be presented exactly as written in the HTML file. The text is typically rendered using a non-proportional, or monospaced, font. Whitespace inside this element is displayed as written.
				 */
				interface Pre extends Element<HTMLPreElement> {}
				/**
				 * Represents an unordered list of items, typically rendered as a bulleted list.
				 */
				interface UL extends Element<HTMLUListElement> {}
			}
			/**
			 * Use the HTML inline text semantic to define the meaning, structure, or style of a word, line, or any arbitrary piece of text.
			 */
			namespace InlineTextSemantics {
				interface Element<T extends HTMLElement> extends Elements.Element<T> {}
				/**
				 * Together with its href attribute, creates a hyperlink to web pages, files, email addresses, locations within the current page, or anything else a URL can address.
				 */
				interface A extends Element<HTMLAnchorElement> {}
				/**
				 * Represents an abbreviation or acronym.
				 */
				interface Abbr extends Element<HTMLElement> {}
				/**
				 * Used to draw the reader's attention to the element's contents, which are not otherwise granted special importance. This was formerly known as the Boldface element, and most browsers still draw the text in boldface. However, you should not use <b> for styling text or granting importance. If you wish to create boldface text, you should use the CSS font-weight property. If you wish to indicate an element is of special importance, you should use the strong element.
				 */
				interface B extends Element<HTMLElement> {}
				/**
				 * Tells the browser's bidirectional algorithm to treat the text it contains in isolation from its surrounding text. It's particularly useful when a website dynamically inserts some text and doesn't know the directionality of the text being inserted.
				 */
				interface BDI extends Element<HMTLElement> {}
				/**
				 * Overrides the current directionality of text, so that the text within is rendered in a different direction.
				 */
				interface BDO extends Element<HTMLElement> {}
				/**
				 * Produces a line break in text (carriage-return). It is useful for writing a poem or an address, where the division of lines is significant.
				 */
				interface BR extends Element<HTMLBRElement> {}
				/**
				 * Used to mark up the title of a cited creative work. The reference may be in an abbreviated form according to context-appropriate conventions related to citation metadata.
				 */
				interface Cite extends Element<HTMLElement> {}
				/**
				 * Displays its contents styled in a fashion intended to indicate that the text is a short fragment of computer code. By default, the content text is displayed using the user agent's default monospace font.
				 */
				interface Code extends Element<HTMLElement> {}
				/**
				 * Links a given piece of content with a machine-readable translation. If the content is time- or date-related, the<time> element must be used.
				 */
				interface Data extends Element<HTMLDataElement> {}
				/**
				 * Used to indicate the term being defined within the context of a definition phrase or sentence. The ancestor <p> element, the <dt>/<dd> pairing, or the nearest section ancestor of the <dfn> element, is considered to be the definition of the term.
				 */
				interface DFN extends Element<HTMLElement> {}
				/**
				 * Marks text that has stress emphasis. The <em> element can be nested, with each nesting level indicating a greater degree of emphasis.
				 */
				interface EM extends Element<HTMLElement> {}
				/**
				 * Represents a range of text that is set off from the normal text for some reason, such as idiomatic text, technical terms, and taxonomical designations, among others. Historically, these have been presented using italicized type, which is the original source of the <i> naming of this element.
				 */
				interface I extends Element<HTMLElement> {}
				/**
				 * Represents a span of inline text denoting textual user input from a keyboard, voice input, or any other text entry device. By convention, the user agent defaults to rendering the contents of a <kbd> element using its default monospace font, although this is not mandated by the HTML standard.
				 */
				interface KBD extends Element<HTMLElement> {}
				/**
				 * Represents text which is marked or highlighted for reference or notation purposes due to the marked passage's relevance in the enclosing context.
				 */
				interface Mark extends Element<HTMLElement> {}
				/**
				 * Indicates that the enclosed text is a short inline quotation. Most modern browsers implement this by surrounding the text in quotation marks. This element is intended for short quotations that don't require paragraph breaks; for long quotations use the <blockquote> element.
				 */
				interface Q extends Element<HTMLElement> {}
				/**
				 * Used to provide fall-back parentheses for browsers that do not support the display of ruby annotations using the <ruby> element. One <rp> element should enclose each of the opening and closing parentheses that wrap the <rt> element that contains the annotation's text.
				 */
				interface RP extends Element<HTMLElement> {}
				/**
				 * Specifies the ruby text component of a ruby annotation, which is used to provide pronunciation, translation, or transliteration information for East Asian typography. The <rt> element must always be contained within a <ruby> element.
				 */
				interface RT extends Element<HTMLElement> {}
				/**
				 * Represents small annotations that are rendered above, below, or next to base text, usually used for showing the pronunciation of East Asian characters. It can also be used for annotating other kinds of text, but this usage is less common.
				 */
				interface Ruby extends Element<HTMLElement> {}
				/**
				 * Renders text with a strikethrough, or a line through it. Use the <s> element to represent things that are no longer relevant or no longer accurate. However, <s> is not appropriate when indicating document edits; for that, use the del and ins elements, as appropriate.
				 */
				interface S extends Element<HTMLElement> {}
				/**
				 * Used to enclose inline text which represents sample (or quoted) output from a computer program. Its contents are typically rendered using the browser's default monospaced font (such as Courier or Lucida Console).
				 */
				interface Samp extends Element<HTMLElement> {}
				/**
				 * Represents side-comments and small print, like copyright and legal text, independent of its styled presentation. By default, it renders text within it one font size smaller, such as from small to x-small.
				 */
				interface Small extends Element<HTMLElement> {}
				/**
				 * A generic inline container for phrasing content, which does not inherently represent anything. It can be used to group elements for styling purposes (using the class or id attributes), or because they share attribute values, such as lang. It should be used only when no other semantic element is appropriate. <span> is very much like a div element, but div is a block-level element whereas a <span> is an inline-level element.
				 */
				interface Span extends Element<HTMLSpanElement> {}
				/**
				 * Indicates that its contents have strong importance, seriousness, or urgency. Browsers typically render the contents in bold type.
				 */
				interface Strong extends Element<HTMLElement> {}
				/**
				 * Specifies inline text which should be displayed as subscript for solely typographical reasons. Subscripts are typically rendered with a lowered baseline using smaller text.
				 */
				interface Sub extends Element<HTMLElement> {}
				/**
				 * Specifies inline text which is to be displayed as superscript for solely typographical reasons. Superscripts are usually rendered with a raised baseline using smaller text.
				 */
				interface Sup extends Element<HTMLElement> {}
				/**
				 * Represents a specific period in time. It may include the datetime attribute to translate dates into machine-readable format, allowing for better search engine results or custom features such as reminders.
				 */
				interface Time extends Element<HTMLTimeElement> {}
				/**
				 * Represents a span of inline text which should be rendered in a way that indicates that it has a non-textual annotation. This is rendered by default as a simple solid underline but may be altered using CSS.
				 */
				interface U extends Element<HTMLElement> {}
				/**
				 * Represents the name of a variable in a mathematical expression or a programming context. It's typically presented using an italicized version of the current typeface, although that behavior is browser-dependent.
				 */
				interface Var extends Element<HTMLElement> {}
				/**
				 * Represents a word break opportunity—a position within text where the browser may optionally break a line, though its line-breaking rules would not otherwise create a break at that location.
				 */
				interface WBR extends Element<HTMLElement> {}
			}
			/**
			 * HTML supports various multimedia resources such as images, audio, and video.
			 */
			namespace ImageAndMultimedia {
				interface Element<T extends HTMLElement> extends Elements.Element<T> {}
				/**
				 * Defines an area inside an image map that has predefined clickable areas. An image map allows geometric areas on an image to be associated with hyperlink.
				 */
				interface Area extends Element<HTMLAreaElement> {}
				/**
				 * Used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the source element: the browser will choose the most suitable one. It can also be the destination for streamed media, using a MediaStream.
				 */
				interface Audio extends Element<HTMLAudioElement> {}
				/**
				 * Embeds an image into the document.
				 */
				interface Img extends Element<HTMLImageElement> {}
				/**
				 * Used with <area> elements to define an image map (a clickable link area).
				 */
				interface Map extends Element<HTMLMapElement> {}
				/**
				 * Used as a child of the media elements, audio and video. It lets you specify timed text tracks (or time-based data), for example to automatically handle subtitles. The tracks are formatted in WebVTT format (.vtt files)—Web Video Text Tracks.
				 */
				interface Track extends Element<HTMLTrackElement> {}
				/**
				 * Embeds a media player which supports video playback into the document. You can also use <video> for audio content, but the audio element may provide a more appropriate user experience.
				 */
				interface Video extends Element<HTMLVideoElement> {}
			}
			/**
			 * In addition to regular multimedia content, HTML can include a variety of other content, even if it's not always easy to interact with.
			 */
			namespace EmbeddedContent {
				interface Element<T extends HTMLElement> extends Elements.Element<T> {}
				/**
				 * Embeds external content at the specified point in the document. This content is provided by an external application or other source of interactive content such as a browser plug-in.
				 */
				interface Embed extends Element<HTMLEmbedElement> {}
				/**
				 * Represents a nested browsing context, embedding another HTML page into the current one.
				 */
				interface Iframe extends Element<HTMLIFrameElement> {}
				/**
				 * Represents an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin.
				 */
				interface Object extends Element<HTMLObjectElement> {}
				/**
				 * Contains zero or more <source> elements and one <img> element to offer alternative versions of an image for different display/device scenarios.
				 */
				interface Picture extends Element<HTMLPictureElement> {}
				/**
				 * Enables the embedding of another HTML page into the current one to enable smoother navigation into new pages.
				 */
				interface Portal extends Element<HTMLElement> {}
				/**
				 * Specifies multiple media resources for the picture, the audio element, or the video element. It is a void element, meaning that it has no content and does not have a closing tag. It is commonly used to offer the same media content in multiple file formats in order to provide compatibility with a broad range of browsers given their differing support for image file formats and media file formats.
				 */
				interface Source extends Element<HTMLSourceElement> {}
			}
			/**
			 * You can embed SVG and MathML content directly into HTML documents, using the <svg> and <math> elements.
			 */
			namespace SVGAndMathML {
				interface Element<T extends HTMLElement> extends Elements.Element<T> {}
				/**
				 * Container defining a new coordinate system and viewport. It is used as the outermost element of SVG documents, but it can also be used to embed an SVG fragment inside an SVG or HTML document.
				 */
				interface SVG extends Element<SVGElement> {}
				/**
				 * The top-level element in MathML. Every valid MathML instance must be wrapped in it. In addition, you must not nest a second <math> element in another, but you can have an arbitrary number of other child elements in it.
				 */
				interface Math extends Element<MathMLElement> {}
			}
			/**
			 * To create dynamic content and Web applications, HTML supports the use of scripting languages, most prominently JavaScript. Certain elements support this capability.
			 */
			namespace Scripting {
				interface Element<T extends HTMLElement> extends Elements.Element<T> {}
				/**
				 * Container element to use with either the canvas scripting API or the WebGL API to draw graphics and animations.
				 */
				interface Canvas extends Element<HTMLCanvasElement> {}
				/**
				 * Defines a section of HTML to be inserted if a script type on the page is unsupported or if scripting is currently turned off in the browser.
				 */
				interface Noscript extends Element<HTMLNoscriptElement> {}
				/**
				 * Used to embed executable code or data; this is typically used to embed or refer to JavaScript code. The <script> element can also be used with other languages, such as WebGL's GLSL shader programming language and JSON.
				 */
				interface Script extends Element<HTMLScriptElement> {}
			}
			/**
			 * These elements let you provide indications that specific parts of the text have been altered.
			 */
			namespace DemarcatingEdits {
				interface Element<T extends HTMLElement> extends Elements.Element<T> {}
				/**
				 * Represents a range of text that has been deleted from a document. This can be used when rendering "track changes" or source code diff information, for example. The <ins> element can be used for the opposite purpose: to indicate text that has been added to the document.
				 */
				interface Del extends Element<HTMLElement> {}
				/**
				 * Represents a range of text that has been added to a document. You can use the <del> element to similarly represent a range of text that has been deleted from the document.
				 */
				interface Ins extends Element<HTMLElement> {}
			}
			/**
			 * The elements here are used to create and handle tabular data.
			 */
			namespace TableContent {
				interface Element<T extends HTMLElement> extends Elements.Element<T> {}
				/**
				 * Specifies the caption (or title) of a table.
				 */
				interface Caption extends Element<HTMLTableCaptionElement> {}
				/**
				 * Defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.
				 */
				interface Col extends Element<HTMLTableColElement> {}
				/**
				 * Defines a group of columns within a table.
				 */
				interface Colgroup extends Element<HTMLElement> {}
				/**
				 * Represents tabular data — that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data.
				 */
				interface Table extends Element<HTMLTableElement> {}
				/**
				 * Encapsulates a set of table rows (<tr> elements), indicating that they comprise the body of the table (<table>).
				 */
				interface TBody extends Element<HTMLElement> {}
				/**
				 * Defines a cell of a table that contains data. It participates in the table model.
				 */
				interface TD extends Element<HTMLElement> {}
				/**
				 * Defines a set of rows summarizing the columns of the table.
				 */
				interface TFoot extends Element<HTMLElement> {}
				/**
				 * Defines a cell as a header of a group of table cells. The exact nature of this group is defined by the scope and headers attributes.
				 */
				interface TH extends Element<HTMLElement> {}
				/**
				 * Defines a set of rows defining the head of the columns of the table.
				 */
				interface THead extends Element<HTMLElement> {}
				/**
				 * Defines a row of cells in a table. The row's cells can then be established using a mix of <td> (data cell) and <th> (header cell) elements.
				 */
				interface TR extends Element<HTMLTableRowElement> {}
			}
			/**
			 * HTML provides several elements that can be used together to create forms that the user can fill out and submit to the website or application. Further information about this available in the HTML forms guide.
			 */
			namespace Forms {
				interface Element<T extends HTMLElement> extends Elements.Element<T> {}
				/**
				 * An interactive element activated by a user with a mouse, keyboard, finger, voice command, or other assistive technology. Once activated, it performs an action, such as submitting a form or opening a dialog.
				 */
				interface Button extends Element<HTMLButtonElement> {}
				/**
				 * Contains a set of <option> elements that represent the permissible or recommended options available to choose from within other controls.
				 */
				interface Datalist extends Element<HTMLDataListElement> {}
				/**
				 * Used to group several controls as well as labels (<label>) within a web form.
				 */
				interface Fieldset extends Element<HTMLFieldSetElement> {}
				/**
				 * Represents a document section containing interactive controls for submitting information.
				 */
				interface Form extends Element<HTMLFormElement> {}
				/**
				 * Used to create interactive controls for web-based forms to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent. The <input> element is one of the most powerful and complex in all of HTML due to the sheer number of combinations of input types and attributes.
				 */
				interface Input extends Element<HTMLInputElement> {}
				/**
				 * Represents a caption for an item in a user interface.
				 */
				interface Label extends Element<HTMLLabelElement> {}
				/**
				 * Represents a caption for the content of its parent <fieldset>.
				 */
				interface Legend extends Element<HTMLLegendElement> {}
				/**
				 * Represents either a scalar value within a known range or a fractional value.
				 */
				interface Meter extends Element<HTMLMeterElement> {}
				/**
				 * Creates a grouping of options within a <select> element.
				 */
				interface Optgroup extends Element<HTMLOptGroupElement> {}
				/**
				 * Used to define an item contained in a select, an <optgroup>, or a <datalist> element. As such, <option> can represent menu items in popups and other lists of items in an HTML document.
				 */
				interface Option extends Element<HTMLOptionElement> {}
				/**
				 * Container element into which a site or app can inject the results of a calculation or the outcome of a user action.
				 */
				interface Output extends Element<HTMLOutputElement> {}
				/**
				 * Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.
				 */
				interface Progress extends Element<HTMLProgressElement> {}
				/**
				 * Represents a control that provides a menu of options.
				 */
				interface Select extends Element<HTMLSelectElement> {}
				/**
				 * Represents a multi-line plain-text editing control, useful when you want to allow users to enter a sizeable amount of free-form text, for example, a comment on a review or feedback form.
				 */
				interface Textarea extends Element<HTMLTextAreaElement> {}
			}
			/**
			 * HTML offers a selection of elements that help to create interactive user interface objects.
			 */
			namespace Interactive {
				interface Element<T extends HTMLElement> extends Elements.Element<T> {}
				/**
				 * Creates a disclosure widget in which information is visible only when the widget is toggled into an "open" state. A summary or label must be provided using the <summary> element.
				 */
				interface Details extends Element<HTMLDetailsElement> {}
				/**
				 * Represents a dialog box or other interactive component, such as a dismissible alert, inspector, or subwindow.
				 */
				interface Dialog extends Element<HTMLDialogElement> {}
				/**
				 * Specifies a summary, caption, or legend for a details element's disclosure box. Clicking the <summary> element toggles the state of the parent <details> element open and closed.
				 */
				interface Summary extends Element<HTMLElement> {}
			}
		}
		/**
		 * This namespace contains all html events
		 */
		namespace Events {
			interface Event<Type extends string, T extends HTMLElement> {
				/**
				 * The type of event
				 */
				readonly type: Type
				/**
				 * A reference to the DOM element that triggered the event. It represents the element on which the event occurred.
				 */
				readonly target: HTMLElement
				/**
				 *  A reference to the DOM element to which the event listener is attached. It may differ from the target if the event is bubbling up through the DOM tree.
				 */
				readonly currentTarget: T
				/**
				 * A boolean value indicating whether the event bubbles up through the DOM tree. It is true if the event bubbles and false if it doesn't.
				 */
				readonly bubbles: boolean
				/**
				 * A boolean value indicating whether the event can be canceled using the preventDefault() method. It is true if the event can be canceled and false if it cannot.
				 */
				readonly cancelable: boolean
				/**
				 * A timestamp representing the time at which the event was created, in milliseconds since the epoch.
				 */
				readonly timeStamp: number
				/**
				 * An integer indicating the current phase of the event flow. It can be one of the following values:
				 * - Event.NONE (0): No phase.
				 * - Event.CAPTURING_PHASE (1): The event is in the capturing phase.
				 * - Event.AT_TARGET (2): The event is in the target phase.
				 * - Event.BUBBLING_PHASE (3): The event is in the bubbling phase.
				 */
				readonly eventPhase: 0 | 1 | 2 | 3
				readonly preventDefault(): void
				readonly stopPropagation(): void
			}
			interface AbortEvent<T extends HTMLElement> extends Event<T> {}
			interface AutoCompleteEvent<T extends HTMLElement> extends Event<T> {}
			interface AutoCompleteErrorEvent<T extends HTMLElement> extends Event<T> {}
			interface BlurEvent<T extends HTMLElement> extends Event<T> {}
			interface CancelEvent<T extends HTMLElement> extends Event<T> {}
			interface CanPlayEvent<T extends HTMLElement> extends Event<T> {}
			interface CanPlayThroughEvent<T extends HTMLElement> extends Event<T> {}
			interface ChangeEvent<T extends HTMLElement> extends Event<T> {}
			interface ClickEvent<T extends HTMLElement> extends Event<T> {}
			interface CloseEvent<T extends HTMLElement> extends Event<T> {}
			interface ContextMenuEvent<T extends HTMLElement> extends Event<T> {}
			interface CueChangeEvent<T extends HTMLElement> extends Event<T> {}
			interface DBLCLickEvent<T extends HTMLElement> extends Event<T> {}
			interface DragEvent<T extends HTMLElement> extends Event<T> {}
			interface DragEndEvent<T extends HTMLElement> extends Event<T> {}
			interface DragEnterEvent<T extends HTMLElement> extends Event<T> {}
			interface DragLeaveEvent<T extends HTMLElement> extends Event<T> {}
			interface DragOverEvent<T extends HTMLElement> extends Event<T> {}
			interface DragStartEvent<T extends HTMLElement> extends Event<T> {}
			interface DropEvent<T extends HTMLElement> extends Event<T> {}
			interface DurationChangeEvent<T extends HTMLElement> extends Event<T> {}
			interface EmptiedEvent<T extends HTMLElement> extends Event<T> {}
			interface EndedEvent<T extends HTMLElement> extends Event<T> {}
			interface ErrorEvent<T extends HTMLElement> extends Event<T> {}
			interface FocusEvent<T extends HTMLElement> extends Event<T> {}
			interface InputEvent<T extends HTMLElement> extends Event<T> {}
			interface InvalidEvent<T extends HTMLElement> extends Event<T> {}
			interface KeyDownEvent<T extends HTMLElement> extends Event<T> {}
			interface KeyPressEvent<T extends HTMLElement> extends Event<T> {}
			interface KeyUpEvent<T extends HTMLElement> extends Event<T> {}
			interface LoadEvent<T extends HTMLElement> extends Event<T> {}
			interface LoadedDataEvent<T extends HTMLElement> extends Event<T> {}
			interface LoadedMetadataEvent<T extends HTMLElement> extends Event<T> {}
			interface LoadStartEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseDownEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseEnterEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseLeaveEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseMoveEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseOutEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseOverEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseUpEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseDownEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseEnterEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseLeaveEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseMoveEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseOutEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseOverEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseUpEvent<T extends HTMLElement> extends Event<T> {}
			interface MouseWheelEvent<T extends HTMLElement> extends Event<T> {}
			interface PauseEvent<T extends HTMLElement> extends Event<T> {}
			interface PlayEvent<T extends HTMLElement> extends Event<T> {}
			interface PlayingEvent<T extends HTMLElement> extends Event<T> {}
			interface ProgressEvent<T extends HTMLElement> extends Event<T> {}
			interface RateChangeEvent<T extends HTMLElement> extends Event<T> {}
			interface ResetEvent<T extends HTMLElement> extends Event<T> {}
			interface ResizeEvent<T extends HTMLElement> extends Event<T> {}
			interface ScrollEvent<T extends HTMLElement> extends Event<T> {}
			interface SeekedEvent<T extends HTMLElement> extends Event<T> {}
			interface SeekingEvent<T extends HTMLElement> extends Event<T> {}
			interface SelectEvent<T extends HTMLElement> extends Event<T> {}
			interface ShowEvent<T extends HTMLElement> extends Event<T> {}
			interface SortEvent<T extends HTMLElement> extends Event<T> {}
			interface StalledEvent<T extends HTMLElement> extends Event<T> {}
			interface SubmitEvent<T extends HTMLElement> extends Event<T> {}
			interface SuspendEvent<T extends HTMLElement> extends Event<T> {}
			interface TimeUpdateEvent<T extends HTMLElement> extends Event<T> {}
			interface ToggleEvent<T extends HTMLElement> extends Event<T> {}
			interface VolumeChangeEvent<T extends HTMLElement> extends Event<T> {}
			interface WaitingEvent<T extends HTMLElement> extends Event<T> {}
		}
	}
}
