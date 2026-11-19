"use client";

import {
  ArrowLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  Package,
  Pin,
  Send,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchChatMessagesAction,
  fetchChatsAction,
  sendChatMessageAction,
  clearChatMessagesAction,
} from "@/lib/actions/chats";
import { isMainAdminAction } from "@/lib/actions/admin";
import { useSession } from "@/lib/auth-client";
import type { ChatConversation, ChatMessage } from "@/lib/types";
import { UNREAD_CHANGED_EVENT } from "@/lib/useUnreadMessages";

const POLL_MS = 5000;

// Opening a thread marks it read server-side; tell the navbar/dashboard badges
// to refresh so the count drops immediately.
function notifyUnreadChanged() {
  window.dispatchEvent(new Event(UNREAD_CHANGED_EVENT));
}

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "now";
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** How long a message has left before it self-destructs. */
function expiresIn(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "expired";
  const days = Math.floor(ms / 86_400_000);
  if (days >= 1) return `${days}d left`;
  const hours = Math.floor(ms / 3_600_000);
  if (hours >= 1) return `${hours}h left`;
  return "<1h left";
}

function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPanel({ ttlNote }: { ttlNote?: string } = {}) {
  const { data: session } = useSession();
  const myRole = session?.user?.role;

  const [isMainAdmin, setIsMainAdmin] = useState(false);
  useEffect(() => {
    if (myRole !== "admin") {
      setIsMainAdmin(false);
      return;
    }
    let active = true;
    isMainAdminAction()
      .then((value) => {
        if (active) setIsMainAdmin(value);
      })
      .catch(() => {
        if (active) setIsMainAdmin(false);
      });
    return () => {
      active = false;
    };
  }, [myRole]);

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const loadList = useCallback(async () => {
    try {
      const data = await fetchChatsAction();
      setConversations(data);
      return data;
    } catch {
      return null;
    } finally {
      setLoadingList(false);
    }
  }, []);

  // Deep link from the product page: /buyer/chats?c=<conversationId>
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("c");
    if (fromUrl) setSelectedId(fromUrl);
    loadList();
  }, [loadList]);

  // Load + mark-read when a thread is opened.
  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    let active = true;
    setLoadingThread(true);
    fetchChatMessagesAction(selectedId)
      .then((data) => {
        if (!active) return;
        setMessages(data);
        setError("");
        notifyUnreadChanged();
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Could not load messages");
      })
      .finally(() => {
        if (active) setLoadingThread(false);
      });
    return () => {
      active = false;
    };
  }, [selectedId]);

  // Poll while a thread is open so replies show up without a refresh.
  useEffect(() => {
    if (!selectedId) return;
    const timer = setInterval(() => {
      fetchChatMessagesAction(selectedId)
        .then((data) => {
          setMessages(data);
          notifyUnreadChanged();
        })
        .catch(() => {});
      fetchChatsAction()
        .then(setConversations)
        .catch(() => {});
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [selectedId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-scroll whenever a message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!selectedId || !body || sending) return;
    setSending(true);
    setError("");
    try {
      const sent = await sendChatMessageAction(selectedId, body);
      setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]));
      setDraft("");
      await loadList();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not send that message");
    } finally {
      setSending(false);
    }
  }

  const active = conversations.find((c) => c.id === selectedId) ?? null;

  async function handleClearChat() {
    if (!selectedId || !active?.isInternal) return;
    if (!confirm("Clear all messages in this channel? This cannot be undone.")) return;
    setError("");
    try {
      await clearChatMessagesAction(selectedId);
      setMessages([]);
      await loadList();
      notifyUnreadChanged();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not clear messages");
    }
  }
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="w-full max-w-full overflow-hidden rounded-3xl border border-border/70 bg-card/80 backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/20 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
            <MessageCircle className="size-4" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
              Messages
            </p>
            <p className="text-sm font-bold text-foreground">
              {conversations.length} conversation{conversations.length === 1 ? "" : "s"}
              {totalUnread > 0 && (
                <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                  {totalUnread} new
                </span>
              )}
            </p>
          </div>
        </div>
        <p className="flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1.5 text-[11px] font-semibold text-secondary">
          <Clock className="size-3.5" />
          {ttlNote ?? "Messages self-destruct after 3 days"}
        </p>
      </div>

      <div className="grid min-h-[60vh] grid-cols-1 lg:grid-cols-5">
        {/* Conversation list */}
        <div
          className={`border-border/60 lg:col-span-2 lg:border-r ${active ? "hidden lg:block" : "block"}`}
        >
          {loadingList ? (
            <div className="space-y-3 p-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-muted/60" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <span className="grid size-12 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                <MessageCircle className="size-5" />
              </span>
              <p className="mt-4 text-sm font-bold text-foreground">No messages yet</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Open any listing and tap <span className="font-semibold">Message Seller</span> to
                start a conversation — buyers, sellers and admins can all do this.
              </p>
              <Link
                href="/products"
                className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                Browse listings
              </Link>
            </div>
          ) : (
            <ul className="max-h-[60vh] divide-y divide-border/50 overflow-y-auto">
              {conversations.map((c) => {
                const isSelected = c.id === selectedId;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition ${
                        isSelected ? "bg-primary/10" : "hover:bg-muted/40"
                      }`}
                    >
                      <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {c.counterpartAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={c.counterpartAvatar}
                            alt={c.counterpartName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          (c.counterpartName?.[0] ?? "U").toUpperCase()
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-bold text-foreground">
                            {c.isInternal && <Pin className="mr-1 inline size-3 text-primary" />}
                            {c.counterpartName}
                          </span>
                          <span className="shrink-0 text-[10px] font-semibold text-muted-foreground">
                            {timeAgo(c.lastMessageAt)}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] font-medium text-primary/80">
                          {c.isInternal
                            ? `Pinned · admins only · ${c.messageCount ?? 0} message${(c.messageCount ?? 0) === 1 ? "" : "s"}`
                            : (c.productTitle ?? "Listing")}
                        </span>
                        <span className="mt-1 flex items-center justify-between gap-2">
                          <span className="truncate text-xs text-muted-foreground">
                            {c.lastMessage ?? "Say hello…"}
                          </span>
                          {c.unreadCount > 0 && (
                            <span className="grid size-4 shrink-0 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                              {c.unreadCount}
                            </span>
                          )}
                        </span>
                      </span>
                      <ChevronRight className="mt-1 size-3.5 shrink-0 text-muted-foreground" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Thread */}
        <div className={`lg:col-span-3 ${active ? "block" : "hidden lg:block"}`}>
          {!active ? (
            <div className="flex h-full min-h-[50vh] flex-col items-center justify-center px-6 text-center">
              <span className="grid size-12 place-items-center rounded-2xl border border-border/70 bg-muted/40 text-muted-foreground">
                <UserRound className="size-5" />
              </span>
              <p className="mt-4 text-sm font-bold text-foreground">Select a conversation</p>
              <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
                {myRole === "buyer"
                  ? "Reply with the seller and agree on a price. Your chat clears itself 3 days after each message."
                  : "Open any listing and tap Message Seller, or reply to someone who messaged you. Messages clear themselves 3 days after they are sent."}
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-[50vh] flex-col">
              {/* Thread header */}
              <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Back to conversations"
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-border/70 text-muted-foreground transition hover:text-foreground lg:hidden"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {active.counterpartAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={active.counterpartAvatar}
                      alt={active.counterpartName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (active.counterpartName?.[0] ?? "U").toUpperCase()
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">
                    {active.counterpartName}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {active.counterpartRole === "admin"
                      ? active.isInternal
                        ? `Pinned admin channel · ${active.messageCount ?? 0} message${(active.messageCount ?? 0) === 1 ? "" : "s"}`
                        : "CRE8MARKET store"
                      : active.counterpartRole === "buyer"
                        ? "Buyer"
                        : "Seller"}
                  </p>
                </div>
                {active.isInternal && isMainAdmin && (
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-[11px] font-bold text-destructive transition hover:border-destructive/40"
                    title="Clear all messages in this channel"
                  >
                    <Trash2 className="size-3.5" />
                    Clear
                  </button>
                )}
                {active.productSlug && (
                  <Link
                    href={`/products/${active.productSlug}`}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-[11px] font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
                  >
                    <Package className="size-3.5" />
                    <span className="hidden max-w-[9rem] truncate sm:inline">
                      {active.productTitle}
                    </span>
                    <span className="sm:hidden">Listing</span>
                  </Link>
                )}
              </div>

              {/* Messages */}
              <div className="max-h-[60vh] space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
                {loadingThread && messages.length === 0 ? (
                  <div className="space-y-3">
                    {[0, 1].map((i) => (
                      <div key={i} className="h-10 w-2/3 animate-pulse rounded-2xl bg-muted/60" />
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <ShieldCheck className="size-6 text-secondary" />
                    <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted-foreground">
                      {active.isInternal
                        ? "This is the pinned admin channel. Messages here disappear 2 weeks after they are sent."
                        : "This conversation is empty. Messages here disappear 3 days after they are sent, then the chat clears itself."}
                    </p>
                  </div>
                ) : (
                  messages.map((m) => {
                    // Compare sender ids, not roles: two sellers in one thread
                    // share the "user" role but are different people.
                    const mine = !!session?.user?.id && m.senderId === session.user.id;
                    const senderInitial = (m.senderName?.[0] ?? "U").toUpperCase();
                    return (
                      <div
                        key={m.id}
                        className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
                      >
                        {!mine && (
                          <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            {m.senderAvatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={m.senderAvatar}
                                alt={m.senderName ?? "Sender"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              senderInitial
                            )}
                          </span>
                        )}
                        <div className="max-w-[85%] sm:max-w-[70%]">
                          {!mine && (
                            <p className="mb-1 ml-1 text-[11px] font-bold text-primary/80">
                              {m.senderName ?? (m.senderRole === "admin" ? "Admin" : "Seller")}
                            </p>
                          )}
                          <div
                            className={`rounded-2xl px-3.5 py-2.5 ${
                              mine
                                ? "rounded-br-md bg-primary text-primary-foreground"
                                : "rounded-bl-md border border-border/60 bg-muted/40 text-foreground"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                              {m.body}
                            </p>
                            <p
                              className={`mt-1.5 flex items-center justify-end gap-2 text-[10px] font-semibold ${
                                mine ? "text-primary-foreground/75" : "text-muted-foreground"
                              }`}
                            >
                              {clockTime(m.createdAt)}
                              <span
                                className={`inline-flex items-center gap-1 ${
                                  mine ? "text-primary-foreground/75" : "text-secondary"
                                }`}
                              >
                                <Clock className="size-3" />
                                {expiresIn(m.expiresAt)}
                              </span>
                            </p>
                          </div>
                        </div>
                        {mine && (
                          <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            {m.senderAvatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={m.senderAvatar}
                                alt={m.senderName ?? "You"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              senderInitial
                            )}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {error && (
                <p className="mx-4 mb-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
                  {error}
                </p>
              )}

              {/* Composer */}
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 border-t border-border/60 bg-muted/20 px-4 py-3"
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={2000}
                  placeholder="Type a message…"
                  aria-label="Message"
                  className="h-11 flex-1 rounded-full border border-border/70 bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  aria-label="Send message"
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
