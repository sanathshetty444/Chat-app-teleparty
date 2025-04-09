import { EventEmitter } from "@/lib/EventEmitter";
import { Socket } from "@/lib/Socket";
import { EVENT_NAMES } from "@/lib/Socket/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { TelepartyClient } from "teleparty-websocket-lib";

export const useApp = () => {
    const [client, setClient] = useState<TelepartyClient | null>(null);
    const [currentUserId, setUserId] = useState("");
    const ref = useRef(false);

    const onMessageHandler = useCallback((message: any) => {
        if (message.type === "userId") {
            setUserId(message.data.userId);
        }
    }, []);

    const onCloseHandler = useCallback(() => {
        reinitialize();
    }, []);

    const reinitialize = useCallback(() => {
        setClient(Socket.initalise(true));
        EventEmitter.listen(EVENT_NAMES.MESSAGE, onMessageHandler);
        EventEmitter.listen(EVENT_NAMES.ON_CLOSE, onCloseHandler);

        return () => {
            EventEmitter.removeListener(EVENT_NAMES.MESSAGE, onMessageHandler);
            EventEmitter.removeListener(EVENT_NAMES.ON_CLOSE, onCloseHandler);
        };
    }, []);

    useEffect(() => {
        if (!ref.current) {
            ref.current = true;
            reinitialize();
        }
    }, []);

    const disconnect = () => {
        try {
            client?.teardown();
        } catch (error) {}
    };

    return { client, currentUserId, setUserId, disconnect };
};
