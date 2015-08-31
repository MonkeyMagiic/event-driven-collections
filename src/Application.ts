///<reference path="events/EventDispatcher.ts" />
///<reference path="collections/ArrayList.ts" />

module com.uk.example {
    import EventDispatcher = events.EventDispatcher;
    import ArrayList = collections.ArrayList;

    export class Application {

        //--------------------------------------------------------------------------
        //
        // Constructor
        //
        //--------------------------------------------------------------------------

        constructor() {

            // setup some listeners.
            this._prices.addEventListener("collectionChange", function (event:CustomEvent):void {
                const kind:String = event.detail.kind;
                const items:Array<any> = event.detail.items;
                switch (kind) {
                    case "add":
                    {
                        console.log("items added to the collection!");
                        for (var i:number = 0; i < items.length; i++) {
                            console.log("item: " + items[i].value);
                        }
                        break;
                    }
                    case "remove":
                    {
                        console.log("items removed from the collection!")
                        break;
                    }
                    case "update":
                    {
                        console.log("items updated from the collection!");
                        for (var i:number = 0; i < items.length; i++) {
                            console.log("update: " + JSON.stringify(items[i].detail));
                        }
                        break;
                    }
                    default:
                    {
                        // Not expected.
                    }
                }
            });

            // initialise with one hundred prices.
            var i:number = 0;
            while (i < 100) {
                this._prices.addItem(new Price(Math.random() * 1000));
                i++;
            } // End of loop.

            // Tick some data.
            setInterval(() => {
                const position:number = Math.round(Math.random() * (this._prices.length - 1));
                this._prices.getItemAt(position).value = Math.random() * 1000;
            }, 500);
        }


        //--------------------------------------------------------------------------
        //
        // Properties
        //
        //--------------------------------------------------------------------------

        //----------------------------------
        // prices
        //----------------------------------

        /**
         * Holder for the <code>prices</code>.
         * @type {collections.ArrayList<Price>}
         */
        private _prices:ArrayList<Price> = new ArrayList<Price>();

        /**
         * Collection of managed prices.
         * @returns {ArrayList<Price>}
         */
        public get prices():ArrayList<Price> {
            return this._prices;
        }
    }

    class Price extends EventDispatcher {
        constructor(value:number) {
            super();
            this._value = value;
        }

        private _value:number;

        public get value():number {
            return this._value;
        }

        public set value(value:number) {
            if (this._value === value)
                return;

            const oldValue:number = this._value;
            this._value = value;
            this.dispatchEvent(new CustomEvent("propertyChange", {
                detail: {
                    property: "value",
                    oldValue: oldValue,
                    newValue: value
                }
            }));
        }
    }
}