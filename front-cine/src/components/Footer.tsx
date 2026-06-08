// src/components/Footer.tsx
import React, { useState } from "react";
import ContactModal from "./ContactModal"; // ← nouveau composant

export const Footer = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const assetBaseUrl = import.meta.env.BASE_URL;

  return (
    <>
      <footer className="bg-black w-full text-center text-white px-4 py-8 md:px-12 md:py-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-8 px-4 md:flex-row md:px-6">
          <div className="w-24 h-24 items-center md:w-36 md:h-36">
            <img src={`${assetBaseUrl}Logo-blanc.png`} alt="CineSpin" />
          </div>

          {/* Col 1 */}
          <div className="mb-4 md:mb-0">
            <ul className="space-y-3 text-white text-lg sm:text-xl md:text-2xl">
              <li>
                <button
                  onClick={() =>
                    document.dispatchEvent(new Event("open-contact-modal"))
                  }
                >
                  CONTACT
                </button>
                <ContactModal />
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  CONDITIONS GÉNÉRALES <br /> DE VENTE
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="mb-4 md:mb-0">
            <ul className="space-y-3 text-white text-lg sm:text-xl md:text-2xl">
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  MENTION LÉGALE
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  CRÉDITS
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  CONDITIONS D'UTILISATION
                </a>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div className="flex space-x-4">
            {/* ... tes icônes Facebook / Instagram ... */}
          </div>
        </div>
      </footer>

      
    </>
  );
};
