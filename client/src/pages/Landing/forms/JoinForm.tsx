import React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function JoinForm({
    handleSubmitJoinRoom,
    onChangeText,
    nickName,
    roomId,
}: {
    handleSubmitJoinRoom: any;
    onChangeText: any;
    nickName: string;
    roomId: string;
}) {
    return (
        <form onSubmit={handleSubmitJoinRoom}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Join Room</CardTitle>
                </CardHeader>
                <CardDescription className="flex flex-col gap-4 items-center p-4">
                    <Input
                        className="w-3/4"
                        placeholder="Nick name"
                        name="nickName"
                        value={nickName}
                        onChange={onChangeText}
                        required
                    />
                    <Input
                        className="w-3/4"
                        placeholder="Room id"
                        name="roomId"
                        value={roomId}
                        onChange={onChangeText}
                        required
                    />
                </CardDescription>
                <CardFooter>
                    <Button type="submit" className="mx-auto">
                        Submit
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
