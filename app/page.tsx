import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-4">
      <main className="flex flex-col items-center gap-6 text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          BotChain
        </h1>
        <p className="text-lg text-zinc-400">
          Build, test, and deploy multi-tenant RAG and Graph-RAG agents with ease.
          The next generation of AI agent orchestration.
        </p>

        <div className="flex gap-4 mt-8">
          <Link
            href="/login"
            className="rounded-full bg-indigo-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/botchain"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-zinc-700 bg-zinc-900 px-8 py-3 text-lg font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Documentation
          </a>
        </div>
      </main>

      <footer className="absolute bottom-8 text-sm text-zinc-600">
        &copy; {new Date().getFullYear()} BotChain Platform per request.
      </footer>
    </div>
  );
}
