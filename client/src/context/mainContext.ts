import { createContext } from "react";
import { TelepartyClient } from "teleparty-websocket-lib";

const MainContext = createContext<{
    client: TelepartyClient | null;
    currentUserId: string;
    setCurrentUserId: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

export default MainContext;
