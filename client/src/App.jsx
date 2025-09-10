import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Studio from "@/pages/Studio";
import ComingSoon from "@/pages/ComingSoon";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
