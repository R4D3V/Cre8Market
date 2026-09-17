import Link from "next/link";

export default function NewsletterSignup() {
  return (
    <section className="border-t border-border bg-card">
      <div className="container flex flex-col items-start justify-between gap-y-4 py-10 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-h5 sm:text-h4 font-heading">Join Our Newsletter</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Get the latest drops, deals and stories straight to your inbox.
          </p>
        </div>
        <Link
          href="/login"
          className="button bg-primary px-6 py-3 text-sm text-primary-foreground hover:bg-background hover:text-primary"
        >
          Login to Subscribe
        </Link>
      </div>
    </section>
  );
}