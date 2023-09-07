import Component from "./component"

/**
 * The router for the front-end
 */
export default class Router {
    constructor(public routes: Record<string, JSX.Element>) {}
}