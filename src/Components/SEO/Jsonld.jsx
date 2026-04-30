// src/Components/SEO/JsonLd.jsx
// Structured data (JSON-LD) injected in <head> for rich Google results.
// No client bundle cost — this renders only on the server.

const BASE_URL = "https://abbasvisuals.com";

export default function JsonLd() {
  // ── 1. Person (the photographer) ──────────────────────────────────────
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    name: "Ahmed Abbas",
    alternateName: "Abbas Visuals",
    url: BASE_URL,
    image: `/og-image.jpg`,
    jobTitle: "Commercial & Fine-Art Photographer",
    description:
      "Award-winning luxury photographer and creative director based in Dubai, UAE. Specialising in advertising, hospitality, automotive, fine-art, and F&B photography.",
    sameAs: [
      "https://www.instagram.com/_ahmed.abbas",
      "https://www.behance.net/abbas_visuals",
      "https://www.linkedin.com/in/ahmedabbas-ph/",
      "https://www.facebook.com/AhmedAbbas.ph",
    ],
    knowsAbout: [
      "Commercial Photography",
      "Advertising Photography",
      "Hospitality Photography",
      "Automotive Photography",
      "Fine Art Photography",
      "Food & Beverage Photography",
      "Creative Direction",
      "Brand Storytelling",
    ],
    worksFor: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
    },
  };

  // ── 2. Organization (the studio) ──────────────────────────────────────
  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": `${BASE_URL}/#organization`,
    name: "Abbas Visuals",
    alternateName: "Abbas Visuals Creative Studio",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/favicon.png`,
      width: 512,
      height: 512,
    },
    image: `/og-image.jpg`,
    description:
      "A global creative and innovation studio crafting culturally-inspired, social-first content for luxury and global brands.",
    telephone: "+971547321359",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "25.2048",
      longitude: "55.2708",
    },
    areaServed: [
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Saudi Arabia" },
      { "@type": "Country", name: "Egypt" },
      { "@type": "Country", name: "United States" },
    ],
    priceRange: "$$$",
    sameAs: [
      "https://www.instagram.com/_ahmed.abbas",
      "https://www.behance.net/abbas_visuals",
      "https://www.linkedin.com/in/ahmedabbas-ph/",
      "https://www.facebook.com/AhmedAbbas.ph",
    ],
    founder: { "@id": `${BASE_URL}/#person` },
    knowsAbout: [
      "Commercial Photography",
      "Hospitality Photography",
      "Advertising Photography",
      "Fine Art Photography",
      "Automotive Photography",
      "Food Photography",
      "Video Production",
    ],
  };

  // ── 3. Website ─────────────────────────────────────────────────────────
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "ABBAS VISUALS",
    description:
      "Award-winning luxury photography & creative studio by Ahmed Abbas – Dubai, UAE.",
    publisher: { "@id": `${BASE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/?s={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  // ── 4. Portfolio (CreativeWork) ────────────────────────────────────────
  const portfolio = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${BASE_URL}/#portfolio`,
    name: "Abbas Visuals Portfolio",
    description:
      "Photography portfolio featuring luxury brands including Jumeirah, Adidas, Puma, BMW, Porsche, Samsung and more.",
    url: `${BASE_URL}/#PROJECTS`,
    author: { "@id": `${BASE_URL}/#person` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    about: [
      { "@type": "Thing", name: "Commercial Photography" },
      { "@type": "Thing", name: "Hospitality Photography" },
      { "@type": "Thing", name: "Automotive Photography" },
      { "@type": "Thing", name: "Fine Art Photography" },
    ],
  };

  // ── 5. FAQ (helps grab FAQ rich result in SERP) ────────────────────────
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What photography services does Abbas Visuals offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Abbas Visuals offers commercial photography, advertising campaigns, hospitality & F&B photography, automotive photography, fine art, fashion, jewelry, architecture & interior photography, and video production across the UAE, KSA, Egypt, and the US.",
        },
      },
      {
        "@type": "Question",
        name: "Which brands has Abbas Visuals worked with?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Abbas Visuals has worked with global brands including Jumeirah Hotels, Adidas UAE, Puma Middle East, BMW Middle East, Porsche, Samsung, Emirates, and many others.",
        },
      },
      {
        "@type": "Question",
        name: "Where is Abbas Visuals based?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Abbas Visuals is based in Dubai, UAE, and works globally across the United Arab Emirates, Saudi Arabia, Egypt, and the United States.",
        },
      },
      {
        "@type": "Question",
        name: "How can I book Abbas Visuals for a photography project?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can book Abbas Visuals by filling in the contact form on our website or by calling +971 54 732 1359.",
        },
      },
      {
        "@type": "Question",
        name: "Does Abbas Visuals do video production?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Abbas Visuals handles full video production including pre-production, production, and post-production for brands, hospitality groups, and advertising campaigns.",
        },
      },
    ],
  };

  // ── 6. Breadcrumb for homepage ─────────────────────────────────────────
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Portfolio", item: `${BASE_URL}/#PROJECTS` },
      { "@type": "ListItem", position: 3, name: "Contact", item: `${BASE_URL}/#CONTACT` },
    ],
  };

  const schemas = [person, organization, website, portfolio, faq, breadcrumb];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
        />
      ))}
    </>
  );
}