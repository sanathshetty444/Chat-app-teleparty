import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React from "react";

type Props = {
    userName?: string;
    text: string;
};
function Chat({ text, userName }: Props) {
    return (
        <div className="flex justify-start gap-5 my-5 items-baseline">
            {userName && (
                <Avatar>
                    <AvatarFallback>
                        {userName.split(" ")?.[0]?.charAt(0)?.toUpperCase() +
                            "" +
                            (userName
                                ?.split(" ")
                                ?.at(1)
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                userName
                                    ?.split(" ")
                                    ?.at(0)
                                    ?.charAt(1)
                                    ?.toUpperCase())}
                    </AvatarFallback>
                </Avatar>
            )}
            <div className="text-sm">{text}</div>
        </div>
    );
}

export default Chat;
