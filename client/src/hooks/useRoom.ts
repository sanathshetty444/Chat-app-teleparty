import MainContext from "@/context/mainContext";
import { EventEmitter } from "@/lib/EventEmitter";
import { EVENT_NAMES } from "@/lib/Socket/constants";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SocketMessageTypes, TelepartyClient } from "teleparty-websocket-lib";

export const useRoom = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { client, currentUserId, disconnect } = useContext(MainContext)!;
    const { roomId, nickName } = JSON.parse(atob(searchParams.get("q")!));

    const [text, setText] = useState("");
    const [typing, setTyping] = useState(false);
    const [chats, setChats] = useState<{ userName?: string; text: string }[]>(
        []
    );
    const ref = useRef<boolean>(false);

    useEffect(() => {
        function func(client: TelepartyClient) {
            client?.joinChatRoom(nickName, roomId);
        }
        EventEmitter.listen(EVENT_NAMES.ON_CONNECT, func);

        return () => {
            EventEmitter.removeListener(EVENT_NAMES.ON_CONNECT, func);
        };
    }, []);

    const onMessageHandler = useCallback(
        (message: any) => {
            {
                if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
                    if (!message.data.anyoneTyping) setTyping(false);
                    else {
                        const usersTyping = message.data.usersTyping;
                        console.log("currentUserId", currentUserId);

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
            }
        },
        [currentUserId]
    );

    useEffect(() => {
        // ref.current = true;
        EventEmitter.listen(EVENT_NAMES.MESSAGE, onMessageHandler);

        return () => {
            EventEmitter.removeListener(EVENT_NAMES.MESSAGE, onMessageHandler);
        };
    }, [currentUserId]);

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

    const onExitRoom = () => {
        disconnect();
        navigate("/");
    };

    return {
        roomId,
        text,
        typing,
        chats,
        onChangeText,
        onBlur,
        onSubmit,
        onExitRoom,
    };
};
