import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanding } from "@/hooks/useLanding";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function JoinRoomCard() {
    const {
        input,
        onChangeText,
        handleSubmitCreateRoom,
        handleSubmitJoinRoom,
    } = useLanding();
    const { nickName, roomId } = input;
    return (
        <div className="flex w-full h-full items-center justify-center">
            <div className="w-[50vw]">
                <Tabs defaultValue="create">
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="create" className="text-white">
                            Create Room
                        </TabsTrigger>
                        <TabsTrigger value="join" className="text-white">
                            Join Room
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="create" className="mt-4">
                        <form onSubmit={handleSubmitCreateRoom}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-center">
                                        Create Room
                                    </CardTitle>
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
                    </TabsContent>
                    <TabsContent value="join" className="mt-4">
                        <form onSubmit={handleSubmitJoinRoom}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-center">
                                        Join Room
                                    </CardTitle>
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
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
