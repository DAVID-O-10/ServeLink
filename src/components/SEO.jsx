import { useEffect } from 'react';

const DEFAULT = {
  title: 'ServeLink — Find, Connect, Get It Done',
  description:
    'ServeLink connects you with trusted local businesses and service providers across Nigeria. Discover, compare, and contact vendors in your area.',
};

export default function SEO({ title, description = DEFAULT.description }) {
  const fullTitle = title ? `${title} | ServeLink` : DEFAULT.title;

  useEffect(() => {
    document.title = fullTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;

    let og = document.querySelector('meta[property="og:title"]');
    if (!og) {
      og = document.createElement('meta');
      og.setAttribute('property', 'og:title');
      document.head.appendChild(og);
    }
    og.content = fullTitle;
  }, [fullTitle, description]);

  return null;
}
