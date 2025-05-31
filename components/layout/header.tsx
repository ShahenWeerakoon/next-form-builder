import Link from "next/link";
import { Button } from "../ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-2xl">
            CINEC Feeds
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/forms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              My Forms
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/dashboard/forms/create">Create Form</Link>
          </Button>
          <UserButton />
        </div>
      </div>
    </header>
  );
}