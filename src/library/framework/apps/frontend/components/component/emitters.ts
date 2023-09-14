import Emitter from "../../../../../core/utils/reactive/emitter"
import Component, { ComponentProps } from "./component"

/**
 * The base handler type for any component emitter
 */
export interface ComponentEmitterBaseHandler<Props extends ComponentProps> {
    /**
     * The component
     */
    component: Component<Props>
}

/**
 * Handler type for component initialization emitter
 */
export interface ComponentInitializationHandler<Props extends ComponentProps> extends ComponentEmitterBaseHandler<Props> {}

/**
 * Handler type for component mounted emitter
 */
export interface ComponentMountedHandler<Props extends ComponentProps> extends ComponentEmitterBaseHandler<Props> {}

/**
 * Handler type for component props received emitter
 */
export interface ComponentPropsReceivedHandler<Props extends ComponentProps> extends ComponentEmitterBaseHandler<Props> {
    /**
     * The component's new props
     */
    props: Props
}

/**
 * Handler type for component before render emitter
 */
export interface ComponentBeforeRenderHandler<Props extends ComponentProps> extends ComponentEmitterBaseHandler<Props> {}

/**
 * Handler type for component after render emitter
 */
export interface ComponentAfterRenderHandler<Props extends ComponentProps> extends ComponentEmitterBaseHandler<Props> {}

/**
 * Handler type for component unmounted emitter
 */
export interface ComponentUnmountedHandler<Props extends ComponentProps> extends ComponentEmitterBaseHandler<Props> {}

/**
 * The base component emitters type
 */
export default interface ComponentEmitters<Props extends ComponentProps> {
    /**
     * Custom emitters
     */
    [key: string]: Emitter<any>

    /**
     * Emitter that fires whenever the component initializes (right after construction)
     */
    initialization: Emitter<ComponentInitializationHandler<Props>>

    /**
     * Emitter that fires whenever the component is mounted in the DOM
     */
    mounted: Emitter<ComponentMountedHandler<Props>>

    /**
     * Emitter that fires whenever the components props change, also upon iniitialization
     */
    propsChanged: Emitter<ComponentPropsReceivedHandler<Props>>

    /**
     * Emitter that fires right before each render cycle
     */
    beforeRender: Emitter<ComponentBeforeRenderHandler<Props>>

    /**
     * Emitter that fires right after each render cycle
     */
    afterRender: Emitter<ComponentAfterRenderHandler<Props>>

    /**
     * Emitter that fires right when the component is unmounted from the DOM
     */
    umounted: Emitter<ComponentUnmountedHandler<Props>>
}