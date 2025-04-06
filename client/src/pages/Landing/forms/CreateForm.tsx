import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";

export default function CreateForm({
    handleSubmitCreateRoom,
    onChangeText,
    nickName,
}: {
    handleSubmitCreateRoom: any;
    onChangeText: any;
    nickName: string;
}) {
    return (
        <form onSubmit={handleSubmitCreateRoom}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Create Room</CardTitle>
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
