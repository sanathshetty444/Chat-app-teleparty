export class EventEmitter {
    static events: Record<string, Set<Function>> = {};
    static cacheAllEvents: Record<string, { args: any[] }[]> = {};
    static emit(eventName: string, ...args: any) {
        if (!this.cacheAllEvents[eventName])
            this.cacheAllEvents[eventName] = [];
        this.cacheAllEvents[eventName].push({ args });

        if (!this.events[eventName]) {
            return;
        }

        this.events[eventName]?.forEach((callback) => callback(...args));
    }

    static listen(eventName: string, callback: Function, replay = false) {
        if (!this.events[eventName]) this.events[eventName] = new Set();
        this.events[eventName].add(callback);
        if (replay && this.cacheAllEvents[eventName].length > 0) {
            //replaying
            for (let event of this.cacheAllEvents[eventName]) {
                callback(...event.args);
            }
        }
    }

    static removeListener(eventName: string, callback: Function) {
        this.events?.[eventName]?.delete(callback);
    }
}
