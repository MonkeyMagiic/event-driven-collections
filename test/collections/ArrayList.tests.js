///<reference path="../../typings/qunit/qunit.d.ts" />
///<reference path="../../src/events/EventDispatcher.ts" />
///<reference path="../../src/collections/ArrayList.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var collections;
(function (collections) {
    var EventDispatcher = events.EventDispatcher;
    var ArrayList = collections.ArrayList;
    QUnit.test("ArrayList has correct length.", function (assert) {
        // Setup
        var collection = new ArrayList();
        // Test One, Length should be 0 when initialized with no items.
        assert.equal(collection.length, 0, 'Initial collection should not have a length when no items have been added.');
        // Test two, add two items and ensure length is reflected.
        collection.addItem(new Price(1));
        collection.addItem(new Price(2));
        assert.equal(collection.length, 2, 'collection should have a length of two price objects.');
        // Test three, add an additional one making a total of three.
        collection.addItem(new Price(3));
        assert.equal(collection.length, 3, 'collection should have a length of three after adding a further price object.');
        // Test four, remove an item from the collection.
        collection.removeItemAt(0); // Price(1).
        assert.equal(collection.length, 2, 'collection should have a length of two after the very first price.');
        // Test five, remove everything from the collection.
        collection.removeAll();
        assert.equal(collection.length, 0, 'Collection should have zero items after calling removeAll().');
    });
    QUnit.test("ArrayList has items at correct position.", function (assert) {
        // Setup
        var collection = new ArrayList();
        // Test One, add two items and ensure they at correct position.
        collection.addItem(new Price(100));
        collection.addItem(new Price(200));
        assert.equal(collection.getItemAt(0).value, 100, 'added item at position should have a value of 100.');
        assert.equal(collection.getItemAt(1).value, 200, 'added item at position should have a value of 200.');
        // Test Two, add one item to previous two items in collection and ensure they are at the correct position.
        collection.addItem(new Price(300));
        assert.equal(collection.getItemAt(2).value, 300, 'added item at position should have a value of 300.');
        // Test Three, add one item at index position 1 (second in the collection).
        collection.addItemAt(new Price(400), 1);
        assert.equal(collection.getItemAt(0).value, 100, 'added item at position should have a value of 100.');
        assert.equal(collection.getItemAt(1).value, 400, 'added item at position should have a value of 400.');
        assert.equal(collection.getItemAt(2).value, 200, 'added item at position should have a value of 200.');
        // Test four, remove item at position 2 (Price with value 200).
        collection.removeItem(collection.getItemAt(2));
        assert.equal(collection.getItemAt(0).value, 100, 'added item at position should have a value of 100.');
        assert.equal(collection.getItemAt(1).value, 400, 'added item at position should have a value of 400.');
        assert.equal(collection.getItemAt(2).value, 300, 'added item at position should have a value of 300.');
    });
    QUnit.test("ArrayList adding entire collection.", function (assert) {
        // Setup
        var sourceList = new ArrayList([new Price(100), new Price(200), new Price(300)]);
        var targetList = new ArrayList();
        targetList.addAll(sourceList);
        // Test One, Length should be 3.
        assert.equal(targetList.length, 3, 'collection should have a length of 3 after adding all items from source list.');
        assert.equal(targetList.getItemAt(0).value, 100, 'added item at position should have a value of 100.');
        assert.equal(targetList.getItemAt(1).value, 200, 'added item at position should have a value of 200.');
        assert.equal(targetList.getItemAt(2).value, 300, 'added item at position should have a value of 300.');
    });
    QUnit.test("ArrayList retrieving item index.", function (assert) {
        // Setup
        var priceOne = new Price(100);
        var priceTwo = new Price(200);
        var collection = new ArrayList([priceOne, priceTwo]);
        // Test One, retrieve index of first price.
        assert.equal(collection.getItemIndex(priceOne), 0, 'index of first item added to the collection should be 0.');
        assert.equal(collection.getItemIndex(priceTwo), 1, 'index of second item added to the collection should be 1.');
    });
    var Price = (function (_super) {
        __extends(Price, _super);
        function Price(value) {
            _super.call(this);
            this._value = value;
        }
        Object.defineProperty(Price.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                if (this._value === value)
                    return;
                var oldValue = this._value;
                this._value = value;
                this.dispatchEvent(new CustomEvent("propertyChange", {
                    detail: {
                        property: "value",
                        oldValue: oldValue,
                        newValue: value
                    }
                }));
            },
            enumerable: true,
            configurable: true
        });
        return Price;
    })(EventDispatcher);
})(collections || (collections = {}));
//# sourceMappingURL=ArrayList.tests.js.map