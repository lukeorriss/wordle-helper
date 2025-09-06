// This file controls the robots.txt output for the Next.js app

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://wordle.orriss.dev/sitemap.xml",
    host: "https://wordle.orriss.dev",
  };
}
