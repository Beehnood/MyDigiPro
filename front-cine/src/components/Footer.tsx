import React from "react";
import "../App.css";
import ContactPage from "./ContactPage";


export const Footer = () => {
  return (
    <footer className="bg-black w-100% h-60 text-center text-white px-12 py-12">
      <div className="max-w-7xl mx-auto px-6 flex justify-between gap-8 items-center ">
        <div className="w-36 h-36 col-span-1  items-center ">
          <img src="../public/Logo-blanc.png" alt="" />
        </div>



         {/* clo 1 */}
        <div className=" flex  md:flex-row space-y-4 md:space-y-0 md:space-x-8 mb-4 md:mb-0">
          <ul className="text-whit  text-2xl">
            <li>
              {" "}
              <a href="/contact" className="hover:text-yellow-400 transition-colors">
                CONTACT
              </a>
            </li>
            <li>
              {" "}
              <a href="#" className=" hover:text-yellow-400 transition-colors">
                CONDITIONS GÉNÉRALES <br></br> DE VENTE
              </a>
            </li>
          </ul>
        </div>

        {/* clo 2 */}
        <div className="grid-span-3 md:flex-row space-y-4 md:space-y-0 md:space-x-8 mb-4 md:mb-0">
          <ul className="text-whit  text-2xl">
            <li>
              <a
                href="#"
                className="hover:text-yellow-400 transition-colors"
              >
                MENTION LÉGALE
              </a>
            </li>
            <li>
              <a
                href="#"
                className=" hover:text-yellow-400 transition-colors"
              >
                CRÉDITS
              </a>
            </li>
            <li>
              <a
                href="#"
                className=" hover:text-yellow-400 transition-colors"
              >
                CONDITIONS D'UTILISATION
              </a>
            </li>
          </ul>
        </div>
        <div className="flex space-x-4">
          <a
            href="#"
            className="text-white hover:text-yellow-400 transition-colors"
          >
            <svg
              className="w-12 h-12"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-white hover:text-yellow-400 transition-colors"
          >
            <svg
              className="w-12 h-12"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 15h-3v-3h3v3zm0-4h-3V7h3v6zm-4 4h-3v-3h3v3zm0-4h-3V7h3v6zm-4 4H7v-3h3v3zm0-4H7V7h3v6z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-white hover:text-yellow-400 transition-colors"
          >
            <svg
              className="w-12 h-12"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975.975 2.242 1.24 3.608 1.301 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.332.014 7.052.072 5.77.13 4.607.396 3.637 1.366 2.667 2.336 2.4 3.5 2.342 4.782 2.284 6.062 2.27 6.471 2.27 9.73s.014 3.668.072 4.948c.058 1.282.324 2.446 1.294 3.416.97.97 2.134 1.236 3.416 1.294 1.28.058 1.689.072 4.948.072s3.668-.014 4.948-.072c1.282-.058 2.446-.324 3.416-1.294.97-.97 1.236-2.134 1.294-3.416.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.058-1.282-.324-2.446-1.294-3.416-.97-.97-2.134-1.236-3.416-1.294C15.668.014 15.259 0 12 0z" />
              <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};
