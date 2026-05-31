import { Navigate, Routes, Route } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "./contexts/AuthContext";
import { ExitProvider } from "./contexts/ExitContext";

import PrivateRoute from "./components/PrivateRoute";
import Logout from "./components/Logout";
import Randomizer from "./components/Randomaizer";
import ContactPage from "./components/ContactModal";

import { Home } from "./pages/Home";
import { Collection } from "./pages/Collection";
import { UserProfile } from "./pages/UserProfile";

import { Film_page } from "./pages/Films-Pages/Films_page";
import { FilmProduit_page } from "./pages/Films-Pages/FilmProduit_page";

import { BlogsList_page } from "./pages/Blogs-Pages/Blogs";
import { CreateBlog_page } from "./pages/Blogs-Pages/CreateBlog_page";

import { Register_page } from "./pages/Register_page";
import { Login_page } from "./pages/Login_page";

import BlogPage from "./components/Blogs/BlogPage";
import EditBlogPage from "./components/Blogs/EditBlogPage";

function App() {
  return (
    <AuthProvider>
      <div className="app-background flex min-h-screen flex-col text-black">
        <Routes>
          {/* Pages publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register_page />} />
          <Route path="/login" element={<Login_page />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Compatibilité anciennes URLs */}
          <Route path="/Register" element={<Navigate to="/register" replace />} />
          <Route path="/Login" element={<Navigate to="/login" replace />} />
          <Route path="/BlogList" element={<Navigate to="/blogs" replace />} />
          <Route path="/blogList" element={<Navigate to="/blogs" replace />} />
          <Route path="/createBlog_page" element={<Navigate to="/create-blog" replace />} />

          {/* Blogs */}
          <Route path="/blogs" element={<BlogsList_page />} />
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route path="/editBlog/:id" element={<EditBlogPage />} />

          <Route
            path="/create-blog"
            element={
              <PrivateRoute>
                <CreateBlog_page />
              </PrivateRoute>
            }
          />

          {/* Films */}
          <Route path="/films" element={<Film_page />} />
          {/* Compatibilité ancienne URL */}
          {/* <Route
            path="/Film_page"
            element={
              <PrivateRoute>
                <Film_page />
              </PrivateRoute>
            }
          /> */}

          <Route
            path="/film/:id"
            element={
              <PrivateRoute>
                <FilmProduit_page />
              </PrivateRoute>
            }
          />

          {/* Collection */}
          <Route path="/collection" element={<Collection />} />

          {/* Profil */}
          <Route
            path="/user-profile"
            element={
              <PrivateRoute>
                <ExitProvider>
                  <UserProfile />
                </ExitProvider>
              </PrivateRoute>
            }
          />

          {/* Compatibilité ancienne URL */}
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

          {/* Randomizer */}
          <Route
            path="/randomizer"
            element={
              <PrivateRoute>
                <Randomizer />
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="mt-20 text-center text-yellow-400">
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
