import { HashRouter, Route, Routes } from "react-router"
import Home from "./pages/Home"
import Timer from "./pages/Timer"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/timer" element={<Timer />} />
      </Routes>
    </HashRouter>
  )
}

export default App
