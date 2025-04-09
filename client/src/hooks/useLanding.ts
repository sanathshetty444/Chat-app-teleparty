import MainContext from "@/context/mainContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLanding = () => {
    const { client } = useContext(MainContext)!;

    const [input, setInput] = useState({
        roomId: "",
        nickName: "",
    });

    const navigate = useNavigate();

    const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmitCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form data (send to backend, validate, etc.)
        console.log("Creating Room:", input);
        const { nickName } = input;
        const res = await client?.createChatRoom(nickName);
        // if (res) setCurrentRoom(res);
        navigate(`/room?q=${btoa(JSON.stringify({ nickName, roomId: res }))}`, {
            state: { roomId: res },
        });
    };

    const handleSubmitJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Joining Room:", input);
        const { nickName, roomId } = input;
        try {
            await client?.joinChatRoom(nickName, roomId);
            // if (res) setCurrentRoom(roomId);
            navigate(`/room?q=${btoa(JSON.stringify({ nickName, roomId }))}`, {
                state: { roomId },
            });
        } catch (error) {
            alert("Invalid Room Id");
        }
    };

    return {
        input,
        onChangeText,
        handleSubmitCreateRoom,
        handleSubmitJoinRoom,
    };
};
