import { Route, Routes } from "react-router-dom";
import BoardList from "./pages/BoardList";
import BoardDetail from "./pages/BoardDetail";
import Footer from "./components/Footer";

function App() {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "#070F2B" }}
    >
      {/* Main Content Area */}

      <div className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<BoardList />} />
          <Route path="/boards/:id" element={<BoardDetail />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
