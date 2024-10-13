import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/contact', '/faqs', '/pickups', '/book'],
      disallow: ['/test/'],
    },
    sitemap: 'https://phantomrideknust.site/sitemap.xml',
  }
}