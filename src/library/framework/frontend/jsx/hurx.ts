import CSS from 'csstype'

/**
 * Hurx elements for JSX
 * TODO: attributes per element
 * TODO: events per element
 * TODO: add detailed jsdocs to events
 * TODO: make sure all attributes are optional for all elements
 * TODO: check all HTMLElement types in the interfaces generics
 * TODO: convert all attributes to upper camel case
 */
export namespace Hurx {
    /**
     * All the different attributes
     */
    export type Attributes = Hurx.Elements.HTML
        | Hurx.Elements.Metadata.Base
        | Hurx.Elements.Metadata.Head
        | Hurx.Elements.Metadata.Link
        | Hurx.Elements.Metadata.Meta
        | Hurx.Elements.Metadata.Style
        | Hurx.Elements.Metadata.Title
        | Hurx.Elements.SectioningRoot.Body
        | Hurx.Elements.ContentSectioning.Address
        | Hurx.Elements.ContentSectioning.Article
        | Hurx.Elements.ContentSectioning.Aside
        | Hurx.Elements.ContentSectioning.Footer
        | Hurx.Elements.ContentSectioning.Header
        | Hurx.Elements.ContentSectioning.H1
        | Hurx.Elements.ContentSectioning.H2
        | Hurx.Elements.ContentSectioning.H3
        | Hurx.Elements.ContentSectioning.H4
        | Hurx.Elements.ContentSectioning.H5
        | Hurx.Elements.ContentSectioning.H6
        | Hurx.Elements.ContentSectioning.HGroup
        | Hurx.Elements.ContentSectioning.Main
        | Hurx.Elements.ContentSectioning.Nav
        | Hurx.Elements.ContentSectioning.Section
        | Hurx.Elements.ContentSectioning.Search
        | Hurx.Elements.TextContent.Blockquote
        | Hurx.Elements.TextContent.DD
        | Hurx.Elements.TextContent.Div
        | Hurx.Elements.TextContent.DL
        | Hurx.Elements.TextContent.DT
        | Hurx.Elements.TextContent.Figcaption
        | Hurx.Elements.TextContent.Figure
        | Hurx.Elements.TextContent.HR
        | Hurx.Elements.TextContent.LI
        | Hurx.Elements.TextContent.Menu
        | Hurx.Elements.TextContent.OL
        | Hurx.Elements.TextContent.P
        | Hurx.Elements.TextContent.Pre
        | Hurx.Elements.TextContent.UL
        | Hurx.Elements.InlineTextSemantics.A
        | Hurx.Elements.InlineTextSemantics.Abbr
        | Hurx.Elements.InlineTextSemantics.B
        | Hurx.Elements.InlineTextSemantics.BDI
        | Hurx.Elements.InlineTextSemantics.BDO
        | Hurx.Elements.InlineTextSemantics.BR
        | Hurx.Elements.InlineTextSemantics.Cite
        | Hurx.Elements.InlineTextSemantics.Code
        | Hurx.Elements.InlineTextSemantics.Data
        | Hurx.Elements.InlineTextSemantics.DFN
        | Hurx.Elements.InlineTextSemantics.EM
        | Hurx.Elements.InlineTextSemantics.I
        | Hurx.Elements.InlineTextSemantics.KBD
        | Hurx.Elements.InlineTextSemantics.Mark
        | Hurx.Elements.InlineTextSemantics.Q
        | Hurx.Elements.InlineTextSemantics.RP
        | Hurx.Elements.InlineTextSemantics.RT
        | Hurx.Elements.InlineTextSemantics.Ruby
        | Hurx.Elements.InlineTextSemantics.S
        | Hurx.Elements.InlineTextSemantics.Samp
        | Hurx.Elements.InlineTextSemantics.Small
        | Hurx.Elements.InlineTextSemantics.Span
        | Hurx.Elements.InlineTextSemantics.Strong
        | Hurx.Elements.InlineTextSemantics.Sub
        | Hurx.Elements.InlineTextSemantics.Sup
        | Hurx.Elements.InlineTextSemantics.Time
        | Hurx.Elements.InlineTextSemantics.U
        | Hurx.Elements.InlineTextSemantics.Var
        | Hurx.Elements.InlineTextSemantics.WBR
        | Hurx.Elements.ImageAndMultimedia.Area
        | Hurx.Elements.ImageAndMultimedia.Audio
        | Hurx.Elements.ImageAndMultimedia.Img
        | Hurx.Elements.ImageAndMultimedia.Map
        | Hurx.Elements.ImageAndMultimedia.Track
        | Hurx.Elements.ImageAndMultimedia.Video
        | Hurx.Elements.EmbeddedContent.Embed
        | Hurx.Elements.EmbeddedContent.IFrame
        | Hurx.Elements.EmbeddedContent.Object
        | Hurx.Elements.EmbeddedContent.Picture
        | Hurx.Elements.EmbeddedContent.Portal
        | Hurx.Elements.EmbeddedContent.Source
        // TODO: update
        | Hurx.Elements.SVGAndMathML.SVG
        // TODO: update
        | Hurx.Elements.SVGAndMathML.Math
        | Hurx.Elements.Scripting.Canvas
        | Hurx.Elements.Scripting.Noscript
        | Hurx.Elements.Scripting.Script
        | Hurx.Elements.DemarcatingEdits.Del
        | Hurx.Elements.DemarcatingEdits.Ins
        | Hurx.Elements.TableContent.Caption
        | Hurx.Elements.TableContent.Col
        | Hurx.Elements.TableContent.Colgroup
        | Hurx.Elements.TableContent.Table
        | Hurx.Elements.TableContent.TBody
        | Hurx.Elements.TableContent.TD
        | Hurx.Elements.TableContent.TFoot
        | Hurx.Elements.TableContent.TH
        | Hurx.Elements.TableContent.THead
        | Hurx.Elements.TableContent.TR
        | Hurx.Elements.Forms.Button
        | Hurx.Elements.Forms.Datalist
        | Hurx.Elements.Forms.Fieldset
        | Hurx.Elements.Forms.Form
        | Hurx.Elements.Forms.Input
        | Hurx.Elements.Forms.Label
        | Hurx.Elements.Forms.Legend
        | Hurx.Elements.Forms.Meter
        | Hurx.Elements.Forms.Optgroup
        | Hurx.Elements.Forms.Option
        | Hurx.Elements.Forms.Output
        | Hurx.Elements.Forms.Progress
        | Hurx.Elements.Forms.Select
        | Hurx.Elements.Forms.Textarea
        | Hurx.Elements.Interactive.Details
        | Hurx.Elements.Interactive.Dialog
        | Hurx.Elements.Interactive.Summary
    /**
     * Helper types to create the `Hurx` namespace's elements and events
     */
    export namespace Helpers {
        /**
         * A boolean or its string representation
         */
        export type Booleanish = Boolean | 'true' | 'false'
    }
    /**
     * This export namespace contains interfaces for all HTML elements
     */
    export namespace Elements {
        /**
		 * All the available JSX elements
		 */
		export interface IntrinsicElements {
			/**
			 * Potentially unsupported custom elements
			 */
			[elementName: string]: any
			/**
			 * Represents the root (top-level element) of an HTML document, so it is also referred to as the root element. All other elements must be descendants of this element.
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html}
			 */
			html?: Hurx.Elements.HTML
			/**
             * Specifies the base URL to use for all relative URLs in a document. There can be only one such element in a document.
             * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base}
             */
			base?: Hurx.Elements.Metadata.Base
			/**
             * Contains machine-readable information (metadata) about the document, like its `title`, `scripts`, and `style sheets`.
             * @see `title` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title}
             * @see `scripts` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script}
             * @see `style sheets` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style}
             * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head}
             */
			head?: Hurx.Elements.Metadata.Head
			/**
             * Specifies relationships between the current document and an external resource. This element is most commonly used to link to CSS but is also used to establish site icons (both "favicon" style icons and icons for the home screen and apps on mobile devices) among other things.
             * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link}
             */
			link?: Hurx.Elements.Metadata.Link
			/**
             * Represents `metadata` that cannot be represented by other HTML meta-related elements, like `<base>`, `<link>`, `<script>`, `<style>` and `<title>`.
             * @See `metadata` {@link https://developer.mozilla.org/en-US/docs/Glossary/Metadata}
             */
			meta?: Hurx.Elements.Metadata.Meta
			/**
             * Contains style information for a document or part of a document. It contains CSS, which is applied to the contents of the document containing this element.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style}
             */
			style?: Hurx.Elements.Metadata.Style
			/**
             * Defines the document's title that is shown in a `browser`'s title bar or a page's tab. It only contains text; tags within the element are ignored.
             * @See `browser` {@link https://developer.mozilla.org/en-US/docs/Glossary/Browser}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title}
             */
			title?: Hurx.Elements.Metadata.Title
			/**
             * Represents the content of an HTML document. There can be only one such element in a document.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body}
             */
			body?: Hurx.Elements.SectioningRoot.Body
			/**
             * Indicates that the enclosed HTML provides contact information for a person or people, or for an organization.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/address}
             */
			address?: Hurx.Elements.ContentSectioning.Address
			/**
             * Represents a self-contained composition in a document, page, application, or site, which is intended to be independently distributable or reusable (e.g., in syndication). Examples include a forum post, a magazine or newspaper article, a blog entry, a product card, a user-submitted comment, an interactive widget or gadget, or any other independent item of content.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article}
             */
			article?: Hurx.Elements.ContentSectioning.Article
            /**
             * Represents a portion of a document whose content is only indirectly related to the document's main content. Asides are frequently presented as sidebars or call-out boxes.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside}
             */
			aside?: Hurx.Elements.ContentSectioning.Aside
			/**
             * Represents a footer for its nearest ancestor `sectioning content` or `sectioning root` element. A `<footer>` typically contains information about the author of the section, copyright data, or links to related documents.
             * @See `sectioning content` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#sectioning_content}
             * @See `sectioning root` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer}
             */
			footer?: Hurx.Elements.ContentSectioning.Footer
			/**
             * Represents introductory content, typically a group of introductory or navigational aids. It may contain some heading elements but also a logo, a search form, an author name, and other elements.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header}
             */
			header?: Hurx.Elements.ContentSectioning.Header
			/**
             * Represent six levels of section headings. `<h1>` is the highest section level and `<h6>` is the lowest.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements}
             */
			h1?: Hurx.Elements.ContentSectioning.H1
			/**
             * Represent six levels of section headings. `<h1>` is the highest section level and `<h6>` is the lowest.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements}
             */
			h2?: Hurx.Elements.ContentSectioning.H2
			/**
             * Represent six levels of section headings. `<h1>` is the highest section level and `<h6>` is the lowest.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements}
             */
			h3?: Hurx.Elements.ContentSectioning.H3
			/**
             * Represent six levels of section headings. `<h1>` is the highest section level and `<h6>` is the lowest.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements}
             */
			h4?: Hurx.Elements.ContentSectioning.H4
			/**
             * Represent six levels of section headings. `<h1>` is the highest section level and `<h6>` is the lowest.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements}
             */
			h5?: Hurx.Elements.ContentSectioning.H5
			/**
             * Represent six levels of section headings. `<h1>` is the highest section level and `<h6>` is the lowest.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements}
             */
			h6?: Hurx.Elements.ContentSectioning.H6
			/**
			 * Represents a heading grouped with any secondary content, such as subheadings, an alternative title, or a tagline.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hgroup}
			 */
			hgroup?: Hurx.Elements.ContentSectioning.HGroup
			/**
			 * Represents the dominant content of the body of a document. The main content area consists of content that is directly related to or expands upon the central topic of a document, or the central functionality of an application.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main}
			 */
			main?: Hurx.Elements.ContentSectioning.Main
			/**
			 * Represents a section of a page whose purpose is to provide navigation links, either within the current document or to other documents. Common examples of navigation sections are menus, tables of contents, and indexes.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav}
			 */
			nav?: Hurx.Elements.ContentSectioning.Nav
			/**
			 * Represents a generic standalone section of a document, which doesn't have a more specific semantic element to represent it. Sections should always have a heading, with very few exceptions.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section}
			 */
			section?: Hurx.Elements.ContentSectioning.Section
			/**
			 * Represents a part that contains a set of form controls or other content related to performing a search or filtering operation.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/search}
			 */
			search?: Hurx.Elements.ContentSectioning.Search
			/**
             * Indicates that the enclosed text is an extended quotation. Usually, this is rendered visually by indentation. A URL for the source of the quotation may be given using the cite attribute, while a text representation of the source can be given using the <cite> element.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote}
             */
			blockquote?: Hurx.Elements.TextContent.Blockquote
			/**
             * Provides the description, definition, or value for the preceding term (`<dt>`) in a description list (`<dl>`).
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd}
             */
			dd?: Hurx.Elements.TextContent.DD
			/**
             * The generic container for flow content. It has no effect on the content or layout until styled in some way using CSS (e.g., styling is directly applied to it, or some kind of layout model like `flexbox` is applied to its parent element).
             * @See `flexbox` {@link https://developer.mozilla.org/en-US/docs/Glossary/Flexbox}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div}
             */
			div?: Hurx.Elements.TextContent.Div
			 /**
             * Represents a description list. The element encloses a list of groups of terms (specified using the `<dt>` element) and descriptions (provided by `<dd>` elements). Common uses for this element are to implement a glossary or to display metadata (a list of key-value pairs).
             * @See `<dt>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt}
             * @See `<dd>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl}
             */
			dl?: Hurx.Elements.TextContent.DL
			/**
             * Specifies a term in a description or definition list, and as such must be used inside a `<dl>` element. It is usually followed by a <dd> element; however, multiple `<dt>` elements in a row indicate several terms that are all defined by the immediate next `<dd>` element.
             * @See `<dl>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl}
             * @See `<dd>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt}
             */
			dt?: Hurx.Elements.TextContent.DT
			/**
             * Represents a caption or legend describing the rest of the contents of its parent `<figure>` element.
             * @See `<figure>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption}
             */
			figcaption?: Hurx.Elements.TextContent.Figcaption
			/**
             * Represents self-contained content, potentially with an optional caption, which is specified using the `<figcaption>` element. The figure, its caption, and its contents are referenced as a single unit.
             * @See `<figcaption>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure}
             */
			figure?: Hurx.Elements.TextContent.Figure
			/**
             * Represents a thematic break between paragraph-level elements: for example, a change of scene in a story, or a shift of topic within a section.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr}
             */
			hr?: Hurx.Elements.TextContent.HR
			/**
             * Represents an item in a list. It must be contained in a parent element: an ordered list (`<ol>`), an unordered list (`<ul>`), or a menu (`<menu>`). In menus and unordered lists, list items are usually displayed using bullet points. In ordered lists, they are usually displayed with an ascending counter on the left, such as a number or letter.
             * @See `<ol>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol}
             * @See `<ul>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul}
             * @See `<menu>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li}
             */
			li?: Hurx.Elements.TextContent.LI
			/**
             * A semantic alternative to `<ul>`, but treated by browsers (and exposed through the accessibility tree) as no different than `<ul>`. It represents an unordered list of items (which are represented by `<li>` elements).
             * @See `<ul>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul}
             * @See `<li>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu}
             */
			menu?: Hurx.Elements.TextContent.Menu
			/**
             * Represents an ordered list of items — typically rendered as a numbered list.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol}
             */
			ol?: Hurx.Elements.TextContent.OL
			/**
			 * Represents a paragraph. Paragraphs are usually represented in visual media as blocks of text separated from adjacent blocks by blank lines and/or first-line indentation, but HTML paragraphs can be any structural grouping of related content, such as images or form fields.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p}
			 */
			p?: Hurx.Elements.TextContent.P
			/**
             * Represents preformatted text which is to be presented exactly as written in the HTML file. The text is typically rendered using a non-proportional, or `monospaced`, font. Whitespace inside this element is displayed as written.
             * @See `monospaced` {@link https://en.wikipedia.org/wiki/Monospaced_font}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre}
             */
			pre?: Hurx.Elements.TextContent.Pre
			/**
             * Represents an unordered list of items, typically rendered as a bulleted list.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul}
             */
			ul?: Hurx.Elements.TextContent.UL
			/**
             * Together with its `href` attribute, creates a hyperlink to web pages, files, email addresses, locations within the current page, or anything else a URL can address.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a}
             */
			a?: Hurx.Elements.InlineTextSemantics.A
			/**
             * Represents an abbreviation or acronym.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/abbr}
             */
			abbr?: Hurx.Elements.InlineTextSemantics.Abbr
			/**
             * Used to draw the reader's attention to the element's contents, which are not otherwise granted special importance. This was formerly known as the Boldface element, and most browsers still draw the text in boldface. However, you should not use `<b>` for styling text or granting importance. If you wish to create boldface text, you should use the CSS `font-weight` property. If you wish to indicate an element is of special importance, you should use the strong element.
             * @See `font-weight` {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/b}
             */
			b?: Hurx.Elements.InlineTextSemantics.B
			/**
			 * Tells the browser's bidirectional algorithm to treat the text it contains in isolation from its surrounding text. It's particularly useful when a website dynamically inserts some text and doesn't know the directionality of the text being inserted.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi}
			 */
			bdi?: Hurx.Elements.InlineTextSemantics.BDI
			/**
             * Overrides the current directionality of text, so that the text within is rendered in a different direction.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdo}
             */
			bdo?: Hurx.Elements.InlineTextSemantics.BDO
			/**
			 * Produces a line break in text (carriage-return). It is useful for writing a poem or an address, where the division of lines is significant.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br}
			 */
			br?: Hurx.Elements.InlineTextSemantics.BR
			/**
			 * Used to mark up the title of a cited creative work. The reference may be in an abbreviated form according to context-appropriate conventions related to citation metadata.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite}
			 */
			cite?: Hurx.Elements.InlineTextSemantics.Cite
			/**
             * Displays its contents styled in a fashion intended to indicate that the text is a short fragment of computer code. By default, the content text is displayed using the user agent's default monospace font.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code}
             */
			code?: Hurx.Elements.InlineTextSemantics.Code
			/**
             * Links a given piece of content with a machine-readable translation. If the content is time- or date-related, the `<time>` element must be used.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/data}
             */
			data?: Hurx.Elements.InlineTextSemantics.Data
			/**
             * Used to indicate the term being defined within the context of a definition phrase or sentence. The ancestor `<p>` element, the `<dt>`/`<dd>` pairing, or the nearest section ancestor of the `<dfn>` element, is considered to be the definition of the term.
             * @See `<p>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p}
             * @See `<dt>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt}
             * @See `<dd>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dfn}
             */
			dfn?: Hurx.Elements.InlineTextSemantics.DFN
			/**
             * Marks text that has stress emphasis. The `<em>` element can be nested, with each nesting level indicating a greater degree of emphasis.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em}
             */
			em?: Hurx.Elements.InlineTextSemantics.EM
			/**
             * Represents a range of text that is set off from the normal text for some reason, such as idiomatic text, technical terms, and taxonomical designations, among others. Historically, these have been presented using italicized type, which is the original source of the `<i>` naming of this element.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/i}
             */
			i?: Hurx.Elements.InlineTextSemantics.I
			/**
             * Represents a span of inline text denoting textual user input from a keyboard, voice input, or any other text entry device. By convention, the user agent defaults to rendering the contents of a `<kbd>` element using its default monospace font, although this is not mandated by the HTML standard.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd}
             */
			kbd?: Hurx.Elements.InlineTextSemantics.KBD
			/**
			 * Represents text which is marked or highlighted for reference or notation purposes due to the marked passage's relevance in the enclosing context.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark}
			 */
			mark?: Hurx.Elements.InlineTextSemantics.Mark
			/**
             * Indicates that the enclosed text is a short inline quotation. Most modern browsers implement this by surrounding the text in quotation marks. This element is intended for short quotations that don't require paragraph breaks; for long quotations use the `<blockquote>` element.
             * @See `<blockquote>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/q}
             */
			q?: Hurx.Elements.InlineTextSemantics.Q
			/**
             * Used to provide fall-back parentheses for browsers that do not support the display of ruby annotations using the `<ruby>` element. One <rp> element should enclose each of the opening and closing parentheses that wrap the `<rt>` element that contains the annotation's text.
             * @See `<ruby>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby}
             * @See `<rt>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rt}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rp}
             */
			rp?: Hurx.Elements.InlineTextSemantics.RP
			/**
             * Specifies the ruby text component of a ruby annotation, which is used to provide pronunciation, translation, or transliteration information for East Asian typography. The `<rt>` element must always be contained within a `<ruby>` element.
             * @See `<ruby>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rt}
             */
			rt?: Hurx.Elements.InlineTextSemantics.RT
			/**
			 * Represents small annotations that are rendered above, below, or next to base text, usually used for showing the pronunciation of East Asian characters. It can also be used for annotating other kinds of text, but this usage is less common.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby}
			 */
			ruby?: Hurx.Elements.InlineTextSemantics.Ruby
			/**
             * Renders text with a strikethrough, or a line through it. Use the `<s>` element to represent things that are no longer relevant or no longer accurate. However, `<s>` is not appropriate when indicating document edits; for that, use the del and ins elements, as appropriate.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/s}
             */
			s?: Hurx.Elements.InlineTextSemantics.S
			/**
             * Used to enclose inline text which represents sample (or quoted) output from a computer program. Its contents are typically rendered using the browser's default monospaced font (such as `Courier` or Lucida Console).
             * @See `Courier` {@link https://en.wikipedia.org/wiki/Courier_(typeface)}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/samp}
             */
			samp?: Hurx.Elements.InlineTextSemantics.Samp
			/**
             * Represents side-comments and small print, like copyright and legal text, independent of its styled presentation. By default, it renders text within it one font size smaller, such as from `small` to `x-small`.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/small}
             */
			small?: Hurx.Elements.InlineTextSemantics.Small
			/**
             * A generic inline container for phrasing content, which does not inherently represent anything. It can be used to group elements for styling purposes (using the `class` or `id` attributes), or because they share attribute values, such as `lang`. It should be used only when no other semantic element is appropriate. `<span>` is very much like a div element, but div is a `block-level element` whereas a `<span>` is an `inline-level element`.
             * @See `block-level element` {@link https://developer.mozilla.org/en-US/docs/Glossary/Block-level_content}
             * @See `inline-level element` {@link https://developer.mozilla.org/en-US/docs/Glossary/Inline-level_content}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span}
             */
			span?: Hurx.Elements.InlineTextSemantics.Span
			/**
             * Indicates that its contents have strong importance, seriousness, or urgency. Browsers typically render the contents in bold type.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong}
             */
			strong?: Hurx.Elements.InlineTextSemantics.Strong
			/**
			 * Specifies inline text which should be displayed as subscript for solely typographical reasons. Subscripts are typically rendered with a lowered baseline using smaller text.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sub}
			 */
			sub?: Hurx.Elements.InlineTextSemantics.Sub
			/**
			 * Specifies inline text which is to be displayed as superscript for solely typographical reasons. Superscripts are usually rendered with a raised baseline using smaller text.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sup}
			 */
			sup?: Hurx.Elements.InlineTextSemantics.Sup
			/**
             * Represents a specific period in time. It may include the `datetime` attribute to translate dates into machine-readable format, allowing for better search engine results or custom features such as reminders.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time}
             */
			time?: Hurx.Elements.InlineTextSemantics.Time
			/**
			 * Represents a span of inline text which should be rendered in a way that indicates that it has a non-textual annotation. This is rendered by default as a simple solid underline but may be altered using CSS.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/u}
			 */
			u?: Hurx.Elements.InlineTextSemantics.U
			/**
			 * Represents the name of a variable in a mathematical expression or a programming context. It's typically presented using an italicized version of the current typeface, although that behavior is browser-dependent.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/var}
			 */
			var?: Hurx.Elements.InlineTextSemantics.Var
			/**
             * Represents a word break opportunity — a position within text where the browser may optionally break a line, though its line-breaking rules would not otherwise create a break at that location.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr}
             */
			wbr?: Hurx.Elements.InlineTextSemantics.WBR
			/**
			 * Defines an area inside an image map that has predefined clickable areas. An image map allows geometric areas on an image to be associated with `hyperlink`.
             * @See `hyperlink` {@link https://developer.mozilla.org/en-US/docs/Glossary/Hyperlink}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area}
			 */
			area?: Hurx.Elements.ImageAndMultimedia.Area
			/**
             * Used to embed sound content in documents. It may contain one or more audio sources, represented using the `src` attribute or the source element: the browser will choose the most suitable one. It can also be the destination for streamed media, using a `MediaStream`.
             * @See `MediaStream` {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaStream}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}
             */
			audio?: Hurx.Elements.ImageAndMultimedia.Audio
			/**
			 * Embeds an image into the document.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img}
			 */
			img?: Hurx.Elements.ImageAndMultimedia.Img
			/**
             * Used with `<area>` elements to define an image map (a clickable link area).
             * @See `<area>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map}
             */
			map?: Hurx.Elements.ImageAndMultimedia.Map
			/**
             * Used as a child of the media elements, audio and video. It lets you specify timed text tracks (or time-based data), for example to automatically handle subtitles. The tracks are formatted in `WebVTT format` (`.vtt` files)—Web Video Text Tracks.
             * @See `WebVTT format` {@link https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track}
             */
			track?: Hurx.Elements.ImageAndMultimedia.Track
			/**
             * Embeds a media player which supports video playback into the document. You can also use `<video>` for audio content, but the audio element may provide a more appropriate user experience.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
             */
			video?: Hurx.Elements.ImageAndMultimedia.Video
			/**
             * Embeds external content at the specified point in the document. This content is provided by an external application or other source of interactive content such as a browser plug-in.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed}
             */
			embed?: Hurx.Elements.EmbeddedContent.Embed
			/**
             * Represents a nested browsing context, embedding another HTML page into the current one.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe}
             */
			iframe?: Hurx.Elements.EmbeddedContent.IFrame
			/**
			 * Represents an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin.
			 */
			object?: Hurx.Elements.EmbeddedContent.Object
			/**
			 * Contains zero or more <source> elements and one <img> element to offer alternative versions of an image for different display/device scenarios.
			 */
			picture?: Hurx.Elements.EmbeddedContent.Picture
			/**
			 * Enables the embedding of another HTML page into the current one to enable smoother navigation into new pages.
			 */
			portal?: Hurx.Elements.EmbeddedContent.Portal
			/**
			 * Specifies multiple media resources for the picture, the audio element, or the video element. It is a void element, meaning that it has no content and does not have a closing tag. It is commonly used to offer the same media content in multiple file formats in order to provide compatibility with a broad range of browsers given their differing support for image file formats and media file formats.
			 */
			source?: Hurx.Elements.EmbeddedContent.Source
			/**
			 * Container defining a new coordinate system and viewport. It is used as the outermost element of SVG documents, but it can also be used to embed an SVG fragment inside an SVG or HTML document.
			 */
			svg?: Hurx.Elements.SVGAndMathML.SVG
			/**
			 * The top-level element in MathML. Every valid MathML instance must be wrapped in it. In addition, you must not nest a second <math> element in another, but you can have an arbitrary number of other child elements in it.
			 */
			math?: Hurx.Elements.SVGAndMathML.Math
			/**
			 * Container element to use with either the canvas scripting API or the WebGL API to draw graphics and animations.
			 */
			canvas?: Hurx.Elements.Scripting.Canvas
			/**
			 * Defines a section of HTML to be inserted if a script type on the page is unsupported or if scripting is currently turned off in the browser.
			 */
			noscript?: Hurx.Elements.Scripting.Noscript
			/**
			 * Used to embed executable code or data; this is typically used to embed or refer to JavaScript code. The <script> element can also be used with other languages, such as WebGL's GLSL shader programming language and JSON.
			 */
			script?: Hurx.Elements.Scripting.Script
			/**
			 * Represents a range of text that has been deleted from a document. This can be used when rendering "track changes" or source code diff information, for example. The <ins> element can be used for the opposite purpose: to indicate text that has been added to the document.
			 */
			del?: Hurx.Elements.DemarcatingEdits.Del
			/**
			 * Represents a range of text that has been added to a document. You can use the <del> element to similarly represent a range of text that has been deleted from the document.
			 */
			ins?: Hurx.Elements.DemarcatingEdits.Ins
			/**
			 * Specifies the caption (or title) of a table.
			 */
			caption?: Hurx.Elements.TableContent.Caption
			/**
			 * Defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.
			 */
			col?: Hurx.Elements.TableContent.Col
			/**
			 * Defines a group of columns within a table.
			 */
			colgroup?: Hurx.Elements.TableContent.Colgroup
			/**
			 * Represents tabular data — that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data.
			 */
			table?: Hurx.Elements.TableContent.Table
			/**
			 * Encapsulates a set of table rows (<tr> elements), indicating that they comprise the body of the table (<table>).
			 */
			tbody?: Hurx.Elements.TableContent.TBody
			/**
			 * Defines a cell of a table that contains data. It participates in the table model.
			 */
			td?: Hurx.Elements.TableContent.TD
			/**
			 * Defines a set of rows summarizing the columns of the table.
			 */
			tfoot?: Hurx.Elements.TableContent.TFoot
			/**
			 * Defines a cell as a header of a group of table cells. The exact nature of this group is defined by the scope and headers attributes.
			 */
			th?: Hurx.Elements.TableContent.TH
			/**
			 * Defines a set of rows defining the head of the columns of the table.
			 */
			thead?: Hurx.Elements.TableContent.THead
			/**
			 * Defines a row of cells in a table. The row's cells can then be established using a mix of <td> (data cell) and <th> (header cell) elements.
			 */
			tr?: Hurx.Elements.TableContent.TR
			/**
			 * An interactive element activated by a user with a mouse, keyboard, finger, voice command, or other assistive technology. Once activated, it performs an action, such as submitting a form or opening a dialog.
			 */
			button?: Hurx.Elements.Forms.Button
			/**
			 * Contains a set of <option> elements that represent the permissible or recommended options available to choose from within other controls.
			 */
			datalist?: Hurx.Elements.Forms.Datalist
			/**
			 * Used to group several controls as well as labels (<label>) within a web form.
			 */
			fieldset?: Hurx.Elements.Forms.Fieldset
			/**
			 * Represents a document section containing interactive controls for submitting information.
			 */
			form?: Hurx.Elements.Forms.Form
			/**
			 * Used to create interactive controls for web-based forms to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent. The <input> element is one of the most powerful and complex in all of HTML due to the sheer number of combinations of input types and attributes.
			 */
			input?: Hurx.Elements.Forms.Input
			/**
			 * Represents a caption for an item in a user interface.
			 */
			label?: Hurx.Elements.Forms.Label
			/**
			 * Represents a caption for the content of its parent <fieldset>.
			 */
			legend?: Hurx.Elements.Forms.Legend
			/**
			 * Represents either a scalar value within a known range or a fractional value.
			 */
			meter?: Hurx.Elements.Forms.Meter
			/**
			 * Creates a grouping of options within a <select> element.
			 */
			optgroup?: Hurx.Elements.Forms.Optgroup
			/**
			 * Used to define an item contained in a select, an <optgroup>, or a <datalist> element. As such, <option> can represent menu items in popups and other lists of items in an HTML document.
			 */
			option?: Hurx.Elements.Forms.Option
			/**
			 * Container element into which a site or app can inject the results of a calculation or the outcome of a user action.
			 */
			output?: Hurx.Elements.Forms.Output
			/**
			 * Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.
			 */
			progress?: Hurx.Elements.Forms.Progress
			/**
			 * Represents a control that provides a menu of options.
			 */
			select?: Hurx.Elements.Forms.Select
			/**
			 * Represents a multi-line plain-text editing control, useful when you want to allow users to enter a sizeable amount of free-form text, for example, a comment on a review or feedback form.
			 */
			textarea?: Hurx.Elements.Forms.Textarea
			/**
			 * Creates a disclosure widget in which information is visible only when the widget is toggled into an "open" state. A summary or label must be provided using the <summary> element.
			 */
			details?: Hurx.Elements.Interactive.Details
			/**
			 * Represents a dialog box or other interactive component, such as a dismissible alert, inspector, or subwindow.
			 */
			dialog?: Hurx.Elements.Interactive.Dialog
			/**
			 * Specifies a summary, caption, or legend for a details element's disclosure box. Clicking the <summary> element toggles the state of the parent <details> element open and closed.
			 */
			summary?: Hurx.Elements.Interactive.Summary
		}
        export interface Element<T extends HTMLElement|SVGElement|MathMLElement|SVGElement|MathMLElement> {
            /**
             * Potentially unsupported custom attributes
             */
            [attribute: string]: any|undefined
            // Global attributes
            /**
             * Provides a hint for generating a keyboard shortcut for the current element. This attribute consists of a space-separated list of characters. The browser should use the first one that exists on the computer keyboard layout.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey}
             */
            accesskey?: string
            /**
             * Controls whether and how text input is automatically capitalized as it is entered/edited by the user. It can have the following values:
             * - `off` or `none`, no autocapitalization is applied (all letters default to lowercase)
             * - `on` or `sentences`, the first letter of each sentence defaults to a capital letter; all other letters default to lowercase
             * - `words`, the first letter of each word defaults to a capital letter; all other letters default to lowercase
             * - `characters`, all letters should default to uppercase
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize}
             */
            autocapitalize?: 'off'|'none'|'on'|'sentences'|'words'|'characters'
            /**
             * Indicates that an element is to be focused on page load, or as soon as the `<dialog>` it is part of is displayed. This attribute is a boolean, initially false.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus}
             * @See `<dialog>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog}
             */
            autofocus?: Helpers.Booleanish
            /**
             * TODO: 
             * Classes to add, as a space-separated list of the classes, or as an object with booleans to determine whether to add the class.
             * Classes allow CSS and JavaScript to select and access specific elements via the `class selectors` or functions like the method `Document.getElementsByClassName()`.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class}
             * @See `class selectors` {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors}
             * @See `Document.getElementsByClassName` {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName}
             */
            class?: string | Record<string, boolean>
            /**
             * An `enumerated` attribute indicating if the element should be editable by the user. If so, the browser modifies its widget to allow editing. The attribute must take one of the following values:
             * - `true` or the empty string, which indicates that the element must be editable;
             * - `false`, which indicates that the element must not be editable.
             * @See `enumerated` {@link https://developer.mozilla.org/en-US/docs/Glossary/Enumerated}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable}
             */
            contenteditable?: Helpers.Booleanish|''
            /**
             * The `id` of a `<menu>` to use as the contextual menu for this element.
             * @See `id` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#id}
             * @See `<menu>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contextmenu}
             */
            contextmenu?: string
            /**
             * Forms a class of attributes, called custom data attributes, that allow proprietary information to be exchanged between the `HTML` and its `DOM` representation that may be used by scripts. All such custom data are available via the `HTMLElement` export interface of the element the attribute is set on. The `HTMLElement.dataset` property gives access to them.
             * @See `HTML` {@link https://developer.mozilla.org/en-US/docs/Web/HTML}
             * @See `DOM` {@link https://developer.mozilla.org/en-US/docs/Glossary/DOM}
             * @See `HTMLElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}
             * @See `HTMLElement.dataset` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*}
             */
            [attribute : `data-${string}`]: string
            /**
             * An enumerated attribute indicating the directionality of the element's text. It can have the following values:
             * - `ltr`, which means left to right and is to be used for languages that are written from the left to the right (like English);
             * - `rtl`, which means right to left and is to be used for languages that are written from the right to the left (like Arabic);
             * - `auto`, which lets the user agent decide. It uses a basic algorithm as it parses the characters inside the element until it finds a character with a strong directionality, then it applies that directionality to the whole element.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir}
             */
            dir?: 'ltr'|'rtl'|'auto'
            /**
             * An enumerated attribute indicating whether the element can be dragged, using the `Drag and Drop API`. It can have the following values:
             * - `true`, which indicates that the element may be dragged
             * - `false`, which indicates that the element may not be dragged.
             * @See `Drag and Drop API` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable}
             */
            draggable?: Helpers.Booleanish
            /**
             * Hints what action label (or icon) to present for the enter key on virtual keyboards.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/enterkeyhint}
             */
            enterkeyhint?: string
            /**
             * Used to transitively export shadow parts from a nested shadow tree into a containing light tree.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/exportparts}
             */
            exportparts?: string
            /**
             * An enumerated attribute indicating that the element is not yet, or is no longer, relevant. For example, it can be used to hide elements of the page that can't be used until the login process has been completed. The browser won't render such elements. This attribute must not be used to hide content that could legitimately be shown.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden}
             */
            hidden?: string
            /**
             * Defines a unique identifier (ID) which must be unique in the whole document. Its purpose is to identify the element when linking (using a fragment identifier), scripting, or styling (with CSS).
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id}
             */
            id?: string
            /**
             * A boolean value that makes the browser disregard user input events for the element. Useful when click events are present.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert}
             */
            inert?: Helpers.Booleanish
            /**
             * Provides a hint to browsers about the type of virtual keyboard configuration to use when editing this element or its contents. Used primarily on `<input>` elements, but is usable on any element while in `contenteditable` mode.
             * @See `<input>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input}
             * @See `conteneditable` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#contenteditable}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode}
             */
            inputmode?: string
            /**
             * Allows you to specify that a standard HTML element should behave like a registered custom built-in element (see `Using custom elements` for more details).
             * @See `Using custom elements` {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is}
             */
            is?: string
            /**
             * The unique, global identifier of an item.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemid}
             */
            itemid?: string
            /**
             * Used to add properties to an item. Every HTML element may have an `itemprop` attribute specified, where an `itemprop` consists of a name and value pair.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop}
             */
            itemprop?: string
            /**
             * Properties that are not descendants of an element with the `itemscope` attribute can be associated with the item using an `itemref`. It provides a list of element ids (not `itemid`s) with additional properties elsewhere in the document.
             * @See `itemscope` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemscope}
             * @See `itemid` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemid}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemref}
             */
            itemref?: string
            /**
             * `itemscope` (usually) works along with `itemtype` to specify that the HTML contained in a block is about a particular item. `itemscope` creates the Item and defines the scope of the `itemtype` associated with it. `itemtype` is a valid URL of a vocabulary (such as schema.org) that describes the item and its properties context.
             * @See `itemtype` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemtype}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemscope}
             */
            itemscope?: string
            /**
             * Specifies the URL of the vocabulary that will be used to define `itemprop`s (item properties) in the data structure. `itemscope` is used to set the scope of where in the data structure the vocabulary set by `itemtype` will be active.
             * @See `itemprop` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop}
             * @See `itemscope` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemscope}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemtype}
             */
            itemtype?: string
            /**
             * Helps define the language of an element: the language that non-editable elements are in, or the language that editable elements should be written in by the user. The attribute contains one "language tag" (made of hyphen-separated "language subtags") in the format defined in RFC 5646: Tags for Identifying Languages (also known as BCP 47). `xml:lang` has priority over it.
             * @See {@link https://datatracker.ietf.org/doc/html/rfc5646}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang}
             */
            lang?: string
            /**
             * A cryptographic nonce ("number used once") which can be used by Content Security Policy to determine whether or not a given fetch will be allowed to proceed.
             * @See `Content Security Policy` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce}
             */
            nonce?: number|string
            /**
             * A space-separated list of the part names of the element. Part names allows CSS to select and style specific elements in a shadow tree via the `::part` pseudo-element.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/part}
             */
            part?: string
            /**
             * Used todesignate an element as a popover element (see Popover API). Popover elements are hidden via `display: none` until opened via an invoking/control element (i.e. a `<button>` or `<input type="button">` with a `popovertarget` attribute) or a `HTMLElement.showPopover()` call.
             * @See `popovertarget` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#popovertarget}
             * @See `HTMLElement.showPopover()` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/showPopover}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover}
             */
            popover?: string
            /**
             * Roles define the semantic meaning of content, allowing screen readers and other tools to present and support interaction with an object in a way that is consistent with user expectations of that type of object. `roles` are added to HTML elements using `role="role_type"`, where `role_type` is the name of a role in the ARIA specification.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles}
             */
            role?: string
            /**
             * Assigns a slot in a `shadow DOM` shadow tree to an element: An element with a slot attribute is assigned to the slot created by the <slot> element whose name attribute's value matches that slot attribute's value.
             * @See `shadow DOM` {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM}
             * @See `name` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot#name}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/slot}
             */
            slot?: string
            /**
             * An enumerated attribute defines whether the element may be checked for spelling errors. It may have the following values:
             * - empty string or `true`, which indicates that the element should be, if possible, checked for spelling errors;
             * - `false`, which indicates that the element should not be checked for spelling errors.
             */
            spellcheck?: Helpers.Booleanish|''
            /**
             * Contains `CSS` styling declarations to be applied to the element. Note that it is recommended for styles to be defined in a separate file or files. This attribute and the <style> element have mainly the purpose of allowing for quick styling, for example for testing purposes.
             * @See `CSS` {@link: https://developer.mozilla.org/en-US/docs/Web/CSS}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style}
             */
            style?: CSS.Properties|string
            /**
             * An integer attribute indicating if the element can take input focus (is focusable), if it should participate to sequential keyboard navigation, and if so, at what position. It can take several values:
             * - a negative value means that the element should be focusable, but should not be reachable via sequential keyboard navigation;
             * - `0` means that the element should be focusable and reachable via sequential keyboard navigation, but its relative order is defined by the platform convention;
             * - a positive value means that the element should be focusable and reachable via sequential keyboard navigation; the order in which the elements are focused is the increasing value of the tabindex. If several elements share the same tabindex, their relative order follows their relative positions in the document.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex}
             */
            tabindex?: number|string
            /**
             * Contains a text representing advisory information related to the element it belongs to. Such information can typically, but not necessarily, be presented to the user as a tooltip.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title}
             */
            title?: string
            /**
             * An enumerated attribute that is used to specify whether an element's attribute values and the values of its `Text` node children are to be translated when the page is localized, or whether to leave them unchanged. It can have the following values:
             * - empty string or `yes`, which indicates that the element will be translated.
             * - `no`, which indicates that the element will not be translated.
             * @See `Text` {@link https://developer.mozilla.org/en-US/docs/Web/API/Text}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate}
             */
            translate?: string
            /**
             * An `enumerated` attribute used to control the on-screen virtual keyboard behavior on devices such as tablets, mobile phones, or other devices where a hardware keyboard may not be available for elements that also uses the `contenteditable` attribute.
             * - `auto` or an empty string, which automatically shows the virtual keyboard when the element is focused or tapped.
             * - `manual`, which decouples focus and tap on the element from the virtual keyboard's state.
             * @See `enumerated` {@link https://developer.mozilla.org/en-US/docs/Glossary/Enumerated}
             * @See `contenteditable` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#contenteditable}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/virtualkeyboardpolicy}
             */
            virtualkeyboardpolicy?: 'auto'|'manual'|''
            // Aria
            // TODO:
            // Event handlers
            // TODO: documentation
            onAutoComplete?: (event: Hurx.Events.AutoCompleteEvent<T>) => any
            onAutoCompleteError?: (event: Hurx.Events.AutoCompleteErrorEvent<T>) => any
            onBlur?: (event: Hurx.Events.BlurEvent<T>) => any
            onCancel?: (event: Hurx.Events.CancelEvent<T>) => any
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
            onError?: (event: Hurx.Events.ErrorEvent<T>) => any
            onFocus?: (event: Hurx.Events.FocusEvent<T>) => any
            onInput?: (event: Hurx.Events.InputEvent<T>) => any
            onInvalid?: (event: Hurx.Events.InvalidEvent<T>) => any
            onKeyDown?: (event: Hurx.Events.KeyDownEvent<T>) => any
            onKeyPress?: (event: Hurx.Events.KeyPressEvent<T>) => any
            onKeyUp?: (event: Hurx.Events.KeyUpEvent<T>) => any
            onLoad?: (event: Hurx.Events.LoadEvent<T>) => any
            onLoadStart?: (event: Hurx.Events.LoadStartEvent<T>) => any
            onMouseDown?: (event: Hurx.Events.MouseDownEvent<T>) => any
            onMouseEnter?: (event: Hurx.Events.MouseEnterEvent<T>) => any
            onMouseLeave?: (event: Hurx.Events.MouseLeaveEvent<T>) => any
            onMouseMove?: (event: Hurx.Events.MouseMoveEvent<T>) => any
            onMouseOut?: (event: Hurx.Events.MouseOutEvent<T>) => any
            onMouseOver?: (event: Hurx.Events.MouseOverEvent<T>) => any
            onMouseUp?: (event: Hurx.Events.MouseUpEvent<T>) => any
            onMouseWheel?: (event: Hurx.Events.MouseWheelEvent<T>) => any
            onProgress?: (event: Hurx.Events.ProgressEvent<T>) => any
            onRateChange?: (event: Hurx.Events.RateChangeEvent<T>) => any
            onReset?: (event: Hurx.Events.ResetEvent<T>) => any
            onResize?: (event: Hurx.Events.ResizeEvent<T>) => any
            onScroll?: (event: Hurx.Events.ScrollEvent<T>) => any
            onSelect?: (event: Hurx.Events.SelectEvent<T>) => any
            onShow?: (event: Hurx.Events.ShowEvent<T>) => any
            onSort?: (event: Hurx.Events.SortEvent<T>) => any
            onStalled?: (event: Hurx.Events.StalledEvent<T>) => any
            onSubmit?: (event: Hurx.Events.SubmitEvent<T>) => any
            onSuspend?: (event: Hurx.Events.SuspendEvent<T>) => any
            onToggle?: (event: Hurx.Events.ToggleEvent<T>) => any
        }
        /**
         * Represents the root (top-level element) of an HTML document, so it is also referred to as the root element. All other elements must be descendants of this element.
         * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html}
         */
        export interface HTML extends Element<HTMLHtmlElement> {}
        /**
         * Metadata contains information about the page.
         * This includes information about styles, scripts and data to help software (`search engines`, `browsers`, etc.) use and render the page.
         * Metadata for styles and scripts may be defined in the page or linked to another file that has the information.
         * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element#document_metadata}
         */
        export namespace Metadata {
            /**
             * Specifies the base URL to use for all relative URLs in a document. There can be only one such element in a document.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base}
             */
            export interface Base extends Element<HTMLBaseElement> {
                /**
                 * The base URL to be used throughout the document for relative URLs. Absolute and relative URLs are allowed. `data:` and `javascript:` URLs are not allowed.
                 */
                href?: string
                /**
                 * A keyword or author-defined name of the default browsing context to show the results of navigation from `<a>`, `<area>`, or `<form>` elements without explicit `target` attributes. The following keywords have special meanings:
                 * - `_self` (default): Show the result in the current browsing context.
                 * - `_blank`: Show the result in a new, unnamed browsing context.
                 * - `_parent`: Show the result in the parent browsing context of the current one, if the current page is inside a frame. If there is no parent, acts the same as `_self`.
                 * - `_top`: Show the result in the topmost browsing context (the browsing context that is an ancestor of the current one and has no parent). If there is no parent, acts the same as `_self`.
                 * @See `browsing context` {@link https://developer.mozilla.org/en-US/docs/Glossary/Browsing_context}
                 */
                target?: '_self'|'_blank'|'_parent'|'_top'
            }
            /**
             * Contains machine-readable information (metadata) about the document, like its `title`, `scripts`, and `style sheets`.
             * @See `title` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title}
             * @See `scripts` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script}
             * @See `style sheets` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head}
             */
            export interface Head extends Element<HTMLHeadElement> {}
            /**
             * Specifies relationships between the current document and an external resource. This element is most commonly used to link to CSS but is also used to establish site icons (both "favicon" style icons and icons for the home screen and apps on mobile devices) among other things.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link}
             */
            export interface Link extends Element<HTMLLinkElement> {
                /**
                 * This attribute is required when `rel="preload"` has been set on the `<link>` element, optional when `rel="modulepreload"` has been set, and otherwise should not be used. It specifies the type of content being loaded by the `<link>`, which is necessary for request matching, application of correct content security policy, and setting of correct `Accept` request header.
                 * 
                 * Furthermore, `rel="preload"` uses this as a signal for request prioritization. The table below lists the valid values for this attribute and the elements or resources they apply to.
                 * 
                 * `audio`
                 * - Applies to: `<audio> elements`
                 * 
                 * `document`
                 * - Applies to: `<iframe>` and `<frame>` elements
                 * 
                 * `embed`
                 * - Applies to: `<embed>` elements
                 * 
                 * `fetch`
                 * - Applies to: fetch, XHR
                 * - `Note`: This value also requires `<link>` to contain the crossorigin attribute.
                 * 
                 * `font`
                 * - Applies to: CSS @font-face
                 * 
                 * `image`
                 * - Applies to: `<img>` and `<picture>` elements with srcset or imageset attributes, SVG `<image>` elements, CSS `*-image` rules
                 * 
                 * `object`
                 * - Applies to: `<object>` elements
                 * 
                 * `script`
                 * - Applies to: `<script>` elements, Worker `importScripts`
                 * 
                 * `style`
                 * - Applies to: `<link rel=stylesheet>` elements, CSS `@import`
                 * 
                 * `track`
                 * - Applies to: `<track>` elements
                 * 
                 * `video`
                 * - Applies to: `<video>` elements
                 * 
                 * `worker`
                 * - Applies to: Worker, SharedWorker
                 */
                as?: 'audio'|'document'|'embed'|'fetch'|'font'|'image'|'object'|'script'|'style'|'track'|'video'|'worker'
                /**
                 * This enumerated attribute indicates whether CORS must be used when fetching the resource. CORS-enabled images can be reused in the <canvas> element without being tainted. The allowed values are:
                 * 
                 * `anonymous`
                 * - A cross-origin request (i.e. with an `Origin` HTTP header) is performed, but no credential is sent (i.e. no cookie, X.509 certificate, or HTTP Basic authentication). If the server does not give credentials to the origin site (by not setting the `Access-Control-Allow-Origin` HTTP header) the resource will be tainted and its usage restricted.
                 * - @See `Origin` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin}
                 * - @See `Access-Control-Allow-Origin` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin}
                 * 
                 * `use-credentials`
                 * - A cross-origin request (i.e. with an Origin HTTP header) is performed along with a credential sent (i.e. a cookie, certificate, and/or HTTP Basic authentication is performed). If the server does not give credentials to the origin site (through Access-Control-Allow-Credentials HTTP header), the resource will be tainted and its usage restricted.
                 * - @See `Access-Control-Allow-Credentials` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials}
                 * 
                 * If the attribute is not present, the resource is fetched without a `CORS` request (i.e. without sending the `Origin` HTTP header), preventing its non-tainted usage. If invalid, it is handled as if the enumerated keyword anonymous was used. See `CORS settings attributes` for additional information.
                 * 
                 * @See `enumerated` {@link https://developer.mozilla.org/en-US/docs/Glossary/Enumerated}
                 * @See `CORS` {@link https://developer.mozilla.org/en-US/docs/Glossary/CORS}
                 * @See `CORS-enabled images` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image}
                 * @See `CORS settings attributes` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin}
                 * @See `<canvas>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas}
                 */
                crossorigin?: 'anonymous'|'use-credentials'
                /**
                 * For `rel="stylesheet"` only, the `disabled` Boolean attribute indicates whether the described stylesheet should be loaded and applied to the document. If `disabled` is specified in the HTML when it is loaded, the stylesheet will not be loaded during page load. Instead, the stylesheet will be loaded on-demand, if and when the `disabled` attribute is changed to `false` or removed.
                 * 
                 * Setting the `disabled` property in the DOM causes the stylesheet to be removed from the document's `Document.styleSheets` list.
                 * 
                 * @See `Document.styleSheets` {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/styleSheets}
                 */
                disabled?: Helpers.Booleanish
                /**
                 * Provides a hint of the relative priority to use when fetching a preloaded resource. Allowed values:
                 * 
                 * `high`
                 * - Signals a high-priority fetch relative to other resources of the same type.
                 * 
                 * `low`
                 * - Signals a low-priority fetch relative to other resources of the same type.
                 * 
                 * `auto`
                 * - Default: Signals automatic determination of fetch priority relative to other resources of the same type.
                 */
                fetchpriority?: 'high'|'low'|'auto'
                /**
                 * This attribute specifies the `URL` of the linked resource. A `URL` can be absolute or relative.
                 * @See `URL` {@link https://developer.mozilla.org/en-US/docs/Glossary/URL}
                 */
                href?: string
                /**
                 * This attribute indicates the language of the linked resource. It is purely advisory. Allowed values are specified by `RFC 5646`: Tags for Identifying Languages (also known as BCP 47). Use this attribute only if the `href` attribute is present.
                 * @See `RFC 5646` {@link https://datatracker.ietf.org/doc/html/rfc5646}
                 */
                hreflang?: string
                /**
                 * For `rel="preload"` and `as="image"` only, the `imagesizes` attribute is a `sizes attribute` that indicates to preload the appropriate resource used by an `<img>` element with corresponding values for its `srcset` and `sizes` attributes.
                 * @See `sizes attribute` {@link https://html.spec.whatwg.org/multipage/images.html#sizes-attribute}
                 */
                imagesizes?: string
                /**
                 * For `rel="preload"` and `as="image"` only, the imagesrcset attribute is a `sourceset attribute` that indicates to preload the appropriate resource used by an `<img>` element with corresponding values for its `srcset` and `sizes` attributes.
                 * @See `sourceset attribute` {@link https://html.spec.whatwg.org/multipage/images.html#srcset-attribute}
                 */
                imagesrcset?: string
                /**
                 * Contains inline metadata — a base64-encoded cryptographic hash of the resource (file) you're telling the browser to fetch. The browser can use this to verify that the fetched resource has been delivered free of unexpected manipulation. 
                 * @See `Subresource Integrity` {@link https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity}
                 */
                integrity?: string
                /**
                 * This attribute specifies the media that the linked resource applies to. Its value must be a media type / `media query`. This attribute is mainly useful when linking to external stylesheets — it allows the user agent to pick the best adapted one for the device it runs on.
                 * @See `media query` {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries}
                 */
                media?: string
                /**
                 * `Experimental`
                 * 
                 * Identifies a resource that might be required by the next navigation and that the user agent should retrieve it. This allows the user agent to respond faster when the resource is requested in the future.
                 */
                prefetch?: string
                /**
                 * A string indicating which referrer to use when fetching the resource:
                 * 
                 * - `no-referrer` means that the Referer header will not be sent.
                 * - `no-referrer-when-downgrade` means that no `Referer` header will be sent when navigating to an origin without TLS (HTTPS). This is a user agent's default behavior, if no policy is otherwise specified.
                 * - `origin` means that the referrer will be the origin of the page, which is roughly the scheme, the host, and the port.
                 * - `origin-when-cross-origin` means that navigating to other origins will be limited to the scheme, the host, and the port, while navigating on the same origin will include the referrer's path.
                 * - `unsafe-url` means that the referrer will include the origin and the path (but not the fragment, password, or username). This case is unsafe because it can leak origins and paths from TLS-protected resources to insecure origins.
                 * 
                 * @See `Referer` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer}
                 */
                referrerpolicy?: 'no-referrer'|'no-referrer-when-downgrade'|'origin'|'origin-when-cross-origin'|'unsafe-url'
                /**
                 * This attribute names a relationship of the linked document to the current document. The attribute must be a space-separated list of `link type values`.
                 * @See `link type values` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel}
                 */
                rel?: string
                /**
                 * `Experimental`
                 * 
                 * This attribute defines the sizes of the icons for visual media contained in the resource. It must be present only if the `rel` contains a value of `icon` or a non-standard type such as Apple's `apple-touch-icon`. It may have the following values:
                 * 
                 * - `any`, meaning that the icon can be scaled to any size as it is in a vector format, like `image/svg+xml`.
                 * - a white-space separated list of sizes, each in the format `<width in pixels>x<height in pixels>` or `<width in pixels>X<height in pixels>`. Each of these sizes must be contained in the resource.
                 * 
                 * @See `rel` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#rel}
                 */
                sizes?: 'any'|`${number}${'x'|'X'}${number}`
                /**
                 * The `title` attribute has special semantics on the `<link>` element. When used on a `<link rel="stylesheet">` it defines a `default or an alternate stylesheet`.
                 * @See `default or an alternate stylesheet` {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets}
                 */
                title?: string
                /**
                 * This attribute is used to define the type of the content linked to. The value of the attribute should be a MIME type such as text/html, text/css, and so on. The common use of this attribute is to define the type of stylesheet being referenced (such as text/css), but given that CSS is the only stylesheet language used on the web, not only is it possible to omit the `type` attribute, but is actually now recommended practice. It is also used on `rel="preload"` link types, to make sure the browser only downloads file types that it supports.
                 */
                type?: string
                /**
                 * This attribute explicitly indicates that certain operations should be blocked on the fetching of an external resource. The operations that are to be blocked must be a space-separated list of blocking attributes listed below.
                 * - `render`: The rendering of content on the screen is blocked.
                 */
                blocking?: string
            }
            /**
             * Represents `metadata` that cannot be represented by other HTML meta-related elements, like `<base>`, `<link>`, `<script>`, `<style>` and `<title>`.
             * @See `metadata` {@link https://developer.mozilla.org/en-US/docs/Glossary/Metadata}
             */
            export interface Meta extends Element<HTMLMetaElement> {
                /**
                 * This attribute declares the document's character encoding. If the attribute is present, its value must be an ASCII case-insensitive match for the string `"utf-8"`, because UTF-8 is the only valid encoding for HTML5 documents. `<meta>` elements which declare a character encoding must be located entirely within the first 1024 bytes of the document.
                 */
                charset?: string
                /**
                 * This attribute contains the value for the `http-equiv` or `name` attribute, depending on which is used.
                 * @See `http-equiv` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#http-equiv}
                 * @See `name` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#name}
                 */
                content?: string
                /**
                 * Defines a pragma directive. The attribute is named `http-equiv(alent)` because all the allowed values are names of particular HTTP headers:
                 * 
                 * - `content-security-policy` Allows page authors to define a content policy for the current page. Content policies mostly specify allowed server origins and script endpoints which help guard against cross-site scripting attacks.
                 * - `content-type` Declares the `MIME type` and the document's character encoding. The `content` attribute must have the value `"text/html; charset=utf-8"` if specified. This is equivalent to a `<meta>` element with the `charset` attribute specified and carries the same restriction on placement within the document. Note: Can only be used in documents served with a `text/html` — not in documents served with an XML MIME type.
                 *      - @See `MIME type` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types}
                 *      - @See `charset` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#charset}
                 * - `default-style` Sets the name of the default `CSS style sheet` set.
                 *      - @See `CSS style sheet` {@link https://developer.mozilla.org/en-US/docs/Web/CSS}
                 * - `x-ua-compatible` If specified, the `content` attribute must have the value `"IE=edge"`. User agents are required to ignore this pragma.
                 * - `refresh` This instruction specifies:
                 *      - The number of seconds until the page should be reloaded - only if the `content` attribute contains a non-negative integer.
                 *          - @See `content` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#content}
                 *      - The number of seconds until the page should redirect to another - only if the `content` attribute contains a non-negative integer followed by the string '`;url=`', and a valid URL.
                 *          - @See `content` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#content}
                 *      - `Warning`:
                 *          - Pages set with a `refresh` value run the risk of having the time interval being too short. People navigating with the aid of assistive technology such as a screen reader may be unable to read through and understand the page's content before being automatically redirected. The abrupt, unannounced updating of the page content may also be disorienting for people experiencing low vision conditions.
                 */
                [`http-equiv`]?: 'content-security-policy'|'default-style'|'x-ua-compatible'|'refresh'
                /**
                 * The `name` and `content` attributes can be used together to provide document metadata in terms of name-value pairs, with the `name` attribute giving the metadata name, and the `content` attribute giving the value.
                 * 
                 * @See `standard metadata` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name} names for details about the set of standard metadata names defined in the HTML specification.
                 */
                name?: string
            }
            /**
             * Contains style information for a document or part of a document. It contains CSS, which is applied to the contents of the document containing this element.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style}
             */
            export interface Style extends Element<HTMLStyleElement> {
                /**
                 * This attribute defines which media the style should be applied to. Its value is a `media query`, which defaults to `all` if the attribute is missing.
                 * @See `media query` {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries}
                 */
                media?: string
                /**
                 * A cryptographic nonce (number used once) used to allow inline styles in a `style-src Content-Security-Policy`. The server must generate a unique nonce value each time it transmits a policy. It is critical to provide a nonce that cannot be guessed as bypassing a resource's policy is otherwise trivial.
                 * @See `style-src Content-Security-Policy` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src}
                 */
                nonce?: string|number
                /**
                 * This attribute specifies `alternative style sheet` sets.
                 * @See `alternative style sheet` {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets}
                 */
                title?: string
                /**
                 * `Experimental`
                 * 
                 * This attribute explicitly indicates that certain operations should be blocked on the fetching of critical subresources. `@import`-ed stylesheets are generally considered as critical subresources, whereas `background-image` and fonts are not.
                 * 
                 * - `render`: The rendering of content on the screen is blocked.
                 * 
                 * @See `@import` {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@import}
                 * @See `background-image` {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-image}
                 */
                blocking?: string
            }
            /**
             * Defines the document's title that is shown in a `browser`'s title bar or a page's tab. It only contains text; tags within the element are ignored.
             * @See `browser` {@link https://developer.mozilla.org/en-US/docs/Glossary/Browser}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title}
             */
            export interface Title extends Element<HTMLTitleElement> {}
        }
        /**
         * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element#sectioning_root}
         */
        export namespace SectioningRoot {
            /**
             * Represents the content of an HTML document. There can be only one such element in a document.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body}
             */
            export interface Body extends Element<HTMLBodyElement> {
                /**
                 * Function to call after the user has printed the document.
                 */
                onAfterPrint?: Events.Event<'afterprint', HTMLBodyElement>
                /**
                 * Function to call when the user requests printing of the document.
                 */
                onBeforePrint?: Events.Event<'beforeprint', HTMLBodyElement>
                /**
                 * Function to call when the document is about to be unloaded.
                 */
                onBeforeUnload?: Events.Event<'beforeunload', HTMLBodyElement>
                /**
                 * Function to call when the fragment identifier part (starting with the hash ('#') character) of the document's current address has changed.
                 */
                onHashChange?: Events.Event<'hashchange', HTMLBodyElement>
                /**
                 * Function to call when the preferred languages changed.
                 */
                onLanguageChange?: Events.Event<'languagechange', HTMLBodyElement>
                /**
                 * Function to call when the document has received a message.
                 */
                onMessage?: Events.Event<'message', HTMLBodyElement>
                /**
                 * Function to call when network communication has failed.
                 */
                onOffline?: Events.Event<'offline', HTMLBodyElement>
                /**
                 * Function to call when network communication has been restored.
                 */
                onOnline?: Events.Event<'online', HTMLBodyElement>
                /**
                 * Function to call when the user has navigated session history.
                 */
                onPopState?: Events.Event<'popstate', HTMLBodyElement>
                /**
                 * Function to call when the user has moved forward in undo transaction history.
                 */
                onRedo?: Events.Event<'redo', HTMLBodyElement>
                /**
                 * Function to call when the storage area has changed.
                 */
                onStorage?: Events.Event<'storage', HTMLBodyElement>
                /**
                 * Function to call when the user has moved backward in undo transaction history.
                 */
                onUndo?: Events.Event<'undo', HTMLBodyElement>
                /**
                 * Function to call when the document is going away.
                 */
                onUnload?: Events.Event<'unload', HTMLBodyElement>
            }
        }
        /**
         * Content sectioning elements allow you to organize the document content into logical pieces. Use the sectioning elements to create a broad outline for your page content, including header and footer navigation, and heading elements to identify sections of content.
         * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element#content_sectioning}
         */
        export namespace ContentSectioning {
            /**
             * Indicates that the enclosed HTML provides contact information for a person or people, or for an organization.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/address}
             */
            export interface Address extends Element<HTMLElement> {}
            /**
             * Represents a self-contained composition in a document, page, application, or site, which is intended to be independently distributable or reusable (e.g., in syndication). Examples include a forum post, a magazine or newspaper article, a blog entry, a product card, a user-submitted comment, an interactive widget or gadget, or any other independent item of content.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article}
             */
            export interface Article extends Element<HTMLElement> {}
            /**
             * Represents a portion of a document whose content is only indirectly related to the document's main content. Asides are frequently presented as sidebars or call-out boxes.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside}
             */
            export interface Aside extends Element<HTMLElement> {}
            /**
             * Represents a footer for its nearest ancestor `sectioning content` or `sectioning root` element. A `<footer>` typically contains information about the author of the section, copyright data, or links to related documents.
             * @See `sectioning content` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#sectioning_content}
             * @See `sectioning root` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer}
             */
            export interface Footer extends Element<HTMLElement> {}
            /**
             * Represents introductory content, typically a group of introductory or navigational aids. It may contain some heading elements but also a logo, a search form, an author name, and other elements.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header}
             */
            export interface Header extends Element<HTMLElement> {}
            /**
             * Represent six levels of section headings. `<h1>` is the highest section level and `<h6>` is the lowest.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements}
             */
            export interface H1 extends Element<HTMLHeadingElement> {}
            /**
             * Represent six levels of section headings. `<h1>` is the highest section level and `<h6>` is the lowest.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements}
             */
            export interface H2 extends Element<HTMLHeadingElement> {}
            /**
             * Represent six levels of section headings. `<h1>` is the highest section level and `<h6>` is the lowest.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements}
             */
            export interface H3 extends Element<HTMLHeadingElement> {}
            /**
             * Represent six levels of section headings. `<h1>` is the highest section level and `<h6>` is the lowest.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements}
             */
            export interface H4 extends Element<HTMLHeadingElement> {}
            /**
             * Represent six levels of section headings. `<h1>` is the highest section level and `<h6>` is the lowest.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements}
             */
            export interface H5 extends Element<HTMLHeadingElement> {}
            /**
             * Represent six levels of section headings. `<h1>` is the highest section level and `<h6>` is the lowest.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements}
             */
            export interface H6 extends Element<HTMLHeadingElement> {}
            /**
             * Represents a heading grouped with any secondary content, such as subheadings, an alternative title, or a tagline.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hgroup}
             */
            export interface HGroup extends Element<HTMLElement> {}
            /**
             * Represents the dominant content of the body of a document. The main content area consists of content that is directly related to or expands upon the central topic of a document, or the central functionality of an application.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main}
             */
            export interface Main extends Element<HTMLElement> {}
            /**
             * Represents a section of a page whose purpose is to provide navigation links, either within the current document or to other documents. Common examples of navigation sections are menus, tables of contents, and indexes.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav}
             */
            export interface Nav extends Element<HTMLElement> {}
            /**
             * Represents a generic standalone section of a document, which doesn't have a more specific semantic element to represent it. Sections should always have a heading, with very few exceptions.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section}
             */
            export interface Section extends Element<HTMLElement> {}
            /**
             * Represents a part that contains a set of form controls or other content related to performing a search or filtering operation.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/search}
             */
            export interface Search extends Element<HTMLElement> {}
        }
        /**
         * Use HTML text content elements to organize blocks or sections of content placed between the opening <body> and closing </body> tags. Important for accessibility and SEO, these elements identify the purpose or structure of that content.
         * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element#text_content}
         */
        export namespace TextContent {
            /**
             * Indicates that the enclosed text is an extended quotation. Usually, this is rendered visually by indentation. A URL for the source of the quotation may be given using the `cite` attribute, while a text representation of the source can be given using the `<cite>` element.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote}
             */
            export interface Blockquote extends Element<HTMLElement> {
                /**
                 * A URL that designates a source document or message for the information quoted. This attribute is intended to point to information explaining the context or the reference for the quote.
                 */
                cite?: string
            }
            /**
             * Provides the description, definition, or value for the preceding term (`<dt>`) in a description list (`<dl>`).
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd}
             */
            export interface DD extends Element<HTMLElement> {}
            /**
             * The generic container for flow content. It has no effect on the content or layout until styled in some way using CSS (e.g., styling is directly applied to it, or some kind of layout model like `flexbox` is applied to its parent element).
             * @See `flexbox` {@link https://developer.mozilla.org/en-US/docs/Glossary/Flexbox}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div}
             */
            export interface Div extends Element<HTMLDivElement> {}
            /**
             * Represents a description list. The element encloses a list of groups of terms (specified using the `<dt>` element) and descriptions (provided by `<dd>` elements). Common uses for this element are to implement a glossary or to display metadata (a list of key-value pairs).
             * @See `<dt>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt}
             * @See `<dd>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl}
             */
            export interface DL extends Element<HTMLElement> {}
            /**
             * Specifies a term in a description or definition list, and as such must be used inside a `<dl>` element. It is usually followed by a <dd> element; however, multiple `<dt>` elements in a row indicate several terms that are all defined by the immediate next `<dd>` element.
             * @See `<dl>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl}
             * @See `<dd>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt}
             */
            export interface DT extends Element<HTMLElement> {}
            /**
             * Represents a caption or legend describing the rest of the contents of its parent `<figure>` element.
             * @See `<figure>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption}
             */
            export interface Figcaption extends Element<HTMLElement> {}
            /**
             * Represents self-contained content, potentially with an optional caption, which is specified using the `<figcaption>` element. The figure, its caption, and its contents are referenced as a single unit.
             * @See `<figcaption>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure}
             */
            export interface Figure extends Element<HTMLElement> {}
            /**
             * Represents a thematic break between paragraph-level elements: for example, a change of scene in a story, or a shift of topic within a section.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr}
             */
            export interface HR extends Element<HTMLHRElement> {}
            /**
             * Represents an item in a list. It must be contained in a parent element: an ordered list (`<ol>`), an unordered list (`<ul>`), or a menu (`<menu>`). In menus and unordered lists, list items are usually displayed using bullet points. In ordered lists, they are usually displayed with an ascending counter on the left, such as a number or letter.
             * @See `<ol>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol}
             * @See `<ul>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul}
             * @See `<menu>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li}
             */
            export interface LI extends Element<HTMLLIElement> {
                /**
                 * This integer attribute indicates the current ordinal value of the list item as defined by the `<ol>` element. The only allowed value for this attribute is a number, even if the list is displayed with Roman numerals or letters. List items that follow this one continue numbering from the value set. The value attribute has no meaning for unordered lists (`<ul>`) or for menus (`<menu>`).
                 * @See `<ol>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol}
                 * @See `<ul>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul}
                 * @See `<menu>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu}
                 */
                value?: string|number
            }
            /**
             * A semantic alternative to `<ul>`, but treated by browsers (and exposed through the accessibility tree) as no different than `<ul>`. It represents an unordered list of items (which are represented by `<li>` elements).
             * @See `<ul>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul}
             * @See `<li>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu}
             */
            export interface Menu extends Element<HTMLMenuElement> {}
            /**
             * Represents an ordered list of items — typically rendered as a numbered list.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol}
             */
            export interface OL extends Element<HTMLOListElement> {
                /**
                 * This Boolean attribute specifies that the list's items are in reverse order. Items will be numbered from high to low.
                 */
                reversed?: Helpers.Booleanish
                /**
                 * An integer to start counting from for the list items. Always an Arabic numeral (1, 2, 3, etc.), even when the numbering `type` is letters or Roman numerals. For example, to start numbering elements from the letter "d" or the Roman numeral "iv," use `start="4"`.
                 */
                start?: number|string
                /**
                 * Sets the numbering type:
                 * - `a` for lowercase letters
                 * - `A` for uppercase letters
                 * - `i` for lowercase Roman numerals
                 * - `I` for uppercase Roman numerals
                 * - `1` for numbers (default)
                 * 
                 * The specified type is used for the entire list unless a different `type` attribute is used on an enclosed `<li>` element.
                 * @See `<li>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li}
                 */
                type?: 'a'|'A'|'i'|'I'|'1'
            }
            /**
             * Represents a paragraph. Paragraphs are usually represented in visual media as blocks of text separated from adjacent blocks by blank lines and/or first-line indentation, but HTML paragraphs can be any structural grouping of related content, such as images or form fields.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p}
             */
            export interface P extends Element<HTMLParagraphElement> {}
            /**
             * Represents preformatted text which is to be presented exactly as written in the HTML file. The text is typically rendered using a non-proportional, or `monospaced`, font. Whitespace inside this element is displayed as written.
             * @See `monospaced` {@link https://en.wikipedia.org/wiki/Monospaced_font}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre}
             */
            export interface Pre extends Element<HTMLPreElement> {}
            /**
             * Represents an unordered list of items, typically rendered as a bulleted list.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul}
             */
            export interface UL extends Element<HTMLUListElement> {}
        }
        /**
         * Use the HTML inline text semantic to define the meaning, structure, or style of a word, line, or any arbitrary piece of text.
         * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element#inline_text_semantics}
         */
        export namespace InlineTextSemantics {
            /**
             * Together with its `href` attribute, creates a hyperlink to web pages, files, email addresses, locations within the current page, or anything else a URL can address.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a}
             */
            export interface A extends Element<HTMLAnchorElement> {
                /**
                 * Causes the browser to treat the linked URL as a download. Can be used with or without a `filename` value:
                 * 
                 * - Without a value, the browser will suggest a filename/extension, generated from various sources:
                 *      - The `Content-Disposition` HTTP header
                 *          - @See `Content-Disposition` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition}
                 *      - The final segment in the URL `path`
                 *          - @See `path` {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname}
                 *      - The `media type` (from the `Content-Type` header, the start of a `data: URL`, or `Blob.type` for a `blob: URL`)
                 *          - @See `media type` {@link https://developer.mozilla.org/en-US/docs/Glossary/MIME_type}
                 *          - @See `Content-Type` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type}
                 *          - @See `data: URL` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs}
                 *          - @See `Blob.type` {@link https://developer.mozilla.org/en-US/docs/Web/API/Blob/type}
                 *          - @See `blob: URL` {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static}
                 * - `filename`: defining a value suggests it as the filename. `/` and `\` characters are converted to underscores (`_`). Filesystems may forbid other characters in filenames, so browsers will adjust the suggested name if necessary.
                 * 
                 * `Note`:
                 * - download only works for `same-origin URLs`, or the `blob:` and `data:` schemes.
                 *      - @See `same-origin URLs` {@link https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy}
                 * - How browsers treat downloads varies by browser, user settings, and other factors. The user may be prompted before a download starts, or the file may be saved automatically, or it may open automatically, either in an external application or in the browser itself.
                 * - If the `Content-Disposition` header has different information from the `download` attribute, resulting behavior may differ:
                 *      - If the header specifies a `filename`, it takes priority over a filename specified in the `download` attribute.
                 *      - If the header specifies a disposition of inline, Chrome and Firefox prioritize the attribute and treat it as a download. Old Firefox versions (before 82) prioritize the header and will display the content inline.
                 */
                download?: string
                /**
                 * The URL that the hyperlink points to. Links are not restricted to HTTP-based URLs — they can use any URL scheme supported by browsers:
                 * - Sections of a page with document fragments
                 * - Specific text portions with `text fragments`
                 *      - @See `text fragments` {@link https://developer.mozilla.org/en-US/docs/Web/Text_fragments}
                 * - Pieces of media files with media fragments
                 * - Telephone numbers with `tel:` URLs
                 * - Email addresses with `mailto:` URLs
                 * - While web browsers may not support other URL schemes, websites can with `registerProtocolHandler()`
                 *      - @See `registerProtocolHandler` {@link https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler}
                 */
                href?: string
                /**
                 * Hints at the human language of the linked URL. No built-in functionality. Allowed values are the same as the `global lang attribute`.
                 * @See `lang` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang}
                 */
                hreflang?: string
                /**
                 * A space-separated list of URLs. When the link is followed, the browser will send `POST requests` with the body `PING` to the URLs. Typically for tracking.
                 * @See `POST requests` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST}
                 */
                ping?: string
                /**
                 * How much of the `referrer` to send when following the link.
                 * - @See `referrer` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer}
                 * 
                 * `values`:
                 * - `no-referrer`: The `Referer` header will not be sent.
                 *      - @See `Referer` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer}
                 * - `no-referrer-when-downgrade`: The `Referer` header will not be sent to origins without `TLS` (`HTTPS`).
                 *      - @See `Referer` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer}
                 *      - @See `TLS` {@link https://developer.mozilla.org/en-US/docs/Glossary/TLS}
                 *      - @See `HTTPS` {@link https://developer.mozilla.org/en-US/docs/Glossary/HTTPS}
                 * - `origin`: The sent referrer will be limited to the origin of the referring page: its `scheme`, `host`, and `port`.
                 *      - @See `scheme` {@link https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL}
                 *      - @See `host` {@link https://developer.mozilla.org/en-US/docs/Glossary/Host}
                 *      - @See `port` {@link https://developer.mozilla.org/en-US/docs/Glossary/Port}
                 * - `origin-when-cross-origin`: The referrer sent to other origins will be limited to the scheme, the host, and the port. Navigations on the same origin will still include the path.
                 * - `same-origin`: A referrer will be sent for `same origin`, but cross-origin requests will contain no referrer information.
                 *      - @See `same-origin` {@link https://developer.mozilla.org/en-US/docs/Glossary/Same-origin_policy}
                 * - `strict-origin`: Only send the origin of the document as the referrer when the protocol security level stays the same (HTTPS→HTTPS), but don't send it to a less secure destination (HTTPS→HTTP).
                 * - `strict-origin-when-cross-origin` (default): Send a full URL when performing a same-origin request, only send the origin when the protocol security level stays the same (HTTPS→HTTPS), and send no header to a less secure destination (HTTPS→HTTP).
                 * - `unsafe-url`: The referrer will include the origin and the path (but not the `fragment`, `password`, or `username`). This value is unsafe, because it leaks origins and paths from TLS-protected resources to insecure origins.
                 *      - @See `fragment` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/hash}
                 *      - @See `password` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/password}
                 *      - @See `username` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/username}
                 */
                referrerpolicy?: 'no-referrer'|'no-referrer-when-downgrade'|'origin'|'origin-when-cross-origin'|'same-origin'|'strict-origin'|'strict-origin-when-cross-origin'|'unsafe-url'
                /**
                 * The relationship of the linked URL as space-separated link types.
                 */
                rel?: string
                /**
                 * Where to display the linked URL, as the name for a browsing context (a tab, window, or `<iframe>`). The following keywords have special meanings for where to load the URL:
                 * - `_self`: the current browsing context. (Default)
                 * - `_blank`: usually a new tab, but users can configure browsers to open a new window instead.
                 * - `_parent`: the parent browsing context of the current one. If no parent, behaves as _self.
                 * - `_top`: the topmost browsing context (the "highest" context that's an ancestor of the current one). If no ancestors, behaves as `_self`.
                 * 
                 * `Note`:
                 * - Setting `target="_blank`" on `<a>` elements implicitly provides the same `rel` behavior as setting `rel="noopener"` which does not set window.opener.
                 *      - @See `rel="noopener"` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/noopener}
                 */
                target?: string
                /**
                 * Hints at the linked URL's format with a `MIME type`. No built-in functionality.
                 * @See `MIME type` {@link https://developer.mozilla.org/en-US/docs/Glossary/MIME_type}
                 */
                type?: string
            }
            /**
             * Represents an abbreviation or acronym.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/abbr}
             */
            export interface Abbr extends Element<HTMLElement> {}
            /**
             * Used to draw the reader's attention to the element's contents, which are not otherwise granted special importance. This was formerly known as the Boldface element, and most browsers still draw the text in boldface. However, you should not use `<b>` for styling text or granting importance. If you wish to create boldface text, you should use the CSS `font-weight` property. If you wish to indicate an element is of special importance, you should use the strong element.
             * @See `font-weight` {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/b}
             */
            export interface B extends Element<HTMLElement> {}
            /**
             * Tells the browser's bidirectional algorithm to treat the text it contains in isolation from its surrounding text. It's particularly useful when a website dynamically inserts some text and doesn't know the directionality of the text being inserted.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi}
             */
            export interface BDI extends Element<HTMLElement> {}
            /**
             * Overrides the current directionality of text, so that the text within is rendered in a different direction.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdo}
             */
            export interface BDO extends Element<HTMLElement> {
                /**
                 * The direction in which text should be rendered in this element's contents. Possible values are:
                 * - `ltr`: Indicates that the text should go in a left-to-right direction.
                 * - `rtl`: Indicates that the text should go in a right-to-left direction.
                 */
                dir?: 'ltr'|'rtl'
            }
            /**
             * Produces a line break in text (carriage-return). It is useful for writing a poem or an address, where the division of lines is significant.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br}
             */
            export interface BR extends Element<HTMLBRElement> {}
            /**
             * Used to mark up the title of a cited creative work. The reference may be in an abbreviated form according to context-appropriate conventions related to citation metadata.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite}
             */
            export interface Cite extends Element<HTMLElement> {}
            /**
             * Displays its contents styled in a fashion intended to indicate that the text is a short fragment of computer code. By default, the content text is displayed using the user agent's default monospace font.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code}
             */
            export interface Code extends Element<HTMLElement> {}
            /**
             * Links a given piece of content with a machine-readable translation. If the content is time- or date-related, the `<time>` element must be used.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/data}
             */
            export interface Data extends Element<HTMLDataElement> {
                /**
                 * This attribute specifies the machine-readable translation of the content of the element.
                 */
                value?: string
            }
            /**
             * Used to indicate the term being defined within the context of a definition phrase or sentence. The ancestor `<p>` element, the `<dt>`/`<dd>` pairing, or the nearest section ancestor of the `<dfn>` element, is considered to be the definition of the term.
             * @See `<p>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p}
             * @See `<dt>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt}
             * @See `<dd>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dfn}
             */
            export interface DFN extends Element<HTMLElement> {}
            /**
             * Marks text that has stress emphasis. The `<em>` element can be nested, with each nesting level indicating a greater degree of emphasis.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em}
             */
            export interface EM extends Element<HTMLElement> {}
            /**
             * Represents a range of text that is set off from the normal text for some reason, such as idiomatic text, technical terms, and taxonomical designations, among others. Historically, these have been presented using italicized type, which is the original source of the `<i>` naming of this element.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/i}
             */
            export interface I extends Element<HTMLElement> {}
            /**
             * Represents a span of inline text denoting textual user input from a keyboard, voice input, or any other text entry device. By convention, the user agent defaults to rendering the contents of a `<kbd>` element using its default monospace font, although this is not mandated by the HTML standard.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd}
             */
            export interface KBD extends Element<HTMLElement> {}
            /**
             * Represents text which is marked or highlighted for reference or notation purposes due to the marked passage's relevance in the enclosing context.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark}
             */
            export interface Mark extends Element<HTMLElement> {}
            /**
             * Indicates that the enclosed text is a short inline quotation. Most modern browsers implement this by surrounding the text in quotation marks. This element is intended for short quotations that don't require paragraph breaks; for long quotations use the `<blockquote>` element.
             * @See `<blockquote>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/q}
             */
            export interface Q extends Element<HTMLElement> {
                /**
                 * The value of this attribute is a URL that designates a source document or message for the information quoted. This attribute is intended to point to information explaining the context or the reference for the quote.
                 */
                cite?: string
            }
            /**
             * Used to provide fall-back parentheses for browsers that do not support the display of ruby annotations using the `<ruby>` element. One <rp> element should enclose each of the opening and closing parentheses that wrap the `<rt>` element that contains the annotation's text.
             * @See `<ruby>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby}
             * @See `<rt>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rt}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rp}
             */
            export interface RP extends Element<HTMLElement> {}
            /**
             * Specifies the ruby text component of a ruby annotation, which is used to provide pronunciation, translation, or transliteration information for East Asian typography. The `<rt>` element must always be contained within a `<ruby>` element.
             * @See `<ruby>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rt}
             */
            export interface RT extends Element<HTMLElement> {}
            /**
             * Represents small annotations that are rendered above, below, or next to base text, usually used for showing the pronunciation of East Asian characters. It can also be used for annotating other kinds of text, but this usage is less common.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby}
             */
            export interface Ruby extends Element<HTMLElement> {}
            /**
             * Renders text with a strikethrough, or a line through it. Use the `<s>` element to represent things that are no longer relevant or no longer accurate. However, `<s>` is not appropriate when indicating document edits; for that, use the del and ins elements, as appropriate.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/s}
             */
            export interface S extends Element<HTMLElement> {}
            /**
             * Used to enclose inline text which represents sample (or quoted) output from a computer program. Its contents are typically rendered using the browser's default monospaced font (such as `Courier` or Lucida Console).
             * @See `Courier` {@link https://en.wikipedia.org/wiki/Courier_(typeface)}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/samp}
             */
            export interface Samp extends Element<HTMLElement> {}
            /**
             * Represents side-comments and small print, like copyright and legal text, independent of its styled presentation. By default, it renders text within it one font size smaller, such as from `small` to `x-small`.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/small}
             */
            export interface Small extends Element<HTMLElement> {}
            /**
             * A generic inline container for phrasing content, which does not inherently represent anything. It can be used to group elements for styling purposes (using the `class` or `id` attributes), or because they share attribute values, such as `lang`. It should be used only when no other semantic element is appropriate. `<span>` is very much like a div element, but div is a `block-level element` whereas a `<span>` is an `inline-level element`.
             * @See `block-level element` {@link https://developer.mozilla.org/en-US/docs/Glossary/Block-level_content}
             * @See `inline-level element` {@link https://developer.mozilla.org/en-US/docs/Glossary/Inline-level_content}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span}
             */
            export interface Span extends Element<HTMLSpanElement> {}
            /**
             * Indicates that its contents have strong importance, seriousness, or urgency. Browsers typically render the contents in bold type.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong}
             */
            export interface Strong extends Element<HTMLElement> {}
            /**
             * Specifies inline text which should be displayed as subscript for solely typographical reasons. Subscripts are typically rendered with a lowered baseline using smaller text.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sub}
             */
            export interface Sub extends Element<HTMLElement> {}
            /**
             * Specifies inline text which is to be displayed as superscript for solely typographical reasons. Superscripts are usually rendered with a raised baseline using smaller text.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sup}
             */
            export interface Sup extends Element<HTMLElement> {}
            /**
             * Represents a specific period in time. It may include the `datetime` attribute to translate dates into machine-readable format, allowing for better search engine results or custom features such as reminders.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time}
             */
            export interface Time extends Element<HTMLTimeElement> {
                /**
                 * This attribute indicates the time and/or date of the element and must be in one of the formats described here: {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time}
                 */
                datetime?: string
            }
            /**
             * Represents a span of inline text which should be rendered in a way that indicates that it has a non-textual annotation. This is rendered by default as a simple solid underline but may be altered using CSS.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/u}
             */
            export interface U extends Element<HTMLElement> {}
            /**
             * Represents the name of a variable in a mathematical expression or a programming context. It's typically presented using an italicized version of the current typeface, although that behavior is browser-dependent.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/var}
             */
            export interface Var extends Element<HTMLElement> {}
            /**
             * Represents a word break opportunity — a position within text where the browser may optionally break a line, though its line-breaking rules would not otherwise create a break at that location.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr}
             */
            export interface WBR extends Element<HTMLElement> {}
        }
        /**
         * HTML supports various multimedia resources such as images, audio, and video.
         * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element#image_and_multimedia}
         */
        export namespace ImageAndMultimedia {
            /**
             * Defines an area inside an image map that has predefined clickable areas. An image map allows geometric areas on an image to be associated with `hyperlink`.
             * @See `hyperlink` {@link https://developer.mozilla.org/en-US/docs/Glossary/Hyperlink}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area}
             */
            export interface Area extends Element<HTMLAreaElement> {
                /**
                 * A text string alternative to display on browsers that do not display images. The text should be phrased so that it presents the user with the same kind of choice as the image would offer when displayed without the alternative text. This attribute is required only if the `href` attribute is used.
                 * @See `href` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area#href}
                 */
                alt?: string
                /**
                 * The `coords` attribute details the coordinates of the `shape` attribute in size, shape, and placement of an `<area>`. This attribute must not be used if `shape` is set to `default`.
                 * - `rect`: the value is `x1,y1,x2,y2`. The value specifies the coordinates of the top-left and bottom-right corner of the rectangle. For example, in `<area shape="rect" coords="0,0,253,27" href="#" target="_blank" alt="Mozilla">` the coordinates are `0,0` and `253,27`, indicating the top-left and bottom-right corners of the rectangle, respectively.
                 * - `circle`: the value is `x,y,radius`. Value specifies the coordinates of the circle center and the radius. For example: `<area shape="circle" coords="130,136,60" href="#" target="_blank" alt="MDN">`
                 * - `poly`: the value is `x1,y1,x2,y2,..,xn,yn`. Value specifies the coordinates of the edges of the polygon. If the first and last coordinate pairs are not the same, the browser will add the last coordinate pair to close the polygon
                 * The values are numbers of CSS pixels.
                 * 
                 * @See `shape` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area#shape}
                 */
                coords?: string
                /**
                 * This attribute, if present, indicates that the author intends the hyperlink to be used for downloading a resource. See `<a>` for a full description of the `download` attribute.
                 * @See `<a>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a}
                 * @See `download` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download}
                 */
                download?: string
                /**
                 * The hyperlink target for the area. Its value is a valid URL. This attribute may be omitted; if so, the `<area>` element does not represent a hyperlink.
                 */
                href?: string
                /**
                 * Contains a space-separated list of URLs to which, when the hyperlink is followed, `POST requests` with the body `PING` will be sent by the browser (in the background). Typically used for tracking.
                 * @See `POST requests` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST}
                 */
                ping?: string
                /**
                 * A string indicating which referrer to use when fetching the resource:
                 * - `no-referrer`: The `Referer` header will not be sent.
                 *      - @See `Referer` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer}
                 * - `no-referrer-when-downgrade`: The `Referer` header will not be sent to `origins` without `TLS` (`HTTPS`).
                 *      - @See `Referer` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer}
                 *      - @See `origins` {@link https://developer.mozilla.org/en-US/docs/Glossary/Origin}
                 *      - @See `TLS` {@link https://developer.mozilla.org/en-US/docs/Glossary/TLS}
                 *      - @See `HTTPS` {@link https://developer.mozilla.org/en-US/docs/Glossary/HTTPS}
                 * - `origin`: The sent referrer will be limited to the origin of the referring page: its `scheme`, `host`, and `port`.
                 *      - @See `scheme` {@link https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL}
                 *      - @See `host` {@link https://developer.mozilla.org/en-US/docs/Glossary/Host}
                 *      - @See `port` {@link https://developer.mozilla.org/en-US/docs/Glossary/Port}
                 * - `origin-when-cross-origin`: The referrer sent to other origins will be limited to the scheme, the host, and the port. Navigations on the same origin will still include the path.
                 * - `same-origin`: A referrer will be sent for `same origin`, but cross-origin requests will contain no referrer information.
                 *      - @See `same origin` {@link https://developer.mozilla.org/en-US/docs/Glossary/Same-origin_policy}
                 * - `strict-origin`: Only send the origin of the document as the referrer when the protocol security level stays the same (HTTPS→HTTPS), but don't send it to a less secure destination (HTTPS→HTTP).
                 * - `strict-origin-when-cross-origin` (default): Send a full URL when performing a same-origin request, only send the origin when the protocol security level stays the same (HTTPS→HTTPS), and send no header to a less secure destination (HTTPS→HTTP).
                 * - `unsafe-url`: The referrer will include the origin and the path (but not the `fragment`, `password`, or `username`). This value is unsafe, because it leaks origins and paths from TLS-protected resources to insecure origins.
                 *      - @See `fragment` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/hash}
                 *      - @See `password` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/password}
                 *      - @See `username` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/username}
                 */
                referrerpolicy?: string
                /**
                 * For anchors containing the `href` attribute, this attribute specifies the relationship of the target object to the link object. The value is a space-separated list of link types. The values and their semantics will be registered by some authority that might have meaning to the document author. The default relationship, if no other is given, is void. Use this attribute only if the `href` attribute is present.
                 * @See `href` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area#href}
                 */
                rel?: string
                /**
                 * The shape of the associated hot spot. The specifications for HTML defines the values `rect`, which defines a rectangular region; `circle`, which defines a circular region; `poly`, which defines a polygon; and `default`, which indicates the entire region beyond any defined shapes.
                 */
                shape?: 'rect'|'circle'|'poly'|'default'
                /**
                 * A keyword or author-defined name of the `browsing context` to display the linked resource. The following keywords have special meanings:
                 * 
                 * - `_self` (default): Show the resource in the current browsing context.
                 * -  `_blank`: Show the resource in a new, unnamed browsing context.
                 * - `_parent`: Show the resource in the parent browsing context of the current one, if the current page is inside a frame. If there is no parent, acts the same as `_self`.
                 * - `_top`: Show the resource in the topmost browsing context (the browsing context that is an ancestor of the current one and has no parent). If there is no parent, acts the same as `_self`.
                 * 
                 * Use this attribute only if the `href` attribute is present.
                 * 
                 * @See `browsing context` {@link https://developer.mozilla.org/en-US/docs/Glossary/Browsing_context}
                 */
                target?: '_self'|'_blank'|'_parent'|'_top'
            }
            /**
             * Used to embed sound content in documents. It may contain one or more audio sources, represented using the `src` attribute or the source element: the browser will choose the most suitable one. It can also be the destination for streamed media, using a `MediaStream`.
             * @See `MediaStream` {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaStream}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}
             */
            export interface Audio extends Element<HTMLAudioElement> {
                /**
                 * A Boolean attribute: if specified, the audio will automatically begin playback as soon as it can do so, without waiting for the entire audio file to finish downloading.
                 * 
                 * `Note`:
                 * - Sites that automatically play audio (or videos with an audio track) can be an unpleasant experience for users, so should be avoided when possible. If you must offer autoplay functionality, you should make it opt-in (requiring a user to specifically enable it). However, this can be useful when creating media elements whose source will be set at a later time, under user control. See our autoplay guide for additional information about how to properly use autoplay.
                 */
                autoplay?: Helpers.Booleanish
                /**
                 * If this attribute is present, the browser will offer controls to allow the user to control audio playback, including volume, seeking, and pause/resume playback.
                 */
                controls?: string
                /**
                 * `Experimental` Check cross-browser support before using.
                 * 
                 * The `controlslist` attribute, when specified, helps the browser select what controls to show for the `<audio>` element whenever the browser shows its own set of controls (that is, when the `controls` attribute is specified).
                 * The allowed values are `nodownload`, `nofullscreen` and `noremoteplayback`.
                 */
                controlslist?: 'nodownload'|'nofullscreen'|'noremoteplayback'
                /**
                 * This `enumerated` attribute indicates whether to use CORS to fetch the related audio file. `CORS-enabled resources` can be reused in the `<canvas>` element without being tainted. The allowed values are:
                 * 
                 * - `anonymous`
                 *      - Sends a cross-origin request without a credential. In other words, it sends the `Origin`: HTTP header without a cookie, X.509 certificate, or performing HTTP Basic authentication. If the server does not give credentials to the origin site (by not setting the `Access-Control-Allow-Origin:` HTTP header), the resource will be tainted, and its usage restricted.
                 * - `use-credentials`
                 *      - Sends a cross-origin request with a credential. In other words, it sends the `Origin`: HTTP header with a cookie, a certificate, or performing HTTP Basic authentication. If the server does not give credentials to the origin site (through `Access-Control-Allow-Credentials`: HTTP header), the resource will be tainted and its usage restricted.
                 * 
                 * When not present, the resource is fetched without a CORS request (i.e. without sending the `Origin`: HTTP header), preventing its non-tainted use in <canvas> elements. If invalid, it is handled as if the enumerated keyword anonymous was used. See CORS settings attributes for additional information.
                 * 
                 * @See `enumerated` {@link https://developer.mozilla.org/en-US/docs/Glossary/Enumerated}
                 * @See `CORS-enabled resources` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image}
                 * @See `<canvas>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas}
                 * @See `CORS settings attributes` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin} 
                 */
                crossorigin?: 'anonymous'|'use-credentials'
                /**
                 * A Boolean attribute used to disable the capability of remote playback in devices that are attached using wired (HDMI, DVI, etc.) and wireless technologies (Miracast, Chromecast, DLNA, AirPlay, etc.). See this proposed specification for more information: {@link https://www.w3.org/TR/remote-playback/#the-disableremoteplayback-attribute}
                 * 
                 * `Note`:
                 * - Note: In Safari, you can use `x-webkit-airplay="deny"` as a fallback.
                 *      - @See `x-webkit-airplay="deny"` {@link https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/AirPlayGuide/OptingInorOutofAirPlay/OptingInorOutofAirPlay.html}
                 */
                disableremoteplayback?: Helpers.Booleanish
                /**
                 * A Boolean attribute: if specified, the audio player will automatically seek back to the start upon reaching the end of the audio.
                 */
                loop?: Helpers.Booleanish
                /**
                 * A Boolean attribute that indicates whether the audio will be initially silenced. Its default value is `false`.
                 */
                muted?: Helpers.Booleanish
                /**
                 * This `enumerated` attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. It may have one of the following values:
                 * 
                 * - `none`: Indicates that the audio should not be preloaded.
                 * - `metadata`: Indicates that only audio metadata (e.g. length) is fetched.
                 * - `auto`: Indicates that the whole audio file can be downloaded, even if the user is not expected to use it.
                 * - empty string: A synonym of the `auto` value.
                 * 
                 * The default value is different for each browser. The spec advises it to be set to `metadata`.
                 * 
                 * `Note`:
                 * - The `autoplay` attribute has precedence over `preload`. If `autoplay` is specified, the browser would obviously need to start downloading the audio for playback.
                 * - The browser is not forced by the specification to follow the value of this attribute; it is a mere hint.
                 * 
                 * @See `enumerated` {@link https://developer.mozilla.org/en-US/docs/Glossary/Enumerated}
                 */
                preload?: 'none'|'metadata'|'auto'|''
                /**
                 * The URL of the audio to embed. This is subject to `HTTP access controls`. This is optional; you may instead use the `<source>` element within the audio block to specify the audio to embed.
                 * 
                 * @See `HTTP access controls` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS}
                 * @See `<source>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source}
                 */
                src?: string
                /**
                 * The input buffer of a `ScriptProcessorNode` is ready to be processed.
                 * @See `ScriptProcessorNode` {@link https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode}
                 */
                onAudioProcess?: Events.EventHandler<Events.Event<'audioprocess', HTMLAudioElement>>
                /**
                 * The browser can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.
                 */
                onCanPlay?: Events.EventHandler<Events.Event<'canplay', HTMLAudioElement>>
                /**
                 * The browser estimates it can play the media up to its end without stopping for content buffering.
                 */
                onCanPlayThrough?: Events.EventHandler<Events.Event<'canplaythrough', HTMLAudioElement>>
                /**
                 * The rendering of an `OfflineAudioContext` is terminated.
                 * @See `OfflineAudioContext` {@link https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext}
                 */
                onComplete?: Events.EventHandler<Events.Event<'complete', HTMLAudioElement>>
                /**
                 * The `duration` attribute has been updated.
                 */
                onDurationChange?: Events.EventHandler<Events.Event<'durationchange', HTMLAudioElement>>
                /**
                 * The media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the `HTMLMediaElement.load` method is called to reload it.
                 * @See `HTMLMediaElement.load` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/load}
                 */
                onEmptied?: Events.EventHandler<Events.Event<'emptied', HTMLAudioElement>>
                /**
                 * Playback has stopped because the end of the media was reached.
                 */
                onEnded?: Events.EventHandler<Events.Event<'ended', HTMLAudioElement>>
                /**
                 * The first frame of the media has finished loading.
                 */
                onLoadedData?: Events.EventHandler<Events.Event<'loadeddata', HTMLAudioElement>>
                /**
                 * The metadata has been loaded.
                 */
                onLoadedMetadata?: Events.EventHandler<Events.Event<'loadedmetadata', HTMLAudioElement>>
                /**
                 * Fired when the browser has started to load the resource.
                 */
                onLoadStart?: Events.EventHandler<Events.Event<'loadstart', HTMLAudioElement>>
                /**
                 * Playback has been paused.
                 */
                onPause?: Events.EventHandler<Events.Event<'pause', HTMLAudioElement>>
                /**
                 * Playback has begun.
                 */
                onPlay?: Events.EventHandler<Events.Event<'play', HTMLAudioElement>>
                /**
                 * Playback is ready to start after having been paused or delayed due to lack of data.
                 */
                onPlaying?: Events.EventHandler<Events.Event<'playing', HTMLAudioElement>>
                /**
                 * The playback rate has changed.
                 */
                onRateChange?: Events.EventHandler<Events.Event<'ratechange', HTMLAudioElement>>
                /**
                 * A seek operation completed.
                 */
                onSeeked?: Events.EventHandler<Events.Event<'seeked', HTMLAudioElement>>
                /**
                 * A seek operation began.
                 */
                onSeeking?: Events.EventHandler<Events.Event<'seeking', HTMLAudioElement>>
                /**
                 * The user agent is trying to fetch media data, but data is unexpectedly not forthcoming.
                 */
                onStalled?: Events.EventHandler<Events.Event<'stalled', HTMLAudioElement>>
                /**
                 * Media data loading has been suspended.
                 */
                onSuspend?: Events.EventHandler<Events.Event<'suspend', HTMLAudioElement>>
                /**
                 * The time indicated by the `currentTime` attribute has been updated.
                 */
                onTimeUpdate?: Events.EventHandler<Events.Event<'timeupdate', HTMLAudioElement>>
                /**
                 * The volume has changed.
                 */
                onVolumeChange?: Events.EventHandler<Events.Event<'volumechange', HTMLAudioElement>>
                /**
                 * Playback has stopped because of a temporary lack of data
                 */
                onWaiting?: Events.EventHandler<Events.Event<'waiting', HTMLAudioElement>>
            }
            /**
             * Embeds an image into the document.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img}
             */
            export interface Img extends Element<HTMLImageElement> {
                /**
                 * Defines an alternative text description of the image.
                 * 
                 * `Note`: Browsers do not always display images. There are a number of situations in which a browser might not display images, such as:
                 * - Non-visual browsers (such as those used by people with visual impairments)
                 * - The user chooses not to display images (saving bandwidth, privacy reasons)
                 * - The image is invalid or an `unsupported type`
                 *      - @See `unsuported type` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#supported_image_formats}
                 * - In these cases, the browser may replace the image with the text in the element's `alt` attribute. For these reasons and others, provide a useful value for `alt` whenever possible.
                 * 
                 * Setting this attribute to an empty string (`alt=""`) indicates that this image is not a key part of the content (it's decoration or a tracking pixel), and that non-visual browsers may omit it from `rendering`. Visual browsers will also hide the broken image icon if the `alt` attribute is empty and the image failed to display.
                 * 
                 * This attribute is also used when copying and pasting the image to text, or saving a linked image to a bookmark.
                 * 
                 * @See `rendering` {@link https://developer.mozilla.org/en-US/docs/Glossary/Rendering_engine}
                 */
                alt?: string
                /**
                 * Indicates if the fetching of the image must be done using a `CORS` request. Image data from a `CORS-enabled image` returned from a CORS request can be reused in the `<canvas>` element without being marked `"tainted"`.
                 * - @See `CORS` {@link https://developer.mozilla.org/en-US/docs/Glossary/CORS}
                 * - @See `CORS-enabled image` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image}
                 * - @See `<canvas>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas}
                 * - @See `tainted` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image#what_is_a_tainted_canvas}
                 * 
                 * If the `crossorigin` attribute is not specified, then a non-CORS request is sent (without the `Origin` request header), and the browser marks the image as tainted and restricts access to its image data, preventing its usage in `<canvas>` elements.
                 * - @See `Origin` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin}
                 * - @See `<canvas>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas}
                 * 
                 * If the `crossorigin` attribute is specified, then a CORS request is sent (with the `Origin` request header); but if the server does not opt into allowing cross-origin access to the image data by the origin site (by not sending any `Access-Control-Allow-Origin` response header, or by not including the site's origin in any Access-Control-Allow-Origin response header it does send), then the browser blocks the image from loading, and logs a CORS error to the devtools console.
                 * - @See `Origin` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin}
                 * - @See `Access-Control-Allow-Origin` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin}
                 * 
                 * Allowed values:
                 * `anonymous`
                 * - A CORS request is sent with credentials omitted (that is, no `cookies`, `X.509 certificates`, or `Authorization` request header).
                 *      - @See `cookies` {@link https://developer.mozilla.org/en-US/docs/Glossary/Cookie}
                 *      - @See `X.509 certificates` {@link https://datatracker.ietf.org/doc/html/rfc5280}
                 *      - @See `Authorization`{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization}
                 * 
                 * `use-credentials`
                 * - The CORS request is sent with any credentials included (that is, cookies, X.509 certificates, and the `Authorization` request header). If the server does not opt into sharing credentials with the origin site (by sending back the `Access-Control-Allow-Credentials: true` response header), then the browser marks the image as tainted and restricts access to its image data.
                 * 
                 * If the attribute has an invalid value, browsers handle it as if the `anonymous` value was used. See `CORS settings attributes` for additional information.
                 * - @See `CORS settings attributes` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin}
                 */
                crossorigin?: string
                /**
                 * This attribute provides a hint to the browser as to whether it should perform image decoding along with rendering the other DOM content in a single presentation step that looks more "correct" (`sync`), or render and present the other DOM content first and then decode the image and present it later (`async`). In practice, `async` means that the next paint does not wait for the image to decode.
                 * 
                 * It is often difficult to perceive any noticeable effect when using `decoding` on static `<img>` elements. They'll likely be initially rendered as empty images while the image files are fetched (either from the network or from the cache) and then handled independently anyway, so the "syncing" of content updates is less apparent. However, the blocking of rendering while decoding happens, while often quite small, can be measured — even if it is difficult to observe with the human eye. @See `What does the image decoding attribute actually do?` {@link https://www.tunetheweb.com/blog/what-does-the-image-decoding-attribute-actually-do/} for a more detailed analysis (tunetheweb.com, 2023).
                 * 
                 * Using different `decoding` types can result in more noticeable differences when dynamically inserting `<img>` elements into the DOM via JavaScript — see `HTMLImageElement.decoding` for more details.
                 * - @See `HTMLImageElement.decoding` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding}
                 * 
                 * Allowed values:
                 * 
                 * `sync`
                 * - Decode the image synchronously along with rendering the other DOM content, and present everything together.
                 * 
                 * `async`
                 * - Decode the image asynchronously, after rendering and presenting the other DOM content.
                 * 
                 * `auto`
                 * - No preference for the decoding mode; the browser decides what is best for the user. This is the default value.
                 */
                decoding?: string
                /**
                 * Marks the image for observation by the `PerformanceElementTiming` API. The value given becomes an identifier for the observed image element. See also the `elementtiming` attribute page.
                 * @See `PerformanceElementTiming` {@link https://developer.mozilla.org/en-US/docs/Web/API/PerformanceElementTiming}
                 * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/elementtiming}
                 */
                elementtiming?: string
                /**
                 * `Experimental`
                 * 
                 * Provides a hint of the relative priority to use when fetching the image. Allowed values:
                 * 
                 * `high`
                 * - Signals a high-priority fetch relative to other images.
                 * 
                 * `low`
                 * - Signals a low-priority fetch relative to other images.
                 * 
                 * `auto`
                 * - Default: Signals automatic determination of fetch priority relative to other images.
                 */
                fetchpriority?: 'high'|'low'|'auto'
                /**
                 * The intrinsic height of the image, in pixels. Must be an integer without a unit.
                 * 
                 * `Note`:
                 * - Including `height` and `width` enables the aspect ratio of the image to be calculated by the browser prior to the image being loaded. This aspect ratio is used to reserve the space needed to display the image, reducing or even preventing a layout shift when the image is downloaded and painted to the screen. Reducing layout shift is a major component of good user experience and web performance.
                 *      - @See `width` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#width}
                 */
                height?: number|string
                /**
                 * This Boolean attribute indicates that the image is part of a `server-side map`. If so, the coordinates where the user clicked on the image are sent to the server.
                 * 
                 * @See `server-side map` {@link https://en.wikipedia.org/wiki/Image_map#Server-side}
                 * 
                 * `Note`:
                 * - This attribute is allowed only if the `<img>` element is a descendant of an `<a>` element with a valid `href` attribute. This gives users without pointing devices a fallback destination.
                 *      - @See `<a>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a}
                 *      - @See `href` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href}
                 */
                ismap?: Helpers.Booleanish
                /**
                 * Indicates how the browser should load the image:
                 * 
                 * `eager`
                 * - Loads the image immediately, regardless of whether or not the image is currently within the visible viewport (this is the default value).
                 * 
                 * `lazy`
                 * - Defers loading the image until it reaches a calculated distance from the viewport, as defined by the browser. The intent is to avoid the network and storage bandwidth needed to handle the image until it's reasonably certain that it will be needed. This generally improves the performance of the content in most typical use cases.
                 * 
                 * `Note`:
                 * - Loading is only deferred when JavaScript is enabled. This is an anti-tracking measure, because if a user agent supported lazy loading when scripting is disabled, it would still be possible for a site to track a user's approximate scroll position throughout a session, by strategically placing images in a page's markup such that a server can track how many images are requested and when.
                 */
                loading?: 'eager'|'lazy'
                /**
                 * A string indicating which referrer to use when fetching the resource:
                 * 
                 * - `no-referrer`: The `Referer` header will not be sent.
                 *      - @See `Referer` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer}
                 * - `no-referrer-when-downgrade`: The `Referer` header will not be sent to `origins` without `TLS` (`HTTPS`).
                 *      - @See `Referer` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer}
                 *      - @See `origins` {@link https://developer.mozilla.org/en-US/docs/Glossary/Origin}
                 *      - @See `TLS` {@link https://developer.mozilla.org/en-US/docs/Glossary/TLS}
                 *      - @See `HTTPS` {@link https://developer.mozilla.org/en-US/docs/Glossary/HTTPS}
                 * - `origin`: The sent referrer will be limited to the origin of the referring page: its `scheme`, `host`, and `port`.
                 *      - @See `scheme` {@link https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL}
                 *      - @See `host` {@link https://developer.mozilla.org/en-US/docs/Glossary/Host}
                 *      - @See `port` {@link https://developer.mozilla.org/en-US/docs/Glossary/Port}
                 * - `origin-when-cross-origin`: The referrer sent to other origins will be limited to the scheme, the host, and the port. Navigations on the same origin will still include the path.
                 * - `same-origin`: A referrer will be sent for `same origin`, but cross-origin requests will contain no referrer information.
                 *      - @See `same-origin` {@link https://developer.mozilla.org/en-US/docs/Glossary/Same-origin_policy}
                 * - `strict-origin`: Only send the origin of the document as the referrer when the protocol security level stays the same (HTTPS→HTTPS), but don't send it to a less secure destination (HTTPS→HTTP).
                 * - `strict-origin-when-cross-origin`: (default): Send a full URL when performing a same-origin request, only send the origin when the protocol security level stays the same (HTTPS→HTTPS), and send no header to a less secure destination (HTTPS→HTTP).
                 * - `unsafe-url`: The referrer will include the origin and the path (but not the `fragment`, `password`, or `username`). This value is unsafe, because it leaks origins and paths from TLS-protected resources to insecure origins.
                 *      - @See `fragment` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/hash}
                 *      - @See `password` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/password}
                 *      - @See `username` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/username}
                 */
                referrerpolicy?: 'no-referrer'|'no-referrer-when-downgrade'|'origin'|'origin-when-cross-origin'|'same-origin'|'strict-origin'|'strict-origin-when-cross-origin'|'unsafe-url'
                /**
                 * One or more strings separated by commas, indicating a set of source sizes. Each source size consists of:
                 * - A `media condition`. This must be omitted for the last item in the list.
                 *      - @See `media condition` {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries#syntax}
                 * - A source size value
                 * 
                 * Media Conditions describe properties of the viewport, not of the image. For example, `(max-height: 500px) 1000px` proposes to use a source of 1000px width, if the viewport is not higher than 500px
                 * 
                 * Source size values specify the intended display size of the image. `User agents` use the current source size to select one of the sources supplied by the `srcset` attribute, when those sources are described using width (`w`) descriptors. The selected source size affects the intrinsic size of the image (the image's display size if no `CSS` styling is applied). If the `srcset` attribute is absent, or contains no values with a width descriptor, then the `sizes` attribute has no effect.
                 * 
                 * @See `User agents` {@link https://developer.mozilla.org/en-US/docs/Glossary/User_agent}
                 * @See `CSS` {@link https://developer.mozilla.org/en-US/docs/Glossary/CSS}
                 */
                sizes?: string
                /**
                 * The image `URL`. Mandatory for the `<img>` element. On `browsers` supporting `srcset`, `src` is treated like a candidate image with a pixel density descriptor `1x`, unless an image with this pixel density descriptor is already defined in `srcset`, or unless srcset contains `w` descriptors.
                 * @See `URL` {@link https://developer.mozilla.org/en-US/docs/Glossary/URL}
                 */
                src?: string
                /**
                 * One or more strings separated by commas, indicating possible image sources for the `user agent` to use. Each string is composed of:
                 * @See `user agent` {@link https://developer.mozilla.org/en-US/docs/Glossary/User_agent}
                 * 
                 * - A URL to an image
                 *      - @See `URL` {@link https://developer.mozilla.org/en-US/docs/Glossary/URL}
                 * - Optionally, whitespace followed by one of:
                 *      - A width descriptor (a positive integer directly followed by `w`). The width descriptor is divided by the source size given in the `sizes` attribute to calculate the effective pixel density.
                 *      - A pixel density descriptor (a positive floating point number directly followed by `x`).
                 * 
                 * If no descriptor is specified, the source is assigned the default descriptor of `1x`.
                 * 
                 * It is incorrect to mix width descriptors and pixel density descriptors in the same `srcset` attribute. Duplicate descriptors (for instance, two sources in the same `srcset` which are both described with `2x`) are also invalid.
                 * 
                 * If the `srcset` attribute uses width descriptors, the `sizes` attribute must also be present, or the `srcset` itself will be ignored.
                 * 
                 * The user agent selects any of the available sources at its discretion. This provides them with significant leeway to tailor their selection based on things like user preferences or `bandwidth` conditions. See {@link https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images} for an example.
                 * 
                 * @See `bandwidth` {@link https://developer.mozilla.org/en-US/docs/Glossary/Bandwidth}
                 */
                srcset?: string
                /**
                 * The intrinsic width of the image in pixels. Must be an integer without a unit.
                 */
                width?: number|string
                /**
                 * The partial URL (starting with #) of an image map associated with the element.
                 * 
                 * `Note`:
                 * - You cannot use this attribute if the `<img>` element is inside an `<a>` or `<button>` element.
                 * 
                 * @See `URL` {@link https://developer.mozilla.org/en-US/docs/Glossary/URL}
                 * @See `image map` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map}
                 * @See `<a>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a}
                 * @See `<button>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button}
                */
                usemap?: `#${string}`
            }
            /**
             * Used with `<area>` elements to define an image map (a clickable link area).
             * @See `<area>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map}
             */
            export interface Map extends Element<HTMLMapElement> {
                /**
                 * The `name` attribute gives the map a name so that it can be referenced. The attribute must be present and must have a non-empty value with no space characters. The value of the `name` attribute must not be equal to the value of the `name` attribute of another `<map>` element in the same document. If the `id` attribute is also specified, both attributes must have the same value.
                 * @See `id` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#id}
                 */
                name?: string
            }
            /**
             * Used as a child of the media elements, audio and video. It lets you specify timed text tracks (or time-based data), for example to automatically handle subtitles. The tracks are formatted in `WebVTT format` (`.vtt` files)—Web Video Text Tracks.
             * @See `WebVTT format` {@link https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API}
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track}
             */
            export interface Track extends Element<HTMLTrackElement> {
                /**
                 * This attribute indicates that the track should be enabled unless the user's preferences indicate that another track is more appropriate. This may only be used on one `<track>` element per media element.
                 */
                default?: string
                /**
                 * How the text track is meant to be used. If omitted the default kind is `subtitles`. If the attribute contains an invalid value, it will use `metadata` (Versions of Chrome earlier than 52 treated an invalid value as `subtitles`). The following keywords are allowed:
                 * 
                 * - `subtitles`
                 *      - Subtitles provide translation of content that cannot be understood by the viewer. For example speech or text that is not English in an English language film.
                 *      - Subtitles may contain additional content, usually extra background information. For example the text at the beginning of the Star Wars films, or the date, time, and location of a scene.
                 * - `captions`
                 *      - Closed captions provide a transcription and possibly a translation of audio.
                 *      - It may include important non-verbal information such as music cues or sound effects. It may indicate the cue's source (e.g. music, text, character).
                 *      - Suitable for users who are deaf or when the sound is muted.
                 * - `descriptions`
                 *      - Textual description of the video content.
                 *      - Suitable for users who are blind or where the video cannot be seen.
                 * - `chapters`
                 *      - Chapter titles are intended to be used when the user is navigating the media resource.
                 * - `metadata`
                 *      - Tracks used by scripts. Not visible to the user.
                 */
                kind?: string
                /**
                 * A user-readable title of the text track which is used by the browser when listing available text tracks.
                 */
                label?: string
                /**
                 * Address of the track (`.vtt` file). Must be a valid URL. This attribute must be specified and its URL value must have the same origin as the document — unless the `<audio>` or `<video>` parent element of the `track` element has a `crossorigin` attribute.
                 */
                src?: string
                /**
                 * Language of the track text data. It must be a valid `BCP 47` language tag. If the `kind` attribute is set to `subtitles`, then `srclang` must be defined.
                 * @See `BCP 47` {@link https://r12a.github.io/app-subtags/}
                 */
                srclang?: string
            }
            /**
             * Embeds a media player which supports video playback into the document. You can also use `<video>` for audio content, but the audio element may provide a more appropriate user experience.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
             */
            export interface Video extends Element<HTMLVideoElement> {
                /**
                 * A Boolean attribute; if specified, the video automatically begins to play back as soon as it can do so without stopping to finish loading the data.
                 * 
                 * `Note`:
                 * - Sites that automatically play audio (or videos with an audio track) can be an unpleasant experience for users, so should be avoided when possible. If you must offer autoplay functionality, you should make it opt-in (requiring a user to specifically enable it). However, this can be useful when creating media elements whose source will be set at a later time, under user control. See {@link https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide} for additional information about how to properly use autoplay.
                 * 
                 * To disable video autoplay, `autoplay="false"` will not work; the video will autoplay if the attribute is there in the `<video>` tag at all. To remove autoplay, the attribute needs to be removed altogether.
                 * 
                 * In some browsers (e.g. Chrome 70.0) autoplay doesn't work if no `muted` attribute is present.
                 */
                autoplay?: Helpers.Booleanish
                /**
                 * If this attribute is present, the browser will offer controls to allow the user to control video playback, including volume, seeking, and pause/resume playback.
                 */
                controls?: string
                /**
                 * `Experimental` Check cross-browser support before using.
                 * 
                 * The `controlslist` attribute, when specified, helps the browser select what controls to show for the `<video>` element whenever the browser shows its own set of `controls` (that is, when the controls attribute is specified).
                 * 
                 * The allowed values are `nodownload`, `nofullscreen` and `noremoteplayback`.
                 * 
                 * Use the `disablepictureinpicture` attribute if you want to disable the Picture-In-Picture mode (and the control).
                 * 
                 * @See `disablepictureinpicture` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#disablepictureinpicture}
                 * @See {@link https://wicg.github.io/controls-list/explainer.html}
                 */
                controlslist?: string
                /**
                 * This `enumerated` attribute indicates whether to use CORS to fetch the related video. `CORS-enabled resources` can be reused in the `<canvas>` element without being tainted. The allowed values are:
                 * - @See `enumerated` {@link https://developer.mozilla.org/en-US/docs/Glossary/Enumerated}
                 * - @See `CORS-enabled resources` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image}
                 * - @See `<canvas>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas}
                 * 
                 * `anonymous`
                 * - Sends a cross-origin request without a credential. In other words, it sends the `Origin`: HTTP header without a cookie, X.509 certificate, or performing HTTP Basic authentication. If the server does not give credentials to the origin site (by not setting the `Access-Control-Allow-Origin`: HTTP header), the resource will be tainted, and its usage restricted.
                 * 
                 * `use-credentials`
                 * - Sends a cross-origin request with a credential. In other words, it sends the `Origin`: HTTP header with a cookie, a certificate, or performing HTTP Basic authentication. If the server does not give credentials to the origin site (through `Access-Control-Allow-Credentials`: HTTP header), the resource will be tainted and its usage restricted.
                 * 
                 * When not present, the resource is fetched without a CORS request (i.e. without sending the `Origin`: HTTP header), preventing its non-tainted use in `<canvas>` elements. If invalid, it is handled as if the enumerated keyword `anonymous` was used. See `CORS settings attributes` for additional information.
                 * - @See `<canvas>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas}
                 * - @See `CORS settings attributes` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin}
                 */
                crossorigin?: 'anonymous'|'use-credentials'
                /**
                 * `Experimental`
                 * Prevents the browser from suggesting a Picture-in-Picture context menu or to request Picture-in-Picture automatically in some cases.
                 */
                disablepictureinpicture?: Helpers.Booleanish
                /**
                 * `Experimental`
                 * A Boolean attribute used to disable the capability of remote playback in devices that are attached using wired (HDMI, DVI, etc.) and wireless technologies (Miracast, Chromecast, DLNA, AirPlay, etc.).
                 * 
                 * In Safari, you can use `x-webkit-airplay="deny"` as a fallback.
                 * 
                 * @See `x-webkit-airplay="deny"` {@link https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/AirPlayGuide/OptingInorOutofAirPlay/OptingInorOutofAirPlay.html}
                 */
                disableremoteplayback?: Helpers.Booleanish
                /**
                 * The height of the video's display area, in `CSS pixels` (absolute values only; `no percentages`).
                 * @See `CSS pixels` {@link https://drafts.csswg.org/css-values/#px}
                 * @See `no percentages` {@link https://html.spec.whatwg.org/multipage/embedded-content.html#dimension-attributes}
                 */
                height?: number|string
                /**
                 * A Boolean attribute; if specified, the browser will automatically seek back to the start upon reaching the end of the video.
                 */
                loop?: Helpers.Booleanish
                /**
                 * A Boolean attribute that indicates the default setting of the audio contained in the video. If set, the audio will be initially silenced. Its default value is `false`, meaning that the audio will be played when the video is played.
                 */
                muted?: Helpers.Booleanish
                /**
                 * A Boolean attribute indicating that the video is to be played "inline", that is within the element's playback area. Note that the absence of this attribute does not imply that the video will always be played in fullscreen.
                 */
                playsinline?: Helpers.Booleanish
                /**
                 * A URL for an image to be shown while the video is downloading. If this attribute isn't specified, nothing is displayed until the first frame is available, then the first frame is shown as the poster frame.
                 */
                poster?: string
                /**
                 * This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience regarding what content is loaded before the video is played. It may have one of the following values:
                 * - `none`: Indicates that the video should not be preloaded.
                 * - `metadata`: Indicates that only video metadata (e.g. length) is fetched.
                 * - `auto`: Indicates that the whole video file can be downloaded, even if the user is not expected to use it.
                 * - empty string: Synonym of the `auto` value.
                 * 
                 * The default value is different for each browser. The spec advises it to be set to `metadata`.
                 * 
                 * `Note`:
                 * - The `autoplay` attribute has precedence over `preload`. If `autoplay` is specified, the browser would obviously need to start downloading the video for playback.
                 * - The specification does not force the browser to follow the value of this attribute; it is a mere hint.
                 */
                preload?: 'none'|'metadata'|'auto'|''
                /**
                 * The URL of the video to embed. This is optional; you may instead use the `<source>` element within the video block to specify the video to embed.
                 * @See `<source>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source}
                 */
                src?: string
                /**
                 * The width of the video's display area, in `CSS pixels` (absolute values only; `no percentages`).
                 * @See `CSS pixels` {@link https://drafts.csswg.org/css-values/#px}
                 * @See `no percentages` {@link https://html.spec.whatwg.org/multipage/embedded-content.html#dimension-attributes}
                 */
                width?: number|string
                /**
                 * The input buffer of a `ScriptProcessorNode` is ready to be processed.
                 * @See `ScriptProcessorNode` {@link https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode}
                 */
                onAudioProcess?: Events.EventHandler<Events.Event<'audioprocess', HTMLVideoElement>>
                /**
                 * The browser can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.
                 */
                onCanPlay?: Events.EventHandler<Events.Event<'canplay', HTMLVideoElement>>
                /**
                 * The browser estimates it can play the media up to its end without stopping for content buffering.
                 */
                onCanPlayThrough?: Events.EventHandler<Events.Event<'canplaythrough', HTMLVideoElement>>
                /**
                 * The rendering of an `OfflineAudioContext` is terminated.
                 * @See `OfflineAudioContext` {@link https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext}
                 */
                onComplete?: Events.EventHandler<Events.Event<'complete', HTMLVideoElement>>
                /**
                 * The `duration` attribute has been updated.
                 */
                onDurationChange?: Events.EventHandler<Events.Event<'durationchange', HTMLVideoElement>>
                /**
                 * The media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the `load()` method is called to reload it.
                 * @See `load()` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/load}
                 */
                onEmptied?: Events.EventHandler<Events.Event<'emptied', HTMLVideoElement>>
                /**
                 * Playback has stopped because the end of the media was reached.
                 */
                onEnded?: Events.EventHandler<Events.Event<'ended', HTMLVideoElement>>
                /**
                 * An error occurred while fetching the media data, or the type of the resource is not a supported media format.
                 */
                onError?: Events.EventHandler<Events.Event<'error', HTMLVideoElement>>
                /**
                 * The first frame of the media has finished loading.
                 */
                onLoadedData?: Events.EventHandler<Events.Event<'loadeddata', HTMLVideoElement>>
                /**
                 * The metadata has been loaded.
                 */
                onLoadedMetadata?: Events.EventHandler<Events.Event<'loadedmetadata', HTMLVideoElement>>
                /**
                 * Fired when the browser has started to load the resource.
                 */
                onLoadStart?: Events.EventHandler<Events.Event<'loadstart', HTMLVideoElement>>
                /**
                 * Playback has been paused.
                 */
                onPause?: Events.EventHandler<Events.Event<'pause', HTMLVideoElement>>
                /**
                 * Playback has begun.
                 */
                onPlay?: Events.EventHandler<Events.Event<'play', HTMLVideoElement>>
                /**
                 * Playback is ready to start after having been paused or delayed due to lack of data.
                 */
                onPlaying?: Events.EventHandler<Events.Event<'playing', HTMLVideoElement>>
                /**
                 * Fired periodically as the browser loads a resource.
                 */
                onProgress?: Events.EventHandler<Events.Event<'progress', HTMLVideoElement>>
                /**
                 * The playback rate has changed.
                 */
                onRateChange?: Events.EventHandler<Events.Event<'ratechange', HTMLVideoElement>>
                /**
                 * A seek operation completed.
                 */
                onSeeked?: Events.EventHandler<Events.Event<'seeked', HTMLVideoElement>>
                /**
                 * A seek operation began.
                 */
                onSeeking?: Events.EventHandler<Events.Event<'seeking', HTMLVideoElement>>
                /**
                 * The user agent is trying to fetch media data, but data is unexpectedly not forthcoming.
                 */
                onStalled?: Events.EventHandler<Events.Event<'stalled', HTMLVideoElement>>
                /**
                 * Media data loading has been suspended.
                 */
                onSuspend?: Events.EventHandler<Events.Event<'suspend', HTMLVideoElement>>
                /**
                 * The time indicated by the `currentTime` attribute has been updated.
                 */
                onTimeUpdate?: Events.EventHandler<Events.Event<'timeupdate', HTMLVideoElement>>
                /**
                 * The volume has changed.
                 */
                onVolumeChange?: Events.EventHandler<Events.Event<'volumechange', HTMLVideoElement>>
                /**
                 * Playback has stopped because of a temporary lack of data.
                 */
                onWaiting?: Events.EventHandler<Events.Event<'waiting', HTMLVideoElement>>
            }
        }
        /**
         * In addition to regular multimedia content, HTML can include a variety of other content, even if it's not always easy to interact with.
         * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element#embedded_content}
         */
        export namespace EmbeddedContent {
            /**
             * Embeds external content at the specified point in the document. This content is provided by an external application or other source of interactive content such as a browser plug-in.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed}
             */
            export interface Embed extends Element<HTMLEmbedElement> {
                /**
                 * The displayed height of the resource, in `CSS pixels`. This must be an absolute value; percentages are not allowed.
                 * @See `CSS pixels` {@link https://drafts.csswg.org/css-values/#px}
                 */
                height?: number|string
                /**
                 * The URL of the resource being embedded.
                 */
                src?: string
                /**
                 * The `MIME type` to use to select the plug-in to instantiate.
                 * @See `MIME type` {@link https://developer.mozilla.org/en-US/docs/Glossary/MIME_type}
                 */
                type?: string
                /**
                 * The displayed width of the resource, in `CSS pixels`. This must be an absolute value; percentages are not allowed.
                 * @See `CSS pixels` {@link https://drafts.csswg.org/css-values/#px}
                 */
                width?: number|string
            }
            /**
             * Represents a nested browsing context, embedding another HTML page into the current one.
             * @See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe}
             */
            export interface IFrame extends Element<HTMLIFrameElement> {
                /**
                 * Specifies a `Permissions Policy` for the `<iframe>`. The policy defines what features are available to the `<iframe>` (for example, access to the microphone, camera, battery, web-share, etc.) based on the origin of the request.
                 * 
                 * `Note`:
                 * - A Permissions Policy specified by the `allow` attribute implements a further restriction on top of the policy specified in the `Permissions-Policy` header. It doesn't replace it.
                 * 
                 * @See `Permissions Policy` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy}
                 */
                allow?: string
                /**
                 * Set to `true` if the `<iframe>` can activate fullscreen mode by calling the `requestFullscreen()` method.
                 * 
                 * `Note`:
                 * - This attribute is considered a legacy attribute and redefined as `allow="fullscreen"`.
                 * 
                 * @See `requestFullscreen()` {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen}
                 */
                allowfullscreen?: Helpers.Booleanish
                /**
                 * `Experimental`
                 * 
                 * Set to `true` if a cross-origin `<iframe>` should be allowed to invoke the `Payment Request API`.
                 * 
                 * @See `Payment Request API` {@link https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API}
                 */
                allowpaymentrequest?: Helpers.Booleanish
                /**
                 * `Experimental` Check cross-browser support before using.
                 * 
                 * Set to `true` to make the `<iframe>` credentialless, meaning that its content will be loaded in a new, ephemeral context. It doesn't have access to the network, cookies, and storage data associated with its origin. It uses a new context local to the top-level document lifetime. In return, the `Cross-Origin-Embedder-Policy` (COEP) embedding rules can be lifted, so documents with COEP set can embed third-party documents that do not. @See {@link https://developer.mozilla.org/en-US/docs/Web/Security/IFrame_credentialless} for more details.
                 * 
                 * @See `Cross-Origin-Embedder-Policy` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy}
                 */
                credentialless?: Helpers.Booleanish
                /**
                 * A `Content Security Policy` enforced for the embedded resource. @See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/csp} for details.
                 * @See `Content Security Policy` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP}
                 */
                csp?: string
                /**
                 * The height of the frame in CSS pixels. Default is `150`.
                 */
                height?: string|number
                /**
                 * Indicates how the browser should load the iframe:
                 * 
                 * - `eager`: Load the iframe immediately, regardless if it is outside the visible viewport (this is the default value).
                 * - `lazy`: Defer loading of the iframe until it reaches a calculated distance from the viewport, as defined by the browser.
                 */
                loading?: 'eager'|'lazy'
                /**
                 * A targetable name for the embedded browsing context. This can be used in the `target` attribute of the `<a>`, `<form>`, or `<base>` elements; the `formtarget` attribute of the `<input>` or `<button>` elements; or the `windowName` parameter in the `window.open()` method.
                 * @See `<a>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a}
                 * @See `<form>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form}
                 * @See `<base>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base}
                 * @See `<input>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input}
                 * @See `<button>` {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button}
                 * @See `window.open()` {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/open}
                 */
                name?: string
                /**
                 * Indicates which `referrer` to send when fetching the frame's resource:
                 * - `no-referrer`: The `Referer` header will not be sent.
                 *      - @See `Referer` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer}
                 * - `no-referrer-when-downgrade`: The `Referer` header will not be sent to `origins` without `TLS` (`HTTPS`).
                 *      - @See `Referer` {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer}
                 *      - @See `origins` {@link https://developer.mozilla.org/en-US/docs/Glossary/Origin}
                 *      - @See `TLS` {@link https://developer.mozilla.org/en-US/docs/Glossary/TLS}
                 *      - @See `HTTPS` {@link https://developer.mozilla.org/en-US/docs/Glossary/HTTPS}
                 * - `origin`: The sent referrer will be limited to the origin of the referring page: its `scheme`, `host`, and `port`.
                 *      - @See `scheme` //TODO: left off here {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element#embedded_content} {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe}
                 *      - @See `host`
                 *      - @See `port`
                 */
                referrerpolicy?: 'no-referrer'|'no-referrer-when-downgrade'|'origin'|'origin-when-cross-origin'|''
            }
            /**
             * Represents an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin.
             */
            export interface Object extends Element<HTMLObjectElement> {}
            /**
             * Contains zero or more <source> elements and one <img> element to offer alternative versions of an image for different display/device scenarios.
             */
            export interface Picture extends Element<HTMLPictureElement> {}
            /**
             * Enables the embedding of another HTML page into the current one to enable smoother navigation into new pages.
             */
            export interface Portal extends Element<HTMLElement> {}
            /**
             * Specifies multiple media resources for the picture, the audio element, or the video element. It is a void element, meaning that it has no content and does not have a closing tag. It is commonly used to offer the same media content in multiple file formats in order to provide compatibility with a broad range of browsers given their differing support for image file formats and media file formats.
             */
            export interface Source extends Element<HTMLSourceElement> {}
        }
        /**
         * You can embed SVG and MathML content directly into HTML documents, using the <svg> and <math> elements.
         */
        export namespace SVGAndMathML {
            export interface Element<T extends HTMLElement|SVGElement|MathMLElement|SVGElement|MathMLElement> extends Elements.Element<T> {}
            /**
             * Container defining a new coordinate system and viewport. It is used as the outermost element of SVG documents, but it can also be used to embed an SVG fragment inside an SVG or HTML document.
             */
            export interface SVG extends Element<SVGElement> {}
            /**
             * The top-level element in MathML. Every valid MathML instance must be wrapped in it. In addition, you must not nest a second <math> element in another, but you can have an arbitrary number of other child elements in it.
             */
            export interface Math extends Element<MathMLElement> {}
        }
        /**
         * To create dynamic content and Web applications, HTML supports the use of scripting languages, most prominently JavaScript. Certain elements support this capability.
         */
        export namespace Scripting {
            export interface Element<T extends HTMLElement|SVGElement|MathMLElement> extends Elements.Element<T> {}
            /**
             * Container element to use with either the canvas scripting API or the WebGL API to draw graphics and animations.
             */
            export interface Canvas extends Element<HTMLCanvasElement> {}
            /**
             * Defines a section of HTML to be inserted if a script type on the page is unsupported or if scripting is currently turned off in the browser.
             */
            export interface Noscript extends Element<HTMLElement> {}
            /**
             * Used to embed executable code or data; this is typically used to embed or refer to JavaScript code. The <script> element can also be used with other languages, such as WebGL's GLSL shader programming language and JSON.
             */
            export interface Script extends Element<HTMLScriptElement> {}
        }
        /**
         * These elements let you provide indications that specific parts of the text have been altered.
         */
        export namespace DemarcatingEdits {
            export interface Element<T extends HTMLElement|SVGElement|MathMLElement> extends Elements.Element<T> {}
            /**
             * Represents a range of text that has been deleted from a document. This can be used when rendering "track changes" or source code diff information, for example. The <ins> element can be used for the opposite purpose: to indicate text that has been added to the document.
             */
            export interface Del extends Element<HTMLElement> {}
            /**
             * Represents a range of text that has been added to a document. You can use the <del> element to similarly represent a range of text that has been deleted from the document.
             */
            export interface Ins extends Element<HTMLElement> {}
        }
        /**
         * The elements here are used to create and handle tabular data.
         */
        export namespace TableContent {
            export interface Element<T extends HTMLElement|SVGElement|MathMLElement> extends Elements.Element<T> {}
            /**
             * Specifies the caption (or title) of a table.
             */
            export interface Caption extends Element<HTMLTableCaptionElement> {}
            /**
             * Defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.
             */
            export interface Col extends Element<HTMLTableColElement> {}
            /**
             * Defines a group of columns within a table.
             */
            export interface Colgroup extends Element<HTMLElement> {}
            /**
             * Represents tabular data — that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data.
             */
            export interface Table extends Element<HTMLTableElement> {}
            /**
             * Encapsulates a set of table rows (<tr> elements), indicating that they comprise the body of the table (<table>).
             */
            export interface TBody extends Element<HTMLElement> {}
            /**
             * Defines a cell of a table that contains data. It participates in the table model.
             */
            export interface TD extends Element<HTMLElement> {}
            /**
             * Defines a set of rows summarizing the columns of the table.
             */
            export interface TFoot extends Element<HTMLElement> {}
            /**
             * Defines a cell as a header of a group of table cells. The exact nature of this group is defined by the scope and headers attributes.
             */
            export interface TH extends Element<HTMLElement> {}
            /**
             * Defines a set of rows defining the head of the columns of the table.
             */
            export interface THead extends Element<HTMLElement> {}
            /**
             * Defines a row of cells in a table. The row's cells can then be established using a mix of <td> (data cell) and <th> (header cell) elements.
             */
            export interface TR extends Element<HTMLTableRowElement> {}
        }
        /**
         * HTML provides several elements that can be used together to create forms that the user can fill out and submit to the website or application. Further information about this available in the HTML forms guide.
         */
        export namespace Forms {
            export interface Element<T extends HTMLElement|SVGElement|MathMLElement> extends Elements.Element<T> {}
            /**
             * An interactive element activated by a user with a mouse, keyboard, finger, voice command, or other assistive technology. Once activated, it performs an action, such as submitting a form or opening a dialog.
             */
            export interface Button extends Element<HTMLButtonElement> {}
            /**
             * Contains a set of <option> elements that represent the permissible or recommended options available to choose from within other controls.
             */
            export interface Datalist extends Element<HTMLDataListElement> {}
            /**
             * Used to group several controls as well as labels (<label>) within a web form.
             */
            export interface Fieldset extends Element<HTMLFieldSetElement> {}
            /**
             * Represents a document section containing interactive controls for submitting information.
             */
            export interface Form extends Element<HTMLFormElement> {}
            /**
             * Used to create interactive controls for web-based forms to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent. The <input> element is one of the most powerful and complex in all of HTML due to the sheer number of combinations of input types and attributes.
             */
            export interface Input extends Element<HTMLInputElement> {}
            /**
             * Represents a caption for an item in a user interface.
             */
            export interface Label extends Element<HTMLLabelElement> {}
            /**
             * Represents a caption for the content of its parent <fieldset>.
             */
            export interface Legend extends Element<HTMLLegendElement> {}
            /**
             * Represents either a scalar value within a known range or a fractional value.
             */
            export interface Meter extends Element<HTMLMeterElement> {}
            /**
             * Creates a grouping of options within a <select> element.
             */
            export interface Optgroup extends Element<HTMLOptGroupElement> {}
            /**
             * Used to define an item contained in a select, an <optgroup>, or a <datalist> element. As such, <option> can represent menu items in popups and other lists of items in an HTML document.
             */
            export interface Option extends Element<HTMLOptionElement> {}
            /**
             * Container element into which a site or app can inject the results of a calculation or the outcome of a user action.
             */
            export interface Output extends Element<HTMLOutputElement> {}
            /**
             * Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.
             */
            export interface Progress extends Element<HTMLProgressElement> {}
            /**
             * Represents a control that provides a menu of options.
             */
            export interface Select extends Element<HTMLSelectElement> {}
            /**
             * Represents a multi-line plain-text editing control, useful when you want to allow users to enter a sizeable amount of free-form text, for example, a comment on a review or feedback form.
             */
            export interface Textarea extends Element<HTMLTextAreaElement> {}
        }
        /**
         * HTML offers a selection of elements that help to create interactive user export interface objects.
         */
        export namespace Interactive {
            export interface Element<T extends HTMLElement|SVGElement|MathMLElement> extends Elements.Element<T> {}
            /**
             * Creates a disclosure widget in which information is visible only when the widget is toggled into an "open" state. A summary or label must be provided using the <summary> element.
             */
            export interface Details extends Element<HTMLDetailsElement> {}
            /**
             * Represents a dialog box or other interactive component, such as a dismissible alert, inspector, or subwindow.
             */
            export interface Dialog extends Element<HTMLDialogElement> {}
            /**
             * Specifies a summary, caption, or legend for a details element's disclosure box. Clicking the <summary> element toggles the state of the parent <details> element open and closed.
             */
            export interface Summary extends Element<HTMLElement> {}
        }
    }

    /**
     * This export namespace contains all html events
     */
    export namespace Events {
        /**
         * Generates an event handler of event `E`
         */
        export type EventHandler<E extends Event<string, HTMLElement|SVGElement|MathMLElement>> = (event: E) => any
        /**
         * The event object in each event handlers arguments
         */
        export interface Event<Type extends string, T extends HTMLElement|SVGElement|MathMLElement> {
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
            preventDefault(): void
            stopPropagation(): void
        }
        export interface AbortEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'abort', T> {}
        export interface AutoCompleteEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'autocomplete', T> {}
        export interface AutoCompleteErrorEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'autocompleteerror', T> {}
        export interface BlurEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'blur', T> {}
        export interface CancelEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'cancel', T> {}
        export interface CanPlayEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'canplay', T> {}
        export interface CanPlayThroughEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'canplaythrough', T> {}
        export interface ChangeEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'change', T> {}
        export interface ClickEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'click', T> {}
        export interface CloseEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'close', T> {}
        export interface ContextMenuEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'contextmenu', T> {}
        export interface CueChangeEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'cuechange', T> {}
        export interface DBLCLickEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'dblclick', T> {}
        export interface DragEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'drag', T> {}
        export interface DragEndEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'dragend', T> {}
        export interface DragEnterEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'dragenter', T> {}
        export interface DragLeaveEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'dragleave', T> {}
        export interface DragOverEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'dragover', T> {}
        export interface DragStartEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'dragstart', T> {}
        export interface DropEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'drop', T> {}
        export interface DurationChangeEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'durationchange', T> {}
        export interface EmptiedEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'emptied', T> {}
        export interface EndedEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'ended', T> {}
        export interface ErrorEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'error', T> {}
        export interface FocusEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'focus', T> {}
        export interface InputEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'input', T> {}
        export interface InvalidEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'invalid', T> {}
        export interface KeyDownEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'keydown', T> {}
        export interface KeyPressEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'keypress', T> {}
        export interface KeyUpEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'keyup', T> {}
        export interface LoadEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'load', T> {}
        export interface LoadedDataEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'loadeddata', T> {}
        export interface LoadedMetadataEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'loadedmetadata', T> {}
        export interface LoadStartEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'loadstart', T> {}
        export interface MouseDownEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mousedown', T> {}
        export interface MouseEnterEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mouseenter', T> {}
        export interface MouseLeaveEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mouseleave', T> {}
        export interface MouseMoveEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mousemove', T> {}
        export interface MouseOutEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mouseout', T> {}
        export interface MouseOverEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mouseover', T> {}
        export interface MouseUpEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mouseup', T> {}
        export interface MouseDownEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mousedown', T> {}
        export interface MouseEnterEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mouseenter', T> {}
        export interface MouseLeaveEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mouseleave', T> {}
        export interface MouseMoveEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mousemove', T> {}
        export interface MouseOutEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mouseout', T> {}
        export interface MouseOverEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mouseover', T> {}
        export interface MouseUpEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mouseup', T> {}
        export interface MouseWheelEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'mousewheel', T> {}
        export interface PauseEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'pause', T> {}
        export interface PlayEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'play', T> {}
        export interface PlayingEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'playing', T> {}
        export interface ProgressEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'progress', T> {}
        export interface RateChangeEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'ratechange', T> {}
        export interface ResetEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'reset', T> {}
        export interface ResizeEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'resize', T> {}
        export interface ScrollEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'scroll', T> {}
        export interface SeekedEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'seeked', T> {}
        export interface SeekingEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'seeking', T> {}
        export interface SelectEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'select', T> {}
        export interface ShowEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'show', T> {}
        export interface SortEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'sort', T> {}
        export interface StalledEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'stalled', T> {}
        export interface SubmitEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'submit', T> {}
        export interface SuspendEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'suspend', T> {}
        export interface TimeUpdateEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'timeupdate', T> {}
        export interface ToggleEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'toggle', T> {}
        export interface VolumeChangeEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'volumechange', T> {}
        export interface WaitingEvent<T extends HTMLElement|SVGElement|MathMLElement> extends Event<'waiting', T> {}
    }
}