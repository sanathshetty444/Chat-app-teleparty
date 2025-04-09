import { EventEmitter } from "@/lib/EventEmitter";
import { Socket } from "@/lib/Socket";
import { EVENT_NAMES } from "@/lib/Socket/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { TelepartyClient } from "teleparty-websocket-lib";

export const useApp = () => {
    const [client, setClient] = useState<TelepartyClient | null>(null);
    const [currentUserId, setUserId] = useState("");
    const ref = useRef(false);

    const reinitialize = useCallback(() => {
        setClient(Socket.initalise(true));
        EventEmitter.listen(EVENT_NAMES.MESSAGE, (message: any) => {
            if (message.type === "userId") {
                setUserId(message.data.userId);
            }
        });
    }, []);

    useEffect(() => {
        if (!ref.current) {
            ref.current = true;
            reinitialize();
        }
    }, []);

    const disconnect = () => {
        client?.teardown();
        reinitialize();
    };

    return { client, currentUserId, setUserId, reinitialize, disconnect };
};
