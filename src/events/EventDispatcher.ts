module events {

    export interface IEventDispatcher {
        addEventListener(type:string, listener:(event:Event) => void):void;
        hasEventListener(type:string):boolean;
        removeEventListener(type:string, listener:(event:Event) => void):void;
        dispatchEvent(event:Event):void;
    }

    export class EventDispatcher implements IEventDispatcher {

        /**
         * @private
         */
        private _listeners:{ [type: string] : Array<Function> };

        constructor() {

        }

        /**
         * Registers an event listener object with an EventDispatcher object so that the listener receives notification
         * of an event. You can register event listeners on all nodes in the display list for a specific type of event,
         * phase, and priority.
         *
         * You cannot register an event listener for only the target phase or the bubbling phase. Those phases are
         * coupled during registration because bubbling applies only to the ancestors of the target node.
         *
         * If you no longer need an event listener, remove it by calling removeEventListener(), or memory problems
         * could result. Event listeners are not automatically removed from memory because the garbage collector does
         * not remove the listener as long as the dispatching object exists (unless the useWeakReference parameter is
         * set to true).
         *
         * @param type The type of event.
         * @param listener The listener function that processes the event. This function must accept an Event object as its only parameter and must return nothing.
         */
        public addEventListener(type:string, listener:(event:Event) => void):void {

            if (this._listeners === undefined) this._listeners = {};

            if (this._listeners[type] === undefined) this._listeners[type] = new Array<Function>();

            if (this._listeners[type].indexOf(listener) !== -1) return;

            this._listeners[type].push(listener);
        }

        /**
         * Checks whether the EventDispatcher object has any listeners registered for a specific type of event. This
         * allows you to determine where an EventDispatcher object has altered handling of an event type in the event
         * flow hierarchy.
         *
         * @param type The type of event.
         * @returns {boolean} A value of true if a listener of the specified type is registered; false otherwise.
         */
        public hasEventListener(type:string):boolean {

            if (this._listeners === undefined) return false;

            if (this._listeners[type] === undefined) return false;

            if (this._listeners[type].length < 1) return false

            return true;
        }

        /**
         * Removes a listener from the EventDispatcher object. If there is no matching listener registered with the
         * EventDispatcher object, a call to this method has no effect.
         *
         * @param type The type of event.
         * @param listener The listener object to remove.
         */
        public removeEventListener(type:string, listener:(event:Event) => void):void {

            if (this._listeners === undefined) return;

            if (this._listeners[type] === undefined) return;

            const index:number = this._listeners[type].indexOf(listener);

            if (index === -1) return;

            this._listeners[type].splice(index, 1);
        }

        /**
         * Dispatches an event into the event flow. The event target is the EventDispatcher object upon which the
         * dispatchEvent() method is called.
         *
         * @param event The Event object that is dispatched into the event flow. If the event is being redispatched,
         *              a clone of the event is created automatically. After an event is dispatched, its target property
         *              cannot be changed, so you must create a new copy of the event for redispatching to work.
         */
        public dispatchEvent(event:Event):void {

            if (this._listeners === undefined) return;

            const eventType:string = event.type;
            const collection:Array<Function> = this._listeners[eventType];

            if (collection === undefined) return;

            const length:number = collection.length;

            if (length < 1) return;

            var i:number = 0;
            while (i < length) {
                collection[i].call(this, event);
                i++;
            } // End of loop.
        }
    }
}
