import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Administrator Sign In",
};

interface LoginPageProps {
  searchParams: Promise<{ from?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { from } = await searchParams;
  const redirectTo = from && from.startsWith("/admin") ? from : "/admin";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Image src="/umu.png" alt="United Methodist University crest" width={56} height={56} className="size-14" />
          <h1 className="mt-4 font-heading text-xl font-semibold tracking-tight text-foreground">
            Administrator Sign In
          </h1>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <LoginForm redirectTo={redirectTo} />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to the public site
          </Link>
        </div>
      </div>
    </div>
  );
}
