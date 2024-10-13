import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://phantomrideknust.site',
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: 'https://phantomrideknust.site/book',
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: 'https://phantomrideknust.site/about',
      lastModified: new Date(),
    },
    {
      url: 'https://phantomrideknust.site/contact',
      lastModified: new Date(),
    },
    {
      url: 'https://phantomrideknust.site/pickups',
      lastModified: new Date(),
    },
    {
      url: 'https://phantomrideknust.site/contact',
      lastModified: new Date(),
    }, 
  ]
}