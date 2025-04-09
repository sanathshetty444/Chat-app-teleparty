export class EventEmitter {
    static events: Record<string, Set<Function>> = {};

    static emit(eventName: string, data: any) {
        if (!this.events[eventName]) return;

        this.events[eventName]?.forEach((callback) => callback(data));
    }

    static listen(eventName: string, callback: Function) {
        if (!this.events[eventName]) this.events[eventName] = new Set();
        this.events[eventName].add(callback);
    }

    static removeListener(eventName: string, callback: Function) {
        this.events[eventName].delete(callback);
    }
}
