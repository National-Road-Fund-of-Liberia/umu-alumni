import Image from "next/image";
import Link from "next/link";

export function SiteLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Image
        src="/umu.png"
        alt="United Methodist University crest"
        width={36}
        height={36}
        className="size-9 shrink-0 object-contain"
        priority
      />
      <span className="flex flex-col leading-tight">
        <span className="font-heading text-base font-semibold tracking-tight text-foreground">
          UMU Alumni
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Association
        </span>
      </span>
    </Link>
  );
}
