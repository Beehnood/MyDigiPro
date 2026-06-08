import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Randomaizer from "./Randomaizer";
import Login from "./Login";
import { Register } from "./Register";

export const Navbar = () => {
  const { token } = useAuth();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const assetBaseUrl = import.meta.env.BASE_URL;
  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/collection", label: "Collection" },
    { to: "/blogs", label: "Blogs" },
    { to: "/films", label: "Films" },
    { to: "/collection", label: "Boutique" },
  ];

  return (
    <nav className="bg-black shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex h-14 w-14 items-center sm:h-16 sm:w-16">
          <Link to="/">
            <img src={`${assetBaseUrl}Logo-rouge.png`} alt="CineSpin" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-md border border-orange-100/30 px-3 py-2 text-orange-100 md:hidden"
          aria-expanded={isMenuOpen}
          aria-label="Ouvrir le menu"
        >
          ☰
        </button>

        <div className="hidden items-center md:flex">
          <ul className="flex gap-5 text-xl lg:gap-8 lg:text-2xl xl:text-3xl">
            {token &&
              navLinks.map((link) => (
                <li
                  key={`${link.to}-${link.label}`}
                  className="flex text-orange-100 hover:text-yellow-400"
                >
                  <Link
                    to={link.to}
                    className="text-orange-100 transition-colors hover:text-yellow-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div className="hidden items-center gap-2 md:flex lg:ml-8">
          {token ? (
            <>
              {/* Randomize */}

              <div className="flex items-center space-x-2">
                <Randomaizer />
              </div>
              {/* Search */}
              <div>
                <svg
                  className="w-8 h-8 text-orange-100 hover:text-yellow-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              {/* Login */}
              <div className="flex items-center space-x-2">
                <Link
                  to="/user-profile"
                  className="text-orange-100 hover:text-yellow-400 transition-colors"
                >
                  <svg
                    className="w-8 h-8 text-orange-100 hover:text-yellow-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </Link>
              </div>
              <div>
                <button
                  onClick={logout}
                  className="text-black hover:bg-amber-50 transition-colors p-2 bg-amber-400 rounded-md text-2xl"
                > signout
                  {/* <svg
                    className="w-8 h-8 text-orange-100 hover:text-yellow-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4a9 9 0 11-9-9 9 9 0 019 9z"
                    ></path>
                  </svg> */}
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                {/* Inscription */}
                <Register />
              </div>
              <div>
                {/* Login-btn */}
                <Login />
              </div>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-orange-100/20 px-4 pb-4 md:hidden">
          {token && (
            <ul className="space-y-3 py-4 text-xl">
              {navLinks.map((link) => (
                <li key={`${link.to}-${link.label}-mobile`}>
                  <Link
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-orange-100 transition-colors hover:text-yellow-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {token ? (
              <>
                <Randomaizer />
                <Link
                  to="/user-profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-orange-100 hover:text-yellow-400 transition-colors"
                >
                  Profil
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="rounded-md bg-amber-400 p-2 text-lg text-black transition-colors hover:bg-amber-50"
                >
                  signout
                </button>
              </>
            ) : (
              <>
                <Register />
                <Login />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
