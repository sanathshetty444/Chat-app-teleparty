import { TelepartyClient } from "teleparty-websocket-lib";
import { EventEmitter } from "../EventEmitter";
import { EVENT_NAMES } from "./constants";

export class Socket {
    static socket: TelepartyClient;
    static initalise(force = false) {
        if (this.socket && !force) return this.socket;
        this.socket = new TelepartyClient({
            onConnectionReady: () => {
                console.log("Connection has been established", this.socket);
                EventEmitter.emit(EVENT_NAMES.ON_CONNECT, this.socket);
            },
            onClose: () => {
                EventEmitter.emit(EVENT_NAMES.ON_CLOSE, "");
                console.log("Socket has been closed");
            },
            onMessage: (message) => {
                EventEmitter.emit(EVENT_NAMES.MESSAGE, message);
                console.log("Received message: " + JSON.stringify(message));
            },
        });

        return this.socket;
    }
}
