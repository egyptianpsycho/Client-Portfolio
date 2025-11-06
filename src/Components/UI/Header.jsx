import Link from "next/link";

export function Header() {
  const links = [
    { href: "#about", label: "ABOUT ME" },
    { href: "#partners", label: "PARTNERS" },
    { href: "#services", label: "SERVICES" },
    { href: "faq", label: "FAQ" },
    { href: "#contact", label: "CONTACT" },
  ];

  return (
    <header className="fixed top-6 right-13 z-50  font-bold px-5 py-1 bg-white/15 rounded-full backdrop-blur-sm w-[480px] flex justify-between  items-center text-[#FFFFFF]">
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
