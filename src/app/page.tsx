import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center w-screen h-screen text-white bg-black">
      <div className="w-full max-w-[600px] mx-auto space-y-4">
        <h1 className="text-6xl">The best Journal app, period.</h1>
        <p className="text-2xl text-white/60">
          This is the best app for tracking your mood throughout your life. All
          you have to do is be honest.
        </p>
        <div>
          <Link href="/journal">
            <button className="px-4 py-2 text-xl bg-blue-600 rounded-lg">
              get started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
