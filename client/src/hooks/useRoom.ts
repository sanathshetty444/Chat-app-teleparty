import MainContext from "@/context/mainContext";
import { EventEmitter } from "@/lib/EventEmitter";
import {
    EVENT_NAMES,
    MESSAGE_TYPES,
    SEND_MESSAGE_TYPES,
} from "@/lib/Socket/constants";
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

    console.log("clientId", currentUserId);
    const ref = useRef(true);
    const [getHistoryAsked, setGetHistoryAsked] = useState(false);

    useEffect(() => {
        function func(client: TelepartyClient) {
            client?.joinChatRoom(nickName, roomId);
        }

        function onMessage(message: any, socket: any) {
            let userId: string = "";
            if (message.type === MESSAGE_TYPES.USER_ID) {
                userId = message.data?.userId;
            } else if (
                message.type === MESSAGE_TYPES.USER_LIST &&
                !getHistoryAsked
            ) {
                setGetHistoryAsked(true);
                const peers = message.data?.filter(
                    (item: any) =>
                        item?.socketConnectionId !== currentUserId || userId
                );
                if (peers?.[0]) {
                    socket?.sendMessage(MESSAGE_TYPES.SEND_MESSAGE, {
                        body: JSON.stringify({
                            body: text,
                            from: peers?.[0]?.socketConnectionId,
                            type: SEND_MESSAGE_TYPES.GET_HISTORY,
                        }),
                    });
                }
            }
        }

        EventEmitter.listen(EVENT_NAMES.ON_CONNECT, func);
        EventEmitter.listen(EVENT_NAMES.MESSAGE, onMessage, true);

        return () => {
            EventEmitter.removeListener(EVENT_NAMES.ON_CONNECT, func);
            EventEmitter.removeListener(EVENT_NAMES.MESSAGE, onMessage);
        };
    }, []);

    const onMessageHandler = useCallback(
        (message: any) => {
            {
                if (message.type === MESSAGE_TYPES.SET_TYPING_PRESENCE) {
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

                if (message.type === MESSAGE_TYPES.SEND_MESSAGE) {
                    if (
                        message.data?.type === SEND_MESSAGE_TYPES.GET_HISTORY &&
                        message.data?.from === currentUserId
                    ) {
                        client?.sendMessage(MESSAGE_TYPES.SEND_MESSAGE, {
                            body: text,
                            type: SEND_MESSAGE_TYPES.POST_HISTORY,
                            chats,
                        });
                    } else if (
                        message.data?.type === SEND_MESSAGE_TYPES.POST_HISTORY
                    ) {
                        setChats(message?.data?.chats);
                    } else if (!message.data?.type) {
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
            }
        },
        [currentUserId, client]
    );

    useEffect(() => {
        // ref.current = true;
        EventEmitter.listen(EVENT_NAMES.MESSAGE, onMessageHandler);

        return () => {
            EventEmitter.removeListener(EVENT_NAMES.MESSAGE, onMessageHandler);
        };
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
