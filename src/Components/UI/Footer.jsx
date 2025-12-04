"use client";
import { Linkedin, Instagram, Facebook } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="absolute bottom-0 w-full bg-transparent text-white py-6 px-4 flex flex-col md:flex-row items-center justify-between gap-6 z-[99]">

      {/* LEFT / CENTER group */}
      <div className="flex flex-col items-center lg:ml-10 gap-2">
        
        {/* Social Icons */}
        <div className="flex items-center gap-6 text-lime-300">
          <Link href="https://www.linkedin.com/in/ahmedabbas-ph/" target="_blank">
            <Linkedin className="cursor-pointer hover:opacity-70 transition duration-300" size={22} />
          </Link>

          <Link href="https://www.instagram.com/_ahmed.abbas" target="_blank">
            <Instagram className="cursor-pointer hover:opacity-70 transition duration-300" size={22} />
          </Link>

          <Link href="https://www.facebook.com/AhmedAbbas.ph" target="_blank">
            <Facebook className="cursor-pointer hover:opacity-70 transition duration-300 pointer-events-auto " size={22} />
          </Link>

          <Link href="https://www.behance.net/abbas_visuals" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="#bbf451"
              viewBox="0 0 24 24"
              className="cursor-pointer hover:opacity-70 transition duration-300 " 
            >
              <path d="M18.5 7.5h-5v1.5h5V7.5zM13.6 12.2c0-1.5 1.2-2.6 2.7-2.6 1.6 0 2.7 1.1 2.7 2.7v.3h-4c.1.8.7 1.3 1.5 1.3.6 0 1.1-.3 1.3-.8h1.2c-.3 1.2-1.4 2-2.6 2-1.5 0-2.8-1.2-2.8-2.9zm2.7-1.5c-.8 0-1.3.5-1.4 1.2h2.8c-.1-.7-.6-1.2-1.4-1.2zM6.1 7c1.9 0 3.1 1 3.1 2.6 0 1-.4 1.7-1.2 2.1 1 .4 1.6 1.2 1.6 2.3 0 1.8-1.3 2.9-3.3 2.9H2V7h4.1zm-2.7 4.1h2.5c1 0 1.6-.5 1.6-1.4S7 8.4 5.9 8.4H3.4v2.7zm0 4.3h2.7c1.1 0 1.8-.5 1.8-1.5s-.7-1.5-1.8-1.5H3.4v3z" />
            </svg>
          </Link>
        </div>

        {/* Phone number under links */}
        <div className="text-gray-200/70 text-sm pointer-events-auto z-[99]">
          +971 54 732 1359
        </div>
      </div>

      {/* RIGHT */}
      <p className="text-xs text-gray-400">All rights reserved ©</p>
    </footer>
  );
}
