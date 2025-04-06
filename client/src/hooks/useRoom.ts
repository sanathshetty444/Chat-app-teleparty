import MainContext from "@/context/mainContext";
import { EventEmitter } from "@/lib/EventEmitter";
import { EVENT_NAMES } from "@/lib/Socket/constants";
import CreateForm from "@/pages/Landing/forms/CreateForm";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { SocketMessageTypes } from "teleparty-websocket-lib";

export const useRoom = () => {
    const location = useLocation();
    const { client, currentUserId } = useContext(MainContext)!;
    const { roomId } = location?.state;
    const [text, setText] = useState("");
    const [typing, setTyping] = useState(false);
    const [chats, setChats] = useState<{ userName?: string; text: string }[]>(
        []
    );
    const ref = useRef<boolean>(false);

    useEffect(() => {
        if (!ref.current) {
            ref.current = true;
            EventEmitter.listen(EVENT_NAMES.MESSAGE, (message: any) => {
                if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
                    if (!message.data.anyoneTyping) setTyping(false);
                    else {
                        const usersTyping = message.data.usersTyping;
                        const index = usersTyping.findIndex(
                            (user: string) => user === currentUserId
                        );
                        if (index !== -1) usersTyping.splice(index, 1);
                        if (usersTyping.length > 0) {
                            setTyping(message.data.anyoneTyping);
                        }
                    }
                }

                if (message.type === SocketMessageTypes.SEND_MESSAGE) {
                    const userName = message.data.userNickname;
                    const body = message.data.body;
                    const isSystem = message.data.isSystemMessage;
                    if (isSystem) {
                        setChats((prev) => [
                            ...prev,
                            {
                                text: userName + " " + body,
                            },
                        ]);
                    } else {
                        setChats((prev) => [
                            ...prev,
                            {
                                userName,
                                text: body,
                            },
                        ]);
                    }
                }
            });
        }
    }, []);

    const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        if (e.target.value?.length > 0)
            client?.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
                typing: true,
            });
    };

    const onBlur = () => {
        client?.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
            typing: false,
        });
    };

    const onSubmit = () => {
        client?.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
            body: text,
        });
        setText("");
    };
    console.log("chats", chats);

    return { roomId, text, typing, chats, onChangeText, onBlur, onSubmit };
};
