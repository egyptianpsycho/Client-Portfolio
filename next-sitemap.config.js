module.exports = {
  siteUrl: "https://abbasvisuals.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "monthly",
  priority: 1.0,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        // Not /_next/: Google needs those JS/CSS files to render the page,
        // and every optimized image is served from /_next/image.
        disallow: ["/api/"],
      },
    ],
  },
};