import { HashRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Room from "./pages/Room";
import MainContext from "./context/mainContext";
import { useApp } from "./hooks/useApp";

function App() {
    const { client, currentUserId, disconnect } = useApp();
    return (
        <>
            <MainContext.Provider
                value={{
                    client,
                    currentUserId,
                    disconnect,
                }}
            >
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/room" element={<Room />} />
                    </Routes>
                </HashRouter>
            </MainContext.Provider>
        </>
    );
}

export default App;
