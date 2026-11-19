"use client";

import { ArrowUpRight, MessageCircle, UserCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UnreadBadge } from "@/components/chat/UnreadBadge";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { fetchMyProfileAction } from "@/lib/actions/users";
import type { AppUser } from "@/lib/types";
import { useUnreadMessageCount } from "@/lib/useUnreadMessages";

const BUYER_CARDS = [
  {
    href: "/buyer/chats",
    icon: MessageCircle,
    label: "Chats",
    description: "Message sellers about any listing. Chats clear themselves after 3 days.",
  },
  {
    href: "/buyer/profile",
    icon: UserCircle,
    label: "Profile",
    description: "View and edit your name, phone, WhatsApp number and photo.",
  },
];

export default function BuyerHubPage() {
  const [profile, setProfile] = useState<AppUser | null>(null);
  const unreadCount = useUnreadMessageCount(true);

  useEffect(() => {
    let active = true;
    fetchMyProfileAction()
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const firstName = profile?.name?.trim().split(/\s+/)[0];

  return (
    <DashboardPanel
      eyebrow="Buyer hub"
      title={firstName ? `Hi, ${firstName}` : "Your dashboard"}
      description="Browse listings, message sellers and keep track of your conversations."
      action={
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          Browse listings
          <ArrowUpRight className="size-4" />
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {BUYER_CARDS.map(({ href, icon: Icon, label, description }) => (
          <Link
            key={href}
            href={href}
            className="group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_28px_60px_-30px_rgba(0,0,0,0.9)]"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20"
            />
            <span className="relative flex size-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="relative mt-1 font-heading text-lg font-extrabold tracking-tight text-foreground">
              {label}
              {label === "Chats" && (
                <UnreadBadge count={unreadCount} className="relative -top-0.5 ml-2 align-middle" />
              )}
            </h3>
            <p className="relative text-sm text-muted-foreground">{description}</p>
            <span className="relative mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Open {label}
              <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-secondary/25 bg-secondary/10 p-4">
        <MessageCircle className="mt-0.5 size-4 shrink-0 text-secondary" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Open any listing and tap <span className="font-bold text-foreground">Message Seller</span>{" "}
          to start a conversation. Every message self-destructs 3 days after it is sent, then the
          chat clears itself.
        </p>
      </div>
    </DashboardPanel>
  );
}
