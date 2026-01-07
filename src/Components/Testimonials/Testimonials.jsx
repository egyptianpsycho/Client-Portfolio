"use client";
import React from "react";
import { HeroParallax } from "./HeroParallax";

export function Testimonials() {
  return <HeroParallax testimonials={testimonials} />;
}
export const testimonials = [
  // ================= ROW 1 =================
  {
    id: 1,
    name: "Yassin",
    position: "Marketing Lead",
    company: "Unique Talents",
    testimonial:
      "Your creativity and ability to think outside the box make every project fun, exciting, and effortless. You create great content on the spot, and it’s always a pleasure working together and we can’t wait for what we create next.",
    initial: "Y",
  },
  {
    id: 2,
    name: "KERR MCILWRAITH",
    position: "Creative Director",
    company: "Flint Culture",
    testimonial:
      "Agile, dynamic, and reliable. Ahmed adapts quickly to fast-changing production environments and always delivers quality.",
    initial: "KM",
  },

  //  CENTER – BMW
  {
    id: 3,
    name: "Hassan Hassan",
    position: "Social Media Manager",
    company: "BMW Middle East",
    testimonial:
      "Ahmed Abbas stands out for combining creativity with true professionalism. Across multiple automotive shoots, his execution and team coordination were outstanding.",
    photo: "/Logos/bmw.png",
    initial: "HH",
  },

  //  CENTER – adidas
  {
    id: 4,
    name: "Robert Mayuga",
    position: "Social Media Manager",
    company: "adidas UAE & @adidas Arabia",
    testimonial:
      "Such a pleasure to work with Creative, collaborative, and makes each project seamless from start to finish.",
    photo: "/Logos/adidas.png",
  },

  {
    id: 5,
    name: "Yassin",
    position: "Marketing Lead",
    company: "Unique Talents",
    testimonial:
      "Every project with Ahmed feels collaborative and dynamic. His instincts on set are sharp and reliable.",
    initial: "Y",
  },

  // ================= ROW 2 =================
  {
    id: 6,
    name: "KERR MCILWRAITH",
    position: "Creative Director",
    company: "Flint Culture",
    testimonial:
      "Fast-paced projects demand flexibility, and Ahmed delivers every time without compromising quality.",
    initial: "KM",
  },
  {
    id: 7,
    name: "Producer",
    position: "Campaign Producer",
    company: "Advertising Films",
    testimonial:
      "For advertising that grabs attention and delivers results, hire Ahmed Abbas. He played a key role in our campaign, making visuals that performed brilliantly on social media and stood out on billboards across the country.",
    initial: "P",
  },

  //  CENTER – JUMEIRAH
  {
    id: 8,
    name: "Jumeirah Marketing Team",
    position: "Brand & Marketing",
    company: "Jumeirah",
    testimonial:
      "Ahmed’s cinematic style conveys emotion and atmosphere, not just spaces. He’s been an invaluable visual storyteller for our brand.",
    photo: "/Logos/jumeira.png",
  },

  //  CENTER – FASHION / NYC
  {
    id: 9,
    name: "Gabbana Modeling Agency",
    position: "Agency Director",
    company: "NYC Fashion Week",
    testimonial:
      "Ahmed Abbas captured elegance, energy, and style in our Virginia look book shoot with 10 models for NYC Fashion week. A seamless, professional, and highly creative experience from start to finish. Highly recommended.",
    photo: "/Logos/NYC.svg",
  },

  {
    id: 10,
    name: "Robert Mayuga",
    position: "Social Media Manager",
    company: "adidas UAE @adidas Arabia",
    testimonial:
      "Clear vision, strong execution, and smooth collaboration. Ahmed brings consistency to every production.",
    photo: "/Logos/adidas.png",
  },

  // ================= ROW 3 =================
  {
    id: 11,
    name: "Yassin",
    position: "Marketing Lead",
    company: "Unique Talents",
    testimonial:
      "Working with Ahmed is always efficient and creatively rewarding. He brings ideas to life quickly.",
    initial: "Y",
  },
  {
    id: 12,
    name: "KERR MCILWRAITH",
    position: "Creative Director",
    company: "Flint Culture",
    testimonial:
      "Ahmed’s adaptability and creative control make him ideal for demanding productions.",
    initial: "KM",
  },

  //  CENTER – F&B SCALE
  {
    id: 13,
    name: "Marwa Hassanin",
    position: "Creative Director",
    company: "F&B Multi-Brand Group",
    testimonial:
      "Working with Abbas for two years across 12 of our F&B brands has been a game-changer. He has an unparalleled talent for making food look not just beautiful, but irresistible. He's a true master of his craft.",
    initial: "MH",
  },

  //  CENTER – NATIONAL IMPACT
  {
    id: 14,
    name: "Producer",
    position: "Campaign Producer",
    company: "National Advertising Campaigns",
    testimonial:
      "For advertising that grabs attention and delivers results, hire Ahmed Abbas. He played a key role in our campaign, making visuals that performed brilliantly on social media and stood out on billboards across the country.",
    initial: "P",
  },

  {
    id: 15,
    name: "Jumeirah Marketing Team",
    position: "Brand & Marketing",
    company: "Jumeirah",
    testimonial:
      "Ahmed has a talent for capturing authentic, elegant moments that align perfectly with luxury hospitality branding.",
    photo: "/Logos/jumeira.png",
    initial: "JM",
  },
];
