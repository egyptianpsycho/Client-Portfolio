"use client";
import { Linkedin, Instagram, Facebook } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="sm:absolute bottom-0 w-full bg-transparent text-white py-4 sm:py-6 px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 z-[99]">

      {/* LEFT / CENTER group */}
      <div className="flex flex-col items-center md:items-start lg:ml-10 gap-2 sm:gap-3">
        
        {/* Social Icons */}
        <div className="flex items-center gap-4 sm:gap-6 text-lime-300">
          <Link href="https://www.linkedin.com/in/ahmedabbas-ph/" target="_blank" className="hover:scale-110 hover:opacity-70 transition duration-300"> 
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7">
              <path fillRule="evenodd" clipRule="evenodd" d="M4.5 3C3.67157 3 3 3.67157 3 4.5V19.5C3 20.3284 3.67157 21 4.5 21H19.5C20.3284 21 21 20.3284 21 19.5V4.5C21 3.67157 20.3284 3 19.5 3H4.5ZM8.52076 7.00272C8.52639 7.95897 7.81061 8.54819 6.96123 8.54397C6.16107 8.53975 5.46357 7.90272 5.46779 7.00413C5.47201 6.15897 6.13998 5.47975 7.00764 5.49944C7.88795 5.51913 8.52639 6.1646 8.52076 7.00272ZM12.2797 9.76176H9.75971H9.7583V18.3216H12.4217V18.1219C12.4217 17.742 12.4214 17.362 12.4211 16.9819V16.9818V16.9816V16.9815V16.9812C12.4203 15.9674 12.4194 14.9532 12.4246 13.9397C12.426 13.6936 12.4372 13.4377 12.5005 13.2028C12.7381 12.3253 13.5271 11.7586 14.4074 11.8979C14.9727 11.9864 15.3467 12.3141 15.5042 12.8471C15.6013 13.1803 15.6449 13.5389 15.6491 13.8863C15.6605 14.9339 15.6589 15.9815 15.6573 17.0292V17.0294C15.6567 17.3992 15.6561 17.769 15.6561 18.1388V18.3202H18.328V18.1149C18.328 17.6629 18.3278 17.211 18.3275 16.7591V16.759V16.7588C18.327 15.6293 18.3264 14.5001 18.3294 13.3702C18.3308 12.8597 18.276 12.3563 18.1508 11.8627C17.9638 11.1286 17.5771 10.5211 16.9485 10.0824C16.5027 9.77019 16.0133 9.5691 15.4663 9.5466C15.404 9.54401 15.3412 9.54062 15.2781 9.53721L15.2781 9.53721L15.2781 9.53721C14.9984 9.52209 14.7141 9.50673 14.4467 9.56066C13.6817 9.71394 13.0096 10.0641 12.5019 10.6814C12.4429 10.7522 12.3852 10.8241 12.2991 10.9314L12.2991 10.9315L12.2797 10.9557V9.76176ZM5.68164 18.3244H8.33242V9.76733H5.68164V18.3244Z" fill="CurrentColor"></path>
            </svg>
          </Link>

          <Link href="https://www.instagram.com/_ahmed.abbas" target="_blank" className="hover:scale-110 transition-transform duration-300">
            <Instagram className="cursor-pointer hover:opacity-70 transition duration-300 w-5 h-5 sm:w-6 sm:h-6" />
          </Link>

          <Link href="https://www.facebook.com/AhmedAbbas.ph" target="_blank" className="hover:scale-110 transition-transform duration-300">
            <Facebook className="cursor-pointer hover:opacity-70 transition duration-300 pointer-events-auto w-5 h-5 sm:w-6 sm:h-6" />
          </Link>

          <Link href="https://www.behance.net/abbas_visuals" target="_blank" className="hover:scale-110 transition-transform duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="#bbf451"
              viewBox="0 0 24 24"
              className="cursor-pointer hover:opacity-70 transition duration-300 w-8 h-8 sm:w-9 sm:h-9" 
            >
              <path d="M18.5 7.5h-5v1.5h5V7.5zM13.6 12.2c0-1.5 1.2-2.6 2.7-2.6 1.6 0 2.7 1.1 2.7 2.7v.3h-4c.1.8.7 1.3 1.5 1.3.6 0 1.1-.3 1.3-.8h1.2c-.3 1.2-1.4 2-2.6 2-1.5 0-2.8-1.2-2.8-2.9zm2.7-1.5c-.8 0-1.3.5-1.4 1.2h2.8c-.1-.7-.6-1.2-1.4-1.2zM6.1 7c1.9 0 3.1 1 3.1 2.6 0 1-.4 1.7-1.2 2.1 1 .4 1.6 1.2 1.6 2.3 0 1.8-1.3 2.9-3.3 2.9H2V7h4.1zm-2.7 4.1h2.5c1 0 1.6-.5 1.6-1.4S7 8.4 5.9 8.4H3.4v2.7zm0 4.3h2.7c1.1 0 1.8-.5 1.8-1.5s-.7-1.5-1.8-1.5H3.4v3z" />
            </svg>
          </Link>
        </div>

        {/* Phone number under links */}
        <div className="text-gray-200/70 mx-auto text-xs sm:text-sm pointer-events-auto z-[99]">
          +971 54 732 1359
        </div>
      </div>

      {/* RIGHT */}
      <p className="text-[10px] sm:text-xs text-gray-400 md:mr-10">All rights reserved ©</p>
    </footer>
  );
}