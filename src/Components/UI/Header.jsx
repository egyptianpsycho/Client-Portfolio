"use client";
import gsap from "gsap";
import Link from "next/link";
import { useEffect } from "react";

export function Header() {
  useEffect(() => {
    const animateSignature = () => {
      gsap.fromTo("#header",
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay:2.5, ease: "power3.in" }
      )
    };
  
    if (!document.getElementById("preloader")) {
      animateSignature();
      return;
    }
  
    window.addEventListener("preloaderFinished", animateSignature, { once: true });
    return () => window.removeEventListener("preloaderFinished", animateSignature);
  }, []);
  const links = [
    { href: "#about", label: "ABOUT ME" },
    { href: "#partners", label: "PARTNERS" },
    { href: "#services", label: "SERVICES" },
    { href: "faq", label: "FAQ" },
    { href: "#contact", label: "CONTACT" },
  ];

  return (
    <header id="header" className="fixed top-6 opacity-0 right-13 z-50  font-bold px-5 py-1 bg-white/15 rounded-full backdrop-blur-sm w-[480px] flex justify-between  items-center text-[#FFFFFF]">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-[#FFFFFF] text-[12.8px] py-1  "
          style={{ fontFamily: '"Work Sans", sans-serif' }}
        >
          {link.label}
        </Link>
      ))}
    </header>
  );
}

export default Header;
