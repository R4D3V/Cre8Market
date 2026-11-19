"use client";

import { useSession } from "@/lib/auth-client";
import { useUnreadMessageCount } from "@/lib/useUnreadMessages";
import { UnreadBadge } from "@/components/chat/UnreadBadge";

// Server components (e.g. the admin dashboard quick actions) can drop this in
// to show the signed-in admin's unread count without becoming client pages.
export function ChatUnreadBadge({ className = "" }: { className?: string }) {
  const { status } = useSession();
  const count = useUnreadMessageCount(status === "authenticated");
  return <UnreadBadge count={count} className={className} />;
}
