import { TelepartyClient } from "teleparty-websocket-lib";
import { EventEmitter } from "../EventEmitter";
import { EVENT_NAMES } from "./constants";

export class Socket {
    static socket: TelepartyClient;
    static initalise() {
        if (this.socket) return this.socket;
        this.socket = new TelepartyClient({
            onConnectionReady: () => {
                console.log("Connection has been established");
            },
            onClose: () => {
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
