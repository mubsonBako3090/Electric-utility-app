import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Rigyasa Electric
        </h1>
        <p className="text-xl text-center mb-8">
          Powering Your Future with Reliable Electricity Distribution
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
