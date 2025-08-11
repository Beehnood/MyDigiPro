import { Routes, Route } from "react-router-dom";
import "./index.css";
import { BlogSection } from "./components/BlogSection";

import { Home } from "./pages/Home";
import Login_page from "./components/Login";
import {Register_page} from "./pages/Register_page";
import PrivateRoute from "./components/PrivateRoute";
import { Collection } from "./pages/Collection";
import {UserProfile} from "./pages/UserProfile";

import { AuthProvider } from "./contexts/AuthContext";
import { Film_page } from "./pages/Films_page";
import {FilmProduit_page} from "./pages/FilmProduit_page";
import Randomizer from "./components/Randomaizer";
import Logout from "./components/Logout";
import ContactPage from './components/ContactPage';

import  BlogList  from './components/BlogList';
import { CreateBlog_page } from "./pages/CreateBlog_page";

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
          <Route path="/Register_page" element={<Register_page />} />
          <Route path="/Login_page" element={<Login_page />} />
          <Route path="/logout" element={<Logout />} />

          <Route path="/blog" element={<BlogSection />} />
          <Route path="/blogList" element={<BlogList />} />
          <Route path="/createBlog_page" element={<CreateBlog_page />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Routes publiques */}
          

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
          <Route
            path="/Film_page"
            element={
              <PrivateRoute>
                <Film_page />
              </PrivateRoute>
            }
          />
          <Route
            path="/film/:id"
            element={
              <PrivateRoute>
                <FilmProduit_page />
              </PrivateRoute>
            }
          />
          <Route
            path="/Randomizer"
            element={
              <PrivateRoute>
                <Randomizer />
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
