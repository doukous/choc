// import { BrowserRouter, Routes, Route } from "react-router"
import { HashRouter, Route, Routes } from "react-router"
import Home from "./pages/Home"
import Timer from "./pages/Timer"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/timer" element={<Home />} />
        <Route path="/" element={<Timer />} />
      </Routes>
    </HashRouter>
  )
}

export default App
