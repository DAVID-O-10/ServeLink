import React, { useEffect, useRef, useState } from "react";

function ContactUs() {
  const wrapperRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const existing = document.getElementById("visme-script");
          if (!existing) {
            const script = document.createElement("script");
            script.id = "visme-script";
            script.src =
              "https://static-bundles.visme.co/forms/vismeforms-embed.js";
            script.async = true;
            script.onload = () => setLoaded(true);
            document.body.appendChild(script);
          } else {
            setLoaded(true);
          }
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact"
      className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div ref={wrapperRef} className="w-full max-w-5xl px-6">
        {!loaded && (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
            </div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 bg-emerald-200 dark:bg-emerald-800 rounded w-1/3 mx-auto" />
          </div>
        )}
        <div
          className="visme_d"
          data-title="Contact Us Contact Form"
          data-url="8kvm09zv-contact-us-contact-form"
          data-domain="forms"
          data-full-page="false"
          data-min-height="500px"
          data-form-id="178270"
          style={!loaded ? { minHeight: "500px" } : undefined}
        />
      </div>
    </section>
  );
}

export default ContactUs;
