"use client";

import { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [bericht, setBericht] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Trigger CSS transition na mount
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    }
  }, [isOpen]);

  // Scroll vergrendelen terwijl modal open is
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Escape-toets sluit modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  });

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
      setSent(false);
      setNaam(""); setEmail(""); setBericht("");
    }, 280);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // TODO: koppel hier een e-maildienst (bijv. Resend, Formspree)
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end md:items-center justify-center transition-opacity duration-280 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        className={`relative bg-white w-full md:max-w-lg md:mx-4 rounded-t-2xl md:rounded-2xl px-8 pt-8 pb-10 md:p-10 transition-all duration-280 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Contactformulier"
      >
        {/* Sluitknop */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-[#1f1f1f]/30 hover:text-[#1f1f1f] transition-colors cursor-pointer"
          aria-label="Sluiten"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        </button>

        {sent ? (
          /* Succesmelding */
          <div className="flex flex-col gap-4 py-6 items-center text-center">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10l4 4 8-8" />
              </svg>
            </div>
            <h3 className="font-semibold text-[20px] tracking-[-0.04em] text-[#1f1f1f]">Bericht verzonden!</h3>
            <p className="text-[14px] text-[#1f1f1f]/55 leading-[1.6]">
              Bedankt voor je bericht. Ik neem zo snel mogelijk contact met je op.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 bg-black text-white font-medium text-[14px] tracking-[-0.56px] px-6 py-3 rounded-[24px] cursor-pointer hover:opacity-80 transition-opacity"
            >
              Sluiten
            </button>
          </div>
        ) : (
          /* Formulier */
          <>
            <div className="mb-7">
              <p className="font-mono text-[11px] text-[#1f1f1f]/35 uppercase tracking-widest mb-2">
                [ laten we praten ]
              </p>
              <h2 className="font-semibold text-[22px] tracking-[-0.05em] text-[#1f1f1f]">
                Let&apos;s talk
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-[#1f1f1f]/45">
                  Naam
                </label>
                <input
                  type="text"
                  required
                  value={naam}
                  onChange={(e) => setNaam(e.target.value)}
                  placeholder="Jouw naam"
                  className="border border-[#e8e8e8] rounded-xl px-4 py-3 text-[14px] text-[#1f1f1f] placeholder:text-[#1f1f1f]/25 focus:outline-none focus:border-black transition-colors bg-[#fafafa]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-[#1f1f1f]/45">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jouw@email.nl"
                  className="border border-[#e8e8e8] rounded-xl px-4 py-3 text-[14px] text-[#1f1f1f] placeholder:text-[#1f1f1f]/25 focus:outline-none focus:border-black transition-colors bg-[#fafafa]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-[#1f1f1f]/45">
                  Bericht
                </label>
                <textarea
                  required
                  value={bericht}
                  onChange={(e) => setBericht(e.target.value)}
                  placeholder="Vertel iets over je project of vraag…"
                  rows={4}
                  className="border border-[#e8e8e8] rounded-xl px-4 py-3 text-[14px] text-[#1f1f1f] placeholder:text-[#1f1f1f]/25 focus:outline-none focus:border-black transition-colors resize-none bg-[#fafafa]"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="mt-2 bg-black text-white font-medium text-[14px] tracking-[-0.56px] px-6 py-3 rounded-[24px] cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40"
              >
                {sending ? "Verzenden…" : "Versturen"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
