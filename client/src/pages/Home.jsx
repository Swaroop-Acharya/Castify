import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { Link } from "react-router-dom";
import { Radio, Users, Share2, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

function Home() {
  return (
    <div className="relative w-full min-h-screen text-white">

      {/* Full-page background */}
      <AnimatedGradientBackground Breathing startingGap={120} positionClassName="fixed inset-0 -z-10" />

      {/* Hero */}
      <div className="relative min-h-screen overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-sm mb-6">
            <Radio className="w-4 h-4" />
            Live studio in your browser
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl">
            Go live in seconds. Stream from your browser.
          </h1>
          <p className="mt-4 text-gray-300 max-w-xl">
            Castify is a minimal, fast streaming studio. No installs. No clutter. Just hit live.
          </p>
          <div className="mt-8">
            <Link
              to="/coming-soon"
              className="inline-flex items-center rounded-md bg-white text-black px-5 py-3 font-medium hover:opacity-90"
            >
              Get started
            </Link>
          </div>

          {/* Scroll cue */}
          <motion.a
            href="#features"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/10 hover:bg-white/20"
            initial={{ y: 0, opacity: 0.9 }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-5 h-5" />
          </motion.a>
        </div>
      </div>

      {/* Features (scroll) */}
      <section id="features" className="relative z-10 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Everything you need to go live</h2>
          <p className="mt-2 text-gray-400">Simple, powerful tools that work anywhere.</p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop"
                alt="Guests joining remotely"
                className="h-48 w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                loading="lazy"
              />
              <div className="p-6">
                <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-2 py-1 text-sm mb-3">
                  <Users className="w-4 h-4" />
                  Remote guests
                </div>
                <h3 className="text-xl font-medium">Go live or record podcasts with remote guests</h3>
                <p className="mt-2 text-gray-300">
                  It's easy for guests to join from their browser or phone in a few clicks. No software downloads.
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop"
                alt="Multistreaming to platforms"
                className="h-48 w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                loading="lazy"
              />
              <div className="p-6">
                <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-2 py-1 text-sm mb-3">
                  <Share2 className="w-4 h-4" />
                  Multistream
                </div>
                <h3 className="text-xl font-medium">Multistream to all platforms at once</h3>
                <p className="mt-2 text-gray-300">
                  Stream to Facebook, YouTube, Instagram, LinkedIn, X (Twitter), Twitch, and more. Make your audience feel special by featuring their comments on screen.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 px-6 py-12">
        <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/40">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-lg font-semibold tracking-tight">Castify</div>
              <p className="mt-1 text-sm text-gray-300">Go live from your browser. No installs.</p>
            </div>
            <nav className="flex items-center gap-6 text-sm text-gray-300">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Contact</a>
              <Link to="/studio" className="inline-flex items-center rounded-md bg-white text-black px-4 py-2 font-medium hover:opacity-90">Open Studio</Link>
            </nav>
          </div>
          <div className="border-t border-white/10 px-6 md:px-8 py-4 text-xs text-gray-400 flex items-center justify-between">
            <span>© {new Date().getFullYear()} Castify</span>
            <a
              href="https://github.com/Swaroop-Acharya"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              Built by Swaroop
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;


