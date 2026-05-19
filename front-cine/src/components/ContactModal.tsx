// src/components/ContactModal.tsx  (ou Contact.tsx si tu préfères garder ce nom)

import { useState, useEffect } from "react";
import { Mail, Phone, X, Send } from "lucide-react";

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Pour permettre l'ouverture depuis le footer ou ailleurs via événement
  useEffect(() => {
    const handler = () => {
      setIsOpen(true);
      setFormStatus("idle");
    };
    document.addEventListener("open-contact-modal", handler);
    return () => document.removeEventListener("open-contact-modal", handler);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // reset après fermeture
    setTimeout(() => setFormStatus("idle"), 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");

    // Simulation d'envoi – remplace par ton vrai appel API quand prêt
    await new Promise((r) => setTimeout(r, 1400));

    // 80% de chance de succès pour la démo
    if (Math.random() > 0.2) {
      setFormStatus("success");
    } else {
      setFormStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm p-12">
      <div className="relative bg-zinc-900 text-white rounded-2xl shadow-2xl border border-yellow-500/20 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Petite flèche décorative */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-transparent border-b-zinc-900" />

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-100 drop-shadow-sm">
              Contactez-nous
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {formStatus === "success" ? (
            <div className="text-center py-10 space-y-4">
              <div className="text-green-400 text-5xl">🎉</div>
              <h3 className="text-xl font-semibold text-green-300">Message envoyé !</h3>
              <p className="text-gray-300">On vous répondra très vite.</p>
              <button
                onClick={handleClose}
                className="mt-6 bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-medium transition"
              >
                Fermer
              </button>
            </div>
          ) : formStatus === "error" ? (
            <div className="text-center py-10 space-y-4">
              <div className="text-red-400 text-5xl">😕</div>
              <h3 className="text-xl font-semibold text-red-300">Oups, erreur...</h3>
              <p className="text-gray-300">Réessayez ou contactez-nous directement par mail/téléphone.</p>
              <button
                onClick={() => setFormStatus("idle")}
                className="mt-4 bg-zinc-700 hover:bg-zinc-600 px-6 py-2 rounded-lg transition"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <>
              {/* Coordonnées rapides */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-zinc-800/50 p-5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-sm opacity-70">Téléphone</p>
                    <p className="font-medium">00 00 00 00 00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-sm opacity-70">Email</p>
                    <p className="font-medium">cine.spin@movie.fr</p>
                  </div>
                </div>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm mb-1.5 opacity-80">
                    Votre nom
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-yellow-500/60 transition"
                    placeholder="Comment vous appelez-vous ?"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm mb-1.5 opacity-80">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-yellow-500/60 transition"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm mb-1.5 opacity-80">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-yellow-500/60 transition resize-none"
                    placeholder="Votre question ou message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === "sending"}
                  className={`
                    w-full flex items-center justify-center gap-2 
                    bg-orange-100 hover:bg-yellow-400 text-black 
                    font-bold py-3.5 rounded-xl shadow-md 
                    transition-all duration-200
                    disabled:bg-gray-600 disabled:cursor-not-allowed
                  `}
                >
                  {formStatus === "sending" ? (
                    <>
                      <Send className="w-5 h-5 animate-pulse" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-gray-500 mt-6">
                On vous répondra dans les plus brefs délais
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}