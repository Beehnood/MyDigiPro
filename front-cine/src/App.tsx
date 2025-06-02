import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css"; // Import Tailwind CSS styles
import { Hero } from "./components/Hero";
import { BlogSection } from "./components/BlogSection";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import Login from "./pages/Login";
import { Register } from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Collection from "./components/Collection";
import Dashboard from "./pages/Dashboard";
// import 'swiper/css';

export function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/blog" element={<BlogSection />} /> */}
          <Route
            path="/collection"
            element={
              <PrivateRoute>
                <Collection />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={<div className="text-center mt-20">Page not found</div>}
          />
        </Routes>
      </main>
    </div>
  );
}
