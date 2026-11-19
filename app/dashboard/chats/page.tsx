import ChatPanel from "@/components/chat/ChatPanel";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";

export default function SellerChatsPage() {
  return (
    <DashboardPanel
      title="Chats"
      description="Message any seller from a listing, or reply to buyers who messaged you. Messages clear themselves 3 days after each message."
    >
      <ChatPanel />
    </DashboardPanel>
  );
}
