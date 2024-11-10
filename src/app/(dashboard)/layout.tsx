import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/journal", label: "Journal" },
  { href: "/history", label: "History" },
];
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-screen h-screen">
      <aside className="absolute w-[200px] top-0 left-0 h-full border-r border-black/10">
        <div>Mood</div>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block p-4 border-b border-black/10"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <div className="ml-[200px] h-full">
        <header className="h-[60px] border-b border-black/10">
          <div className="flex items-center justify-end w-full h-full px-6">
            <UserButton />
          </div>
        </header>
        <div className="h-[calc(100vh-60px)] bg-zinc-100">{children}</div>
      </div>
    </div>
  );
}
