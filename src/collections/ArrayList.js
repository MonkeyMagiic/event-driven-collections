///<reference path="../events/EventDispatcher.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var collections;
(function (collections) {
    var EventDispatcher = events.EventDispatcher;
    var ArrayList = (function (_super) {
        __extends(ArrayList, _super);
        //--------------------------------------------------------------------------
        //
        // Constructor
        //
        //--------------------------------------------------------------------------
        /**
         *
         * @param source
         */
        function ArrayList(source) {
            var _this = this;
            _super.call(this);
            //--------------------------------------------------------------------------
            //
            // Variables
            //
            //--------------------------------------------------------------------------
            /**
             *  @private
             *  Indicates if events should be dispatched.
             *  calls to enableEvents() and disableEvents() effect the value when == 0
             *  events should be dispatched.
             */
            this._dispatchEvents = 0;
            /**
             * Wrapper on class <code>itemUpdateHandler</code> to allow for preservation of lexical scoping.
             * @param event
             * @private
             */
            this._itemUpdateHandlerContextRelay = function (event) { return _this.itemUpdateHandler(event); };
            this.disableEvents();
            this.source = source ? source : [];
            this.enableEvents();
            // _uid = UIDUtil.createUID();
        }
        Object.defineProperty(ArrayList.prototype, "source", {
            get: function () {
                return this._source;
            },
            set: function (value) {
                var i;
                var len;
                if (this._source && this._source.length) {
                    len = this._source.length;
                    for (i = 0; i < len; i++) {
                        this.stopTrackUpdates(this._source[i]);
                    }
                }
                this._source = value ? value : [];
                len = this._source.length;
                for (i = 0; i < len; i++) {
                    this.startTrackUpdates(this._source[i]);
                }
                if (this._dispatchEvents === 0) {
                    var event_1 = new CustomEvent("collectionChange", { detail: { type: 'reset' } });
                    this.dispatchEvent(event_1);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrayList.prototype, "length", {
            //----------------------------------
            // length
            //----------------------------------
            /**
             *  Get the number of items in the list.  An ArrayList should always
             *  know its length so it shouldn't return -1, though a subclass may
             *  override that behavior.
             *
             *  @return int representing the length of the source.
             */
            get: function () {
                if (this.source)
                    return this.source.length;
                else
                    return 0;
            },
            enumerable: true,
            configurable: true
        });
        //--------------------------------------------------------------------------
        //
        // Methods
        //
        //--------------------------------------------------------------------------
        /**
         *  Get the item at the specified index.
         *
         *  @param  index the index in the list from which to retrieve the item
         *  @param  prefetch int indicating both the direction and amount of items
         *          to fetch during the request should the item not be local.
         *  @return the item at that index, null if there is none
         *  @throws ItemPendingError if the data for that index needs to be
         *                           loaded from a remote location
         *  @throws RangeError if the index &lt; 0 or index &gt;= length
         */
        ArrayList.prototype.getItemAt = function (index) {
            if (index < 0 || index >= this.length) {
                throw new Error("The supplied index is out of bounds");
            }
            return this.source[index];
        };
        /**
         *  Place the item at the specified index.
         *  If an item was already at that index the new item will replace it and it
         *  will be returned.
         *
         *  @param  item the new value for the index
         *  @param  index the index at which to place the item
         *  @return the item that was replaced, null if none
         *  @throws RangeError if index is less than 0 or greater than or equal to length
         */
        ArrayList.prototype.setItemAt = function (item, index) {
            if (index < 0 || index >= length) {
                throw new Error("The supplied index is out of bounds");
            }
            var oldItem = this.source[index];
            this.source[index] = item;
            this.stopTrackUpdates(oldItem);
            this.startTrackUpdates(item);
            if (this._dispatchEvents === 0) {
                var hasCollectionListener = this.hasEventListener("collectionChange");
                var hasPropertyListener = this.hasEventListener("propertyChange");
                var updateInfo;
                if (hasCollectionListener || hasPropertyListener) {
                    updateInfo = new CustomEvent("propertyChange", {
                        detail: {
                            kind: "update",
                            oldValue: oldItem,
                            newValue: item,
                            property: index
                        }
                    });
                }
                if (hasCollectionListener) {
                    var event_2 = new CustomEvent("collectionChange", {
                        detail: {
                            kind: "replace",
                            location: index,
                            items: [updateInfo]
                        }
                    });
                    this.dispatchEvent(event_2);
                }
                if (hasPropertyListener)
                    this.dispatchEvent(updateInfo);
            }
            return oldItem;
        };
        /**
         *  Add the specified item to the end of the list.
         *  Equivalent to addItemAt(item, length);
         *
         *  @param item the item to add
         */
        ArrayList.prototype.addItem = function (item) {
            this.addItemAt(item, length);
        };
        /**
         *  Add the item at the specified index.
         *  Any item that was after this index is moved out by one.
         *
         *  @param item the item to place at the index
         *  @param index the index at which to place the item
         *  @throws RangeError if index is less than 0 or greater than the length
         */
        ArrayList.prototype.addItemAt = function (item, index) {
            if (index < 0 || index > length) {
                throw new Error("The supplied index is out of bounds");
            }
            this.source.splice(index, 0, item);
            this.startTrackUpdates(item);
            this.internalDispatchEvent("add", item, index);
        };
        /**
         *  @copy mx.collections.ListCollectionView#addAll()
         */
        ArrayList.prototype.addAll = function (addList) {
            this.addAllAt(addList, length);
        };
        /**
         *  @copy mx.collections.ListCollectionView#addAllAt()
         */
        ArrayList.prototype.addAllAt = function (addList, index) {
            var length = addList.length;
            for (var i = 0; i < length; i++) {
                this.addItemAt(addList.getItemAt(i), i + index);
            }
        };
        /**
         *  Return the index of the item if it is in the list such that
         *  getItemAt(index) == item.
         *  Note that in this implementation the search is linear and is therefore
         *  O(n).
         *
         *  @param item the item to find
         *  @return the index of the item, -1 if the item is not in the list.
         */
        ArrayList.prototype.getItemIndex = function (item) {
            var n = this.source.length;
            for (var i = 0; i < n; i++) {
                if (this.source[i] === item)
                    return i;
            }
            return -1;
        };
        /**
         *  Removes the specified item from this list, should it exist.
         *
         *  @param  item Object reference to the item that should be removed.
         *  @return Boolean indicating if the item was removed.
         */
        ArrayList.prototype.removeItem = function (item) {
            var index = this.getItemIndex(item);
            var result = index >= 0;
            if (result)
                this.removeItemAt(index);
            return result;
        };
        /**
         *  Remove the item at the specified index and return it.
         *  Any items that were after this index are now one index earlier.
         *
         *  @param index The index from which to remove the item.
         *  @return The item that was removed.
         *  @throws RangeError if index &lt; 0 or index &gt;= length.
         */
        ArrayList.prototype.removeItemAt = function (index) {
            if (index < 0 || index >= this.length) {
                throw new Error("The supplied index is out of bounds");
            }
            var removed = this.source.splice(index, 1)[0];
            this.stopTrackUpdates(removed);
            this.internalDispatchEvent("remove", removed, index);
            return removed;
        };
        /**
         *  Remove all items from the list.
         */
        ArrayList.prototype.removeAll = function () {
            if (this.length > 0) {
                var len = length;
                for (var i = 0; i < len; i++) {
                    this.stopTrackUpdates(this.source[i]);
                }
                this.source.splice(0, length);
                this.internalDispatchEvent("reset");
            }
        };
        /**
         *  Notify the view that an item has been updated.
         *  This is useful if the contents of the view do not implement
         *  <code>IEventDispatcher</code>.
         *  If a property is specified the view may be able to optimize its
         *  notification mechanism.
         *  Otherwise it may choose to simply refresh the whole view.
         *
         *  @param item The item within the view that was updated.
         *
         *  @param property A String, QName, or int
         *  specifying the property that was updated.
         *
         *  @param oldValue The old value of that property.
         *  (If property was null, this can be the old value of the item.)
         *
         *  @param newValue The new value of that property.
         *  (If property was null, there's no need to specify this
         *  as the item is assumed to be the new value.)
         *
         *  @see mx.events.CollectionEvent
         *  @see mx.core.IPropertyChangeNotifier
         *  @see mx.events.PropertyChangeEvent
         */
        ArrayList.prototype.itemUpdated = function (item, property, oldValue, newValue) {
            if (property === void 0) { property = null; }
            if (oldValue === void 0) { oldValue = null; }
            if (newValue === void 0) { newValue = null; }
            var event = new CustomEvent("propertyChange", {
                detail: {
                    kind: "update",
                    source: item,
                    property: property,
                    oldValue: oldValue,
                    newValue: newValue
                }
            });
            this.itemUpdateHandler(event);
        };
        /**
         *  Return an Array that is populated in the same order as the IList
         *  implementation.
         *
         *  @return An Array populated in the same order as the IList
         *  implementation.
         *
         *  @throws ItemPendingError if the data is not yet completely loaded
         *  from a remote location
         */
        ArrayList.prototype.toArray = function () {
            return this.source.concat();
        };
        /**
         *  Enables event dispatch for this list.
         *  @private
         */
        ArrayList.prototype.enableEvents = function () {
            this._dispatchEvents++;
            if (this._dispatchEvents > 0)
                this._dispatchEvents = 0;
        };
        /**
         *  Disables event dispatch for this list.
         *  To re-enable events call enableEvents(), enableEvents() must be called
         *  a matching number of times as disableEvents().
         *  @private
         */
        ArrayList.prototype.disableEvents = function () {
            this._dispatchEvents--;
        };
        /**
         *  Called when any of the contained items in the list dispatch an
         *  ObjectChange event.
         *  Wraps it in a <code>CollectionEventKind.UPDATE</code> object.
         *
         *  @param event The event object for the ObjectChange event.
         *
         *  @langversion 3.0
         *  @playerversion Flash 9
         *  @playerversion AIR 1.1
         *  @productversion Flex 3
         */
        ArrayList.prototype.itemUpdateHandler = function (event) {
            this.internalDispatchEvent("update", event);
            // need to dispatch object event now
            if (this._dispatchEvents === 0 && this.hasEventListener("propertyChange")) {
                var objEvent = new CustomEvent("propertyChange", event.detail);
                this.dispatchEvent(objEvent);
            }
        };
        /**
         *  If the item is an IEventDispatcher, watch it for updates.
         *  This method is called by the <code>addItemAt()</code> method,
         *  and when the source is initially assigned.
         *
         *  @param item The item passed to the <code>addItemAt()</code> method.
         */
        ArrayList.prototype.startTrackUpdates = function (item) {
            if (!item || !(item instanceof EventDispatcher))
                return;
            item.addEventListener("propertyChange", this._itemUpdateHandlerContextRelay);
        };
        /**
         *  If the item is an IEventDispatcher, stop watching it for updates.
         *  This method is called by the <code>removeItemAt()</code> and
         *  <code>removeAll()</code> methods, and before a new
         *  source is assigned.
         *
         *  @param item The item passed to the <code>removeItemAt()</code> method.
         */
        ArrayList.prototype.stopTrackUpdates = function (item) {
            if (!item || !(item instanceof EventDispatcher))
                return;
            item.removeEventListener("propertyChange", this._itemUpdateHandlerContextRelay);
        };
        /**
         * @private
         * @param kind
         * @param item
         * @param location
         */
        ArrayList.prototype.internalDispatchEvent = function (kind, item, location) {
            if (item === void 0) { item = null; }
            if (location === void 0) { location = -1; }
            if (this._dispatchEvents === 0) {
                if (this.hasEventListener("collectionChange")) {
                    var event = new CustomEvent("collectionChange", {
                        detail: {
                            kind: kind,
                            items: [item],
                            location: location
                        }
                    });
                    this.dispatchEvent(event);
                }
                if (this.hasEventListener("propertyChange") && (kind == "add" || kind == "remove")) {
                    var objEvent = new CustomEvent("propertyChange", {
                        detail: {
                            property: location,
                            newValue: item,
                            oldValue: item
                        }
                    });
                    this.dispatchEvent(objEvent);
                }
            }
        };
        return ArrayList;
    })(EventDispatcher);
    collections.ArrayList = ArrayList;
})(collections || (collections = {}));
//# sourceMappingURL=ArrayList.js.map