import { Routes, Route } from "react-router-dom";
import "./index.css";
import { BlogSection } from "./components/BlogSection";

import { Home } from "./pages/Home";
import Login from "./pages/Login";
import { Register } from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import { Collection } from "./pages/Collection";
import {UserProfile} from "./pages/UserProfile";

import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
              </>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blog" element={<BlogSection />} />

          {/* Routes protégées */}
          <Route
            path="/collection"
            element={
              <PrivateRoute>
                <Collection />
              </PrivateRoute>
            }
          />
          <Route
            path="/UserProfile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="text-center mt-20 text-yellow-400">
                Page not found
              </div>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
