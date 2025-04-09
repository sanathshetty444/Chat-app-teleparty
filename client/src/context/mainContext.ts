import { createContext } from "react";
import { TelepartyClient } from "teleparty-websocket-lib";

const MainContext = createContext<{
    client: TelepartyClient | null;
    currentUserId: string;
    disconnect: () => void;
} | null>(null);

export default MainContext;
