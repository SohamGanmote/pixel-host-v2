import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold tracking-tight">404</h1>

      <p className="mt-4 text-muted-foreground">
        Oops, the page you’re looking for doesn’t exist.
      </p>

      <Link
        href="/"
        className="
          mt-6 inline-flex items-center justify-center
          h-11 px-6 rounded-lg
          bg-primary text-primary-foreground
          text-sm font-medium
          transition-colors
          hover:bg-primary/90
          focus:outline-none focus:ring-2 focus:ring-primary/50
        "
      >
        Get me back to home
      </Link>
    </div>
  );
}
