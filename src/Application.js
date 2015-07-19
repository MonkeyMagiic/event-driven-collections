///<reference path="events/EventDispatcher.ts" />
///<reference path="collections/ArrayList.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var com;
(function (com) {
    var uk;
    (function (uk) {
        var example;
        (function (example) {
            var EventDispatcher = events.EventDispatcher;
            var ArrayList = collections.ArrayList;
            var Application = (function () {
                function Application() {
                    var _this = this;
                    /**
                     *
                     * @type {collections.ArrayList<Price>}
                     */
                    this._prices = new ArrayList();
                    // setup some listeners.
                    this._prices.addEventListener("collectionChange", function (event) {
                        console.log("kind: " + event.detail.kind + ' items: ' + event.detail.items[0].value);
                    });
                    // initialise with one hundred prices.
                    var i = 0;
                    while (i < 100) {
                        this._prices.addItem(new Price(Math.random() * 1000));
                        i++;
                    } // End of loop.
                    // Tick some data.
                    setInterval(function () { return _this._prices.getItemAt(Math.round(Math.random() * _this._prices.length)).value = 5; }, 500);
                }
                Object.defineProperty(Application.prototype, "prices", {
                    get: function () {
                        return this._prices;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Application;
            })();
            example.Application = Application;
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
        })(example = uk.example || (uk.example = {}));
    })(uk = com.uk || (com.uk = {}));
})(com || (com = {}));
//# sourceMappingURL=Application.js.map