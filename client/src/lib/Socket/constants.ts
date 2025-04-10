import { SocketMessageTypes } from "teleparty-websocket-lib";

export const EVENT_NAMES = {
    MESSAGE: "MESSAGE",
    ON_CONNECT: "ON_CONNECT",
    ON_CLOSE: "ON_CLOSE",
};

export const MESSAGE_TYPES = {
    ...SocketMessageTypes,
    USER_LIST: "userList",
    USER_ID: "userId",
};

export const SEND_MESSAGE_TYPES = {
    GET_HISTORY: "getHistory",
    POST_HISTORY: "postHistory",
};
