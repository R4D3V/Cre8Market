"use server";

import { auth } from "@/lib/auth";
import {
  CHAT_MESSAGE_TTL_DAYS,
  type ChatViewer,
  clearConversationMessages,
  ensureAdminInternalChat,
  findOrCreateConversation,
  getAdminUsers,
  getConversationForViewer,
  getConversationsForViewer,
  getMessagesForConversation,
  getProductById,
  getUnreadMessageCountForViewer,
  insertChatMessage,
  logAudit,
  markConversationRead,
  purgeExpiredChatMessages,
} from "@/lib/db/queries";
import type { ChatConversation, ChatMessage } from "@/lib/types";

async function currentViewer(): Promise<ChatViewer> {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user?.id || (role !== "buyer" && role !== "user" && role !== "admin")) {
    throw new Error("Not authorized");
  }
  return { role, id: session.user.id } as ChatViewer;
}

// Any signed-in party can start a conversation from a listing. The person on
// the other side (the listing owner, or the store for admin listings) replies
// from their own chat panel.
export async function startChatAction(input: {
  productId: string;
  message: string;
}): Promise<{ conversationId: string }> {
  const viewer = await currentViewer();

  const body = input.message.trim();
  if (!body) throw new Error("Write a message first");
  if (body.length > 2000) throw new Error("Message is too long");

  const product = await getProductById(input.productId);
  if (!product) throw new Error("This listing is no longer available");

  if (product.user_id && product.user_id === viewer.id) {
    throw new Error("This is your own listing, so there is nobody to message.");
  }
  if (!product.user_id && viewer.role === "admin") {
    throw new Error("This listing belongs to the store, so there is no seller to message.");
  }

  // Admin/store listings have no owning user — every admin sees those threads.
  const counterparty = product.user_id
    ? ({ role: "user", id: product.user_id } as const)
    : ({ role: "admin", id: "store" } as const);

  const conversationId = await findOrCreateConversation({
    initiator: viewer,
    productId: product.id,
    counterpartyRole: counterparty.role,
    counterpartyId: counterparty.id,
    productTitle: product.title,
    productSlug: product.slug,
    productImage: product.images?.[0] ?? null,
  });

  await insertChatMessage({
    conversationId,
    senderRole: viewer.role,
    senderId: viewer.id,
    body,
  });

  await logAudit({
    actorId: viewer.id,
    actorRole: viewer.role,
    action: "chat.start",
    targetType: "product",
    targetId: product.id,
    metadata: { conversationId, counterparty: counterparty.id },
  });

  return { conversationId };
}

export async function fetchChatsAction(): Promise<ChatConversation[]> {
  const viewer = await currentViewer();
  // Self-destruct runs on every read, so expired messages are gone before the
  // list is built and a thread with nothing left disappears on its own.
  await purgeExpiredChatMessages();
  // Admins get a single shared, pinned thread for internal communication.
  // It is created lazily on the first visit so the table stays clean until
  // someone actually uses the admin chats page.
  if (viewer.role === "admin") {
    await ensureAdminInternalChat();
  }
  return getConversationsForViewer(viewer);
}

export async function fetchChatMessagesAction(conversationId: string): Promise<ChatMessage[]> {
  const viewer = await currentViewer();
  await purgeExpiredChatMessages();

  const conversation = await getConversationForViewer(conversationId, viewer);
  if (!conversation) throw new Error("Not authorized");

  await markConversationRead(conversationId, viewer);
  return getMessagesForConversation(conversationId);
}

export async function sendChatMessageAction(
  conversationId: string,
  message: string,
): Promise<ChatMessage> {
  const viewer = await currentViewer();
  const body = message.trim();
  if (!body) throw new Error("Write a message first");
  if (body.length > 2000) throw new Error("Message is too long");

  const conversation = await getConversationForViewer(conversationId, viewer);
  if (!conversation) throw new Error("Not authorized");

  return insertChatMessage({
    conversationId,
    senderRole: viewer.role,
    senderId: viewer.id,
    body,
  });
}

// Admins can empty the pinned CRE8-MARKET thread without deleting the
// conversation itself, so the channel stays available for future messages.
export async function clearChatMessagesAction(conversationId: string): Promise<void> {
  const viewer = await currentViewer();
  if (viewer.role !== "admin") throw new Error("Not authorized");

  const admins = await getAdminUsers();
  if (admins.length === 0 || admins[0].id !== viewer.id) {
    throw new Error("Only the main admin can clear this channel");
  }

  const conversation = await getConversationForViewer(conversationId, viewer);
  if (!conversation || !conversation.isInternal) {
    throw new Error("Only the pinned admin channel can be cleared");
  }

  await clearConversationMessages(conversationId);
  await logAudit({
    actorId: viewer.id,
    actorRole: "admin",
    action: "chat.clear",
    targetType: "conversation",
    targetId: conversationId,
    metadata: { internal: true },
  });
}

// Unread badge count for the navbar, bottom nav and dashboards. Expired
// messages are purged first so the count can never include self-destructed
// messages.
export async function fetchUnreadMessageCountAction(): Promise<number> {
  const viewer = await currentViewer();
  await purgeExpiredChatMessages();
  return getUnreadMessageCountForViewer(viewer);
}
