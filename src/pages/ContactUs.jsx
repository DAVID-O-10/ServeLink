import React, { useEffect } from "react";

function ContactUs() {
  useEffect(() => {
    const existingScript = document.getElementById("visme-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "visme-script";
      script.src =
        "https://static-bundles.visme.co/forms/vismeforms-embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-5xl">
        <div
          className="visme_d"
          data-title="Contact Us Contact Form"
          data-url="8kvm09zv-contact-us-contact-form"
          data-domain="forms"
          data-full-page="false"
          data-min-height="500px"
          data-form-id="178270"
        />
      </div>
    </section>
  );
}

export default ContactUs;