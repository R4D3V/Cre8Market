import { AdminPanel } from "@/components/admin/AdminPanel";
import ChatPanel from "@/components/chat/ChatPanel";

// Shared admin inbox: threads against store listings and admin-started chats.
export default function AdminChatsPage() {
  return (
    <AdminPanel
      title="Chats"
      description="Threads with buyers and sellers, including chats you start from a listing. The pinned CRE8-MARKET thread is for admin-to-admin communication; its messages last 2 weeks, other threads self-destruct after 3 days."
    >
      <ChatPanel ttlNote="Most messages self-destruct after 3 days; CRE8-MARKET keeps them for 2 weeks" />
    </AdminPanel>
  );
}
