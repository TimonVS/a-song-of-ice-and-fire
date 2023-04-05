import { Link } from "@remix-run/react";

export function Header() {
  return (
    <header className="bg-gray-100 mb-8 p-4 text-center border-b border-gray-200">
      <h1 className="font-semibold">
        <Link to="/">A Song of Ice and Fire DB</Link>
      </h1>
    </header>
  );
}
