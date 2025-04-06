import { EventEmitter } from "@/lib/EventEmitter";
import { Socket } from "@/lib/Socket";
import { EVENT_NAMES } from "@/lib/Socket/constants";
import { useEffect, useState } from "react";
import { TelepartyClient } from "teleparty-websocket-lib";

export const useApp = () => {
    const [client, setClient] = useState<TelepartyClient | null>(null);
    const [currentUserId, setUserId] = useState("");

    useEffect(() => {
        if (!client) {
            setClient(Socket.initalise());
            EventEmitter.listen(EVENT_NAMES.MESSAGE, (message: any) => {
                if (message.type === "userId") {
                    setUserId(message.data.userId);
                }
            });
        }
    }, []);

    return { client, currentUserId, setUserId };
};
