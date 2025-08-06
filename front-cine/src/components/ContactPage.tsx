// src/components/ContactPage.tsx
import React from 'react';

interface ContactPageProps {
  compact?: boolean; // Ajoutez cette prop pour un affichage réduit
}

const ContactPage: React.FC<ContactPageProps> = ({ compact = false }) => {
  return (
    <div className={compact ? "compact-contact" : "max-w-2xl mx-auto p-6"}>
      {!compact && (
        <h1 className="text-2xl font-bold mb-6">Vous pouvez nous contacter à ces coordonnées :</h1>
      )}
      
      <ul className={`${compact ? "space-y-1" : "list-disc pl-6 mb-8 space-y-2"}`}>
        <li className={compact ? "text-base" : "text-lg"}>00.00.00.00.00</li>
        <li className={compact ? "text-base" : "text-lg"}>cine.spin@movie.fr</li>
      </ul>
      
      {!compact && (
        <div className="border-t pt-6">
          <div className="flex justify-between">
            <div>
              <h2 className="font-bold mb-2">Contact</h2>
              <p>Conditions Générales de Vente</p>
            </div>
            
            <div>
              <h2 className="font-bold mb-2">Mention légale</h2>
              <p>Condition d'utilisation</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;