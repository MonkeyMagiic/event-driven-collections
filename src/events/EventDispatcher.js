var events;
(function (events) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
        }
        EventDispatcher.prototype.addEventListener = function (type, listener) {
            if (this._listeners === undefined)
                this._listeners = {};
            if (this._listeners[type] === undefined)
                this._listeners[type] = new Array();
            if (this._listeners[type].indexOf(listener) !== -1)
                return;
            this._listeners[type].push(listener);
        };
        EventDispatcher.prototype.hasEventListener = function (type) {
            if (this._listeners === undefined)
                return false;
            if (this._listeners[type] === undefined)
                return false;
            if (this._listeners[type].length < 1)
                return false;
            return true;
        };
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