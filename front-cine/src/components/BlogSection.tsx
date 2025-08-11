import ButtonRouge from "./ButtonRouge"
import React from "react";


export const BlogSection = () => {
  return (
    <section className=" flex py-12 bg-orange-100 text-black">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-6">DERNIERS ARTICLES DE BLOGS</h2>
        <div className="flex justify-between gap-8">
          <div>
            <h3 className=" grid text-2xl tracking-wider font-bold mb-2 ">
              OUVERTURE DE CINÉMA LUMINOYA À RENNES : UNE EXPÉRIENCE CINÉMATOGRAPHIQUE NOUVELLE GÉNÉRATION EN ILLE-ET-VILAINE
            </h3>
            <p className="text-xl tracking-wider mb-4">
              La ville de Rennes s’apprête à accueillir un nouveau cinéma révolutionnaire : le Cinéma Luminoya. Situé en plein cœur de la ville, ce complexe ultramoderne promet une expérience cinématographique inégalée pour les habitants et les visiteurs. Doté de technologies de pointe, comme des écrans 4DX et des projections laser, il vise à redéfinir le divertissement au cinéma. De plus, le cinéma proposera une programmation variée pour tous les goûts, allant des blockbusters aux films d’auteur, en passant par des projections spéciales et des festivals.
            </p>
            <ButtonRouge/>
          </div>
          
          <div>
            <div>
            <h3 className=" grid text-2xl tracking-wider text-space-0.5 font-bold mb-2 ">
              “BASILIC” : LE FILM ÉTUDIANT RENNNAIS QUI BOUSCULE LES CODES DU CINÉMA INDÉPENDANT
            </h3>
            <p className="text-xl tracking-wider mb-4">
              “Basilic”, un court-métrage réalisé par un groupe d’étudiants rennais, fait déjà parler de lui dans les cercles du cinéma indépendant. Tourné avec un budget limité mais une créativité débordante, ce film explore des thèmes sociaux contemporains à travers une esthétique audacieuse. Présenté en avant-première lors d’un festival local, il a reçu des critiques élogieuses pour son originalité et sa profondeur. Ce projet illustre parfaitement le dynamisme de la scène cinématographique étudiante à Rennes.
            </p>
          </div>
           <span className="my-6"><ButtonRouge/></span>
        </div>
          </div>
        <div className="mt-8 text-center">
          <a href="./blogList" className="text-[#8B0000] text-xl font-bold hover:text-yellow-400 transition-colors">TOUS LES ARTICLES DES BLOGS →</a>
        </div>
      </div>
    </section>
  );
};