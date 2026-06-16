import { useEffect } from 'react';

const SITE = 'https://serve-link-swart.vercel.app';

const DEFAULT = {
  title: 'ServeLink — Find, Connect, Get It Done',
  description:
    'ServeLink connects you with trusted local businesses and service providers across Nigeria. Discover, compare, and contact vendors in your area.',
  image: '/og-image.png',
  url: SITE,
};

export default function SEO({ title, description = DEFAULT.description, image = DEFAULT.image, url }) {
  const fullTitle = title ? `${title} | ServeLink` : DEFAULT.title;
  const pageUrl = url ? `${SITE}${url}` : SITE;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr, value, content) => {
      let el = document.querySelector(`meta[${attr}="${value}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:image', image.startsWith('http') ? image : `${SITE}${image}`);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image.startsWith('http') ? image : `${SITE}${image}`);

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = pageUrl;
  }, [fullTitle, description, image, pageUrl]);

  return null;
}
