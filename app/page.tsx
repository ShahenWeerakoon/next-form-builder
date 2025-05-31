import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">CINEC Feeds</h1>
        <div>
            <SignedOut>
              <SignInButton>
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              {/* <UserButton/> */}
            </SignedIn>
        </div>
      </div>
    </header>
    <div className="bg-blue-50 flex-1 main">
      <div className="container mx-auto px-4 py-20 text-center">
       <h2 className="text-4xl md:text-6xl font-bold mb-6">
       STUDENT SATISFACTION SURVEY QUESTIONNAIRE 
       </h2>
       <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
       CINEC Student Satisfaction Form Builder is a customizable tool to gather student feedback and improve campus experiences.
       </p>
          <SignedIn>
            <Button asChild size="lg">
              <Link href="/dashboard/forms/create">Create a Form</Link>
            </Button>
          </SignedIn>
          <SignedOut>
              <SignInButton>
                <Button>Get Started</Button>
              </SignInButton>
          </SignedOut>
    </div>
    </div>
  </div>
  );
}
