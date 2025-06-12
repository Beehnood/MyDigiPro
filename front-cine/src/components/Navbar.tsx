import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Navbar = () => {
  const { token } = useAuth();

  return (
    <nav className="bg-black shadow-md ">
      <div className="flex items-center justify-between py-4 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className=" w-16 h-16 flex items-center ">
          <img src="../public/Logo-rouge.png" alt="image-logo" />
        </div>
        <div className=" flex items-center  ">
          <ul className="flex text-3xl space-x-12">
          
            {token && (
              <>
                <li>
              <a
                href="/"
                className="text-orange-100 hover:text-yellow-400 transition-colors "
              >
                Accueil
              </a>
            </li>
                <li>
                  <a
                    href="/Collection"
                    className="text-orange-100 hover:text-yellow-400 transition-colors"
                  >
                    Collection
                  </a>
                </li>
                <li>
                  <Link
                    to="/BlogSection"
                    className="text-orange-100 hover:text-yellow-400 transition-colors"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-orange-100 hover:text-yellow-400 transition-colors"
                  >
                    Films
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-orange-100 hover:text-yellow-400 transition-colors"
                  >
                    Boutique
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="flex items-center space-x-2 ml-12">
          {token ? (
            <>
              {/* Randomize */}
              <div>
                <img className="w-8 h-6" src="../public/randomize.png" alt="" />
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
                  to="/Dashboard"
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
            </>
          ) : (
            <>
              <div>
                {/* Inscription */}
                <button className="bg-yellow-400 text-black tracking-wider w-24 h-8 text-md px-4 rounded-md hover:text-black transition-colors">
                  <Link to="/Register">Inscription</Link>
                </button>
              </div>
              <div>
                {/* Login-btn */}
                <button className="bg-[#242424] text-white tracking-wider w-24 h-8 text-md px-4 rounded-md hover:text-yellow-400 hover:shadow-yellow-200 transition-colors">
                  <Link to="/Login">Connexion</Link>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
