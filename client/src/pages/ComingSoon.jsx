import { Link } from "react-router-dom";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { Star, ArrowLeft } from "lucide-react";

function ComingSoon() {
  return (
    <div className="relative min-h-screen text-white">
      <AnimatedGradientBackground Breathing startingGap={120} positionClassName="fixed inset-0 -z-10" />

      <div className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/10 p-8 md:p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-white/10 border border-white/15 grid place-items-center">
            <Star className="w-6 h-6" />
          </div>
          <h1 className="mt-6 text-3xl md:text-5xl font-semibold tracking-tight">We’re building this right now</h1>
          <p className="mt-4 text-gray-200">
            Follow progress and support the project on GitHub. If you like it, please give us a star — it really helps!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/Swaroop-Acharya/Castify"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-white text-black px-5 py-3 font-medium hover:opacity-90"
            >
              View on GitHub
              <span aria-hidden>⭐</span>
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-200 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;


