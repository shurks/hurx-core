import Emitter from './emitter'

/**
 * Represents a listener attached to an event.
 * @template Event - The type of the event argument.
 */
export default class Listener<Event extends any> {
    /**
     * Creates a new listener instance.
     * @param {Emitter<Event>} event - The event this listener is attached to.
     * @param {function(arg: Event): void} fire - The callback function to execute when the listener is triggered.
     */
    constructor(private event: Emitter<Event>, public fire: (arg: Event) => void|Promise<void>) {}

    /**
     * Unsubscribe the listener from the event.
     */
    public unsubscribe() {
        this.event.unsubscribe(this)
    }
}