import { Routes, Route } from "react-router-dom";
import "./index.css";
import { BlogSection } from "./components/Blogs/BlogSection";

import { Home } from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import { Collection } from "./pages/Collection";
import { UserProfile } from "./pages/UserProfile";

import { AuthProvider } from "./contexts/AuthContext";
import { Film_page } from "./pages/Films-Pages/Films_page";
import { FilmProduit_page } from "./pages/Films-Pages/FilmProduit_page";
import Randomizer from "./components/Randomaizer";
import Logout from "./components/Logout";
import ContactPage from "./components/ContactPage";

import { BlogsList_page } from "./pages/Blogs-Pages/Blogs";
import { CreateBlog_page } from "./pages/Blogs-Pages/CreateBlog_page";
import { ExitProvider } from "./contexts/ExitContext";
import { Register } from "./components/Register";
import Login from "./components/Login";
import BlogPage from "./components/Blogs/BlogPage";
import { MainLayout } from "./layouts/MainLayout";

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
          {/* <Route path="/Register_page" element={<Register_page />} /> */}
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/logout" element={<Logout />} />

          <Route path="/blogList" element={<BlogsList_page />} />
          <Route path="/createBlog_page" element={<CreateBlog_page />} />
          <Route path="/blog/:id" element={<BlogPage />} />
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
                <ExitProvider>
                  <UserProfile />
                </ExitProvider>
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
