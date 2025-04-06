import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Chat from "@/components/molecules/Chat";
import { useRoom } from "@/hooks/useRoom";

function Room() {
    const { roomId, text, typing, chats, onBlur, onChangeText, onSubmit } =
        useRoom();
    return (
        <>
            <div className="flex w-[100%] h-[100%] items-center justify-center">
                <Card className=" m-auto w-[80%] px-5 max-h-[80%] flex flex-col justify-between">
                    <CardHeader className="px-0">
                        <CardTitle className="text-left">
                            Room Id: {roomId}
                        </CardTitle>
                    </CardHeader>
                    <CardDescription>
                        <ScrollArea className="h-100 rounded-md border">
                            <div className="p-4">
                                <h4 className="mb-4 text-sm font-medium leading-none">
                                    Tags
                                </h4>
                                {chats.map(
                                    (chat: {
                                        userName?: string;
                                        text: string;
                                    }) => (
                                        <Chat
                                            userName={chat.userName}
                                            text={chat.text}
                                        />
                                    )
                                )}
                                {typing && <p>Someone is typing...</p>}
                            </div>
                        </ScrollArea>
                    </CardDescription>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmit();
                        }}
                    >
                        <CardFooter className="flex gap-5 p-0">
                            <Input
                                value={text}
                                onChange={onChangeText}
                                onBlur={onBlur}
                                className="flex-1"
                            />
                            <Button className="mr-auto ml-auto" type="submit">
                                Send
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </>
    );
}

export default Room;
