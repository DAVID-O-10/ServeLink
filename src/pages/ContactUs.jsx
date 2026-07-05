import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

function ContactUs() {
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch(
        "https://formsubmit.co/davidjide10@gmail.com",
        {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        }
      );

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="w-full max-w-2xl px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Get in Touch
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
          Have a question or want to work together? Drop us a message.
        </p>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <CheckCircle className="w-16 h-16 text-emerald-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Message Sent!
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Thanks for reaching out. We&apos;ll get back to you soon.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 px-6 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" name="_subject" value="New message from ServeLink" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                placeholder="How can we help?"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell us more..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none"
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                Something went wrong. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              {status === "sending" ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default ContactUs;
