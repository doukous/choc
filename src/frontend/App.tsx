import { HashRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Timer from "./pages/Timer";
import TitleBar from "./components/TitleBar";

function App() {
  return (
    <div className="flex flex-col h-full">
      <TitleBar />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timer" element={<Timer />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
