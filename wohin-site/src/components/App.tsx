import { motion, AnimatePresence } from "framer-motion";
import { Background } from "./Background";
import { Footer } from "./Footer";
import { useState } from "react";

const vibes = [
  {
    name: "Study",
    color: "bg-sunny",
    delay: 0.2,
    rotate: "-rotate-3",
    emoji: "📚",
  },
  {
    name: "Relax",
    color: "bg-matcha",
    delay: 0.4,
    rotate: "rotate-2",
    emoji: "🍵",
  },
  {
    name: "Party",
    color: "bg-peach",
    delay: 0.6,
    rotate: "-rotate-6",
    emoji: "🪩",
  },
];

function App() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("You're on the list! We'll reach out soon.");
        setEmail("");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Failed to join waitlist.",
      );
    }
  };

  return (
    <>
      <Background intensity="bold" />
      <div className="relative z-10 min-h-screen overflow-hidden text-ink">
        <main className="relative mx-auto max-w-6xl px-6 pt-14 pb-12 md:px-10 md:pt-20 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-20 font-display text-2xl font-extrabold tracking-tighter uppercase md:mb-32 md:text-3xl"
          >
            wohin.
          </motion.div>

          <section className="mb-32 flex flex-col items-center gap-12 md:mb-48 md:flex-row md:gap-24">
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="mb-6 inline-block rounded-2xl bg-white/50 px-4 py-2 text-sm font-semibold tracking-widest text-muted uppercase backdrop-blur-md"
              >
                Launching Soon
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="mb-8 font-display text-6xl leading-[0.9] font-black tracking-tighter md:text-8xl"
              >
                Find your <br />
                <span className="relative mt-2 inline-block">
                  <span className="relative z-10">perfect vibe.</span>
                  <span className="absolute bottom-2 left-0 -z-10 h-4 w-full -rotate-1 transform rounded-full bg-sunny opacity-80"></span>
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mb-10 max-w-lg text-xl leading-relaxed font-light text-ink/70 md:text-2xl"
              >
                Wohin is a radically curated, delightfully social discovery
                engine for the places you actually want to be. We are currently
                building the future of social discovery.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="relative max-w-md"
              >
                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="rounded-3xl bg-matcha/30 p-6 text-lg font-bold text-ink backdrop-blur-md"
                    >
                      ✨ {message}
                    </motion.div>
                  ) : (
                    <form
                      key="form"
                      onSubmit={handleSubmit}
                      className="relative flex flex-col gap-4 sm:block"
                    >
                      <input
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === "loading"}
                        className="w-full rounded-full border-2 border-ink/10 bg-white/50 px-6 py-4 text-lg outline-none transition-all focus:border-peach focus:bg-white sm:py-5 sm:pr-48"
                      />
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="rounded-full bg-peach px-8 py-4 text-lg font-bold text-ink shadow-[0_10px_40px_rgba(255,183,178,0.4)] transition-all duration-300 hover:bg-ink hover:text-cream disabled:opacity-50 sm:absolute sm:top-2 sm:right-2 sm:py-3.5 sm:px-6 sm:text-base"
                      >
                        {status === "loading" ? "Joining..." : "Join Waitlist"}
                      </button>
                    </form>
                  )}
                </AnimatePresence>
                {status === "error" && (
                  <p className="mt-2 pl-4 text-sm font-semibold text-red-500">
                    {message}
                  </p>
                )}
              </motion.div>
            </div>

            <div className="relative mt-12 h-[400px] w-full md:mt-0 md:w-1/2">
              {vibes.map((vibe, i) => (
                <motion.div
                  key={vibe.name}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: vibe.delay + 0.6 }}
                  className={`absolute h-48 w-48 ${vibe.color} ${vibe.rotate} bg-opacity-90 flex transform cursor-default flex-col justify-between rounded-3xl p-6 shadow-2xl backdrop-blur-sm transition-transform duration-500 hover:scale-105 hover:rotate-0 md:h-64 md:w-64`}
                  style={{
                    top: `${i * 15}%`,
                    left: `${i * 20}%`,
                    zIndex: 10 - i,
                  }}
                >
                  <div className="text-4xl md:text-6xl">{vibe.emoji}</div>
                  <div className="font-display text-2xl font-bold md:text-3xl">
                    {vibe.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1 }}
            className="border-t-2 border-ink/5 py-24"
          >
            <h2 className="mb-16 text-center font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              The Radiant Curator
            </h2>

            <div className="grid gap-12 md:grid-cols-3">
              <div className="group rounded-[2.5rem] bg-white/40 p-10 shadow-[0_15px_45px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-colors duration-500 hover:bg-white/60">
                <div className="mb-8 flex h-16 w-16 transform items-center justify-center rounded-2xl bg-sunny text-3xl shadow-lg transition-transform group-hover:rotate-12">
                  ☕
                </div>
                <h3 className="mb-4 font-display text-2xl font-bold">
                  Activity First
                </h3>
                <p className="leading-relaxed text-ink/70">
                  Don't search for "coffee shops". Search for "study spots".
                  Wohin curates places based on the intention behind your visit.
                </p>
              </div>

              <div className="group rounded-[2.5rem] bg-white/40 p-10 shadow-[0_15px_45px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-colors duration-500 hover:bg-white/60">
                <div className="mb-8 flex h-16 w-16 transform items-center justify-center rounded-2xl bg-matcha text-3xl shadow-lg transition-transform group-hover:-rotate-12">
                  ✨
                </div>
                <h3 className="mb-4 font-display text-2xl font-bold">
                  The Vibe Check
                </h3>
                <p className="leading-relaxed text-ink/70">
                  Drop playful, animated vibe checks to let others know if a
                  spot is truly matching the energy. Contribute to the pulse of
                  the community.
                </p>
              </div>

              <div className="group rounded-[2.5rem] bg-white/40 p-10 shadow-[0_15px_45px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-colors duration-500 hover:bg-white/60">
                <div className="mb-8 flex h-16 w-16 transform items-center justify-center rounded-2xl bg-peach text-3xl shadow-lg transition-transform group-hover:scale-110">
                  📱
                </div>
                <h3 className="mb-4 font-display text-2xl font-bold">
                  Native Feel
                </h3>
                <p className="leading-relaxed text-ink/70">
                  A Progressive Web App that feels right at home on your device.
                  Fast, installable, and ready to go wherever you are.
                </p>
              </div>
            </div>
          </motion.section>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
