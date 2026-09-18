import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home
    from "./pages/Home";

import Meeting
    from "./pages/Meeting";
import "./App.css";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />


                <Route
                    path="/meeting/:roomName"
                    element={<Meeting />}
                />

            </Routes>

        </BrowserRouter>

    );
}


export default App;