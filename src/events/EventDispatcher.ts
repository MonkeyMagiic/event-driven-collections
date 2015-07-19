module events {

    export interface IEventDispatcher
    {
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

        public addEventListener(type:string, listener:(event:Event) => void):void {

            if (this._listeners === undefined) this._listeners = {};

            if (this._listeners[type] === undefined) this._listeners[type] = new Array<Function>();

            if (this._listeners[type].indexOf(listener) !== -1) return;

            this._listeners[type].push(listener);
        }

        public hasEventListener(type:string):boolean {

            if (this._listeners === undefined) return false;

            if (this._listeners[type] === undefined) return false;

            if (this._listeners[type].length < 1) return false

            return true;
        }

        public removeEventListener(type:string, listener:(event:Event) => void):void {

            if (this._listeners === undefined) return;

            if (this._listeners[type] === undefined) return;

            const index:number = this._listeners[type].indexOf(listener);

            if (index === -1) return;

            this._listeners[type].splice(index, 1);
        }

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
