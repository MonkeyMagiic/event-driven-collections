var events;
(function (events) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
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
        EventDispatcher.prototype.addEventListener = function (type, listener) {
            if (this._listeners === undefined)
                this._listeners = {};
            if (this._listeners[type] === undefined)
                this._listeners[type] = new Array();
            if (this._listeners[type].indexOf(listener) !== -1)
                return;
            this._listeners[type].push(listener);
        };
        /**
         * Checks whether the EventDispatcher object has any listeners registered for a specific type of event. This
         * allows you to determine where an EventDispatcher object has altered handling of an event type in the event
         * flow hierarchy.
         *
         * @param type The type of event.
         * @returns {boolean} A value of true if a listener of the specified type is registered; false otherwise.
         */
        EventDispatcher.prototype.hasEventListener = function (type) {
            if (this._listeners === undefined)
                return false;
            if (this._listeners[type] === undefined)
                return false;
            if (this._listeners[type].length < 1)
                return false;
            return true;
        };
        /**
         * Removes a listener from the EventDispatcher object. If there is no matching listener registered with the
         * EventDispatcher object, a call to this method has no effect.
         *
         * @param type The type of event.
         * @param listener The listener object to remove.
         */
        EventDispatcher.prototype.removeEventListener = function (type, listener) {
            if (this._listeners === undefined)
                return;
            if (this._listeners[type] === undefined)
                return;
            var index = this._listeners[type].indexOf(listener);
            if (index === -1)
                return;
            this._listeners[type].splice(index, 1);
        };
        /**
         * Dispatches an event into the event flow. The event target is the EventDispatcher object upon which the
         * dispatchEvent() method is called.
         *
         * @param event The Event object that is dispatched into the event flow. If the event is being redispatched,
         *              a clone of the event is created automatically. After an event is dispatched, its target property
         *              cannot be changed, so you must create a new copy of the event for redispatching to work.
         */
        EventDispatcher.prototype.dispatchEvent = function (event) {
            if (this._listeners === undefined)
                return;
            var eventType = event.type;
            var collection = this._listeners[eventType];
            if (collection === undefined)
                return;
            var length = collection.length;
            if (length < 1)
                return;
            var i = 0;
            while (i < length) {
                collection[i].call(this, event);
                i++;
            } // End of loop.
        };
        return EventDispatcher;
    })();
    events.EventDispatcher = EventDispatcher;
})(events || (events = {}));
//# sourceMappingURL=EventDispatcher.js.map