import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
      <h1 className="mb-4 text-5xl font-bold gradient-title sm:text-6xl">404</h1>
      <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">Page Not Found</h2>
      <p className="mb-8 max-w-md text-sm text-gray-400 sm:text-base">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Link href="/">
        <Button className="w-full sm:w-auto">Return Home</Button>
      </Link>
    </div>
  );
}
