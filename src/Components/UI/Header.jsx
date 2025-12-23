"use client";
import useAnimate from "@/Hooks/useAnimate";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useAnimate(() => {

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

      gsap.fromTo(
        "#header",
        {  opacity: 0,filter:"blur(10px)"  },
        {  opacity: 1, duration: 1, delay: 2.5,filter:"blur(0px)" , ease: "power3.out", }
      );
      gsap.fromTo(
        "#AV-logo",
        {  opacity: 0, filter:"blur(8px)"  },
        { filter:"blur(0px) drop-shadow(5px 0px 12px rgba(255, 255, 255,0.5))", opacity: 1, duration: 2,  ease: "expo.out",scrollTrigger: {
          trigger: "#pathToAnimate1",
          start: "top top-=10%",
          scroller: "[data-scroll-container]",
        } }
      );
    
    
  });
  const links = [
    { href: "/about", label: "ABOUT ME" },
    { href: "#PARTNERS", label: "PARTNERS" },
    { href: "#PROJECTS", label: "PROJECTS" },
    { href: "#BOOK", label: "BOOK" },
    { href: "#CONTACT", label: "CONTACT" },
  ];
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
    <h2 className=" text-4xl max-sm:text-xl max-sm:ml-4 opacity-0 text-[#FFFFFF] ml-9 font-bold fixed top-6 z-[99999] mix-blend-difference   " id="AV-logo" style={{
                 
                fontFamily: " 'Bebas Neue', 'serif' ",
              }}>Abbas Visuals.</h2>

{!isMobile ?(
    <header id="header" className="fixed top-6 opacity-0 right-13 z-[500]  font-bold px-5 py-1  rounded-full backdrop-blur-sm w-[480px] flex justify-between  items-center text-[#FFFFFF] " 
    style={{
      background: 'rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
    }}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className=" text-[12.8px] py-1  "
          style={{ fontFamily: '"Work Sans", sans-serif',color:"#FFFFFF" }}
        >
          {link.label}
        </Link>
      ))}
    </header>) : (
  <>
    <div className="fixed top-6 right-6 z-[700]">
      <svg
        className={`ham ham3 cursor-pointer ${isMenuOpen ? 'active' : ''}`}
        viewBox="0 0 100 100"
        width="60"
        onClick={toggleMenu}
      >
        <path
          className="line top"
          d="m 70,33 h -40 c -11.092231,0 11.883874,13.496726 -3.420361,12.956839 -0.962502,-2.089471 -2.222071,-3.282996 -4.545687,-3.282996 -2.323616,0 -5.113897,2.622752 -5.113897,7.071068 0,4.448316 2.080609,7.007933 5.555839,7.007933 2.401943,0 2.96769,-1.283974 4.166879,-3.282995 2.209342,0.273823 4.031294,1.642466 5.857227,-0.252538 v -13.005715 16.288404 h 7.653568"
        />
        <path
          className="line middle"
          d="m 70,50 h -40 c -5.6862,0 -8.534259,5.373483 -8.534259,11.551069 0,7.187738 3.499166,10.922274 13.131984,10.922274 11.021777,0 7.022787,-15.773343 15.531095,-15.773343 3.268142,0 5.177031,-2.159429 5.177031,-6.7 0,-4.540571 -1.766442,-7.33533 -5.087851,-7.326157 -3.321409,0.0092 -5.771288,2.789632 -5.771288,7.326157 0,4.536525 2.478983,6.805271 5.771288,6.7"
        />
        <path
          className="line bottom"
          d="m 70,67 h -40 c 0,0 -3.680675,0.737051 -3.660714,-3.517857 0.02541,-5.415597 3.391687,-10.357143 10.982142,-10.357143 4.048418,0 17.88928,0.178572 23.482143,0.178572 0,2.563604 2.451177,3.403635 4.642857,3.392857 2.19168,-0.01078 4.373905,-1.369814 4.375,-3.392857 0.0011,-2.023043 -1.924401,-2.589191 -4.553571,-4.107143 -2.62917,-1.517952 -4.196429,-1.799562 -4.196429,-3.660714 0,-1.861153 2.442181,-3.118811 4.196429,-3.035715 1.754248,0.0831 4.375,0.890841 4.375,3.125 2.628634,0 6.160714,0.267857 6.160714,0.267857 l -0.178571,-2.946428 10.178571,0 -10.178571,0 v 6.696428 l 8.928571,0 -8.928571,0 v 7.142858 l 10.178571,0 -10.178571,0"
        />
      </svg>
    </div>
    <div
            className={`fixed inset-0 bg-black/30 backdrop-blur-md z-[600] transition-opacity duration-300 ${
              isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={closeMenu}
          />

    {/* Mobile Menu */}
    <div
      className={`fixed top-0 right-0 h-screen w-64 bg-black/95 backdrop-blur-md z-[600] transition-transform duration-300 ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <nav className="flex flex-col gap-6 p-8 mt-20">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-gradient text-2xl font-bold mix-blend-exclusion  "
            style={{ fontFamily: '"Work Sans", sans-serif' ,color:"#FFFFFF" }}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <img src="/gradients/sky_gradient_white.png" alt="gradient" className="absolute top-10 left-0  w-full h-full object-cover pointer-events-none " />
      </nav>
    </div>
  </>
    )}
      </>
  );
}

export default Header;

