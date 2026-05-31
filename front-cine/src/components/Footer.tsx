// src/components/Footer.tsx
import React, { useState } from "react";
import ContactModal from "./ContactModal"; // ← nouveau composant

export const Footer = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const assetBaseUrl = import.meta.env.BASE_URL;

  return (
    <>
      <footer className="bg-black w-full h-60 text-center text-white px-12 py-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-between gap-8 items-center">
          <div className="w-36 h-36 col-span-1 items-center">
            <img src={`${assetBaseUrl}Logo-blanc.png`} alt="CineSpin" />
          </div>

          {/* Col 1 */}
          <div className="flex md:flex-row space-y-4 md:space-y-0 md:space-x-8 mb-4 md:mb-0">
            <ul className="text-white text-2xl">
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
          <div className="grid-span-3 md:flex-row space-y-4 md:space-y-0 md:space-x-8 mb-4 md:mb-0">
            <ul className="text-white text-2xl">
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
