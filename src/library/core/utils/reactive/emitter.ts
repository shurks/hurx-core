import Listener from "./listener"

/**
 * Represents an event emitter that can be listened to and triggered.
 * @template Event - The type of the event argument.
 */
export default class Emitter<Event extends any> {
    private listeners = {
        once: [] as Listener<Event>[],
        always: [] as Listener<Event>[]
    }

    /**
     * Listen methods for adding event listeners.
     */
    public readonly listen = {
        /**
         * Add an event listener that triggers on every event emission.
         * @param {function(arg: Event): void} callback - The callback function to execute on event emission.
         * @returns {Listener<Event>} The listener instance.
         */
        always: (callback: (arg: Event) => void): Listener<Event> => {
            const listener = new Listener(this, callback)
            this.listeners.always.push(listener)
            return listener
        },
        /**
         * Add an event listener that triggers only once.
         * @param {function(arg: Event): void} callback - The callback function to execute on event emission.
         * @returns {Listener<Event>} The listener instance.
         */
        once: (callback: (arg: Event) => void): Listener<Event> => {
            const listener = new Listener(this, callback)
            this.listeners.once.push(listener)
            return listener
        }
    }

    /**
     * Emit the event, triggering all attached listeners.
     * @param {Event} arg - The argument to pass to the listeners.
     */
    public async emit(arg: Event) {
        const promises: Promise<void>[] = []
        for (const listener of this.listeners.once) {
            const promise = listener.fire(arg)
            if (promise instanceof Promise) {
                promises.push(promise)
            }
            this.unsubscribe(listener)
        }
        for (const listener of this.listeners.always) {
            const promise = listener.fire(arg)
            if (promise instanceof Promise) {
                promises.push(promise)
            }
        }
        await Promise.all(promises)
    }

    /**
     * Unsubscribe a listener from the event.
     * @param {Listener<Event>} listener - The listener to unsubscribe.
     */
    public unsubscribe(listener: Listener<Event>) {
        this.listeners.always = this.listeners.always.filter((l) => l !== listener)
        this.listeners.once = this.listeners.once.filter((l) => l !== listener)
    }
}