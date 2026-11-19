import ChatPanel from "@/components/chat/ChatPanel";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";

export default function BuyerChatsPage() {
  return (
    <DashboardPanel
      eyebrow="Buyer hub"
      title="Chats"
      description="Talk to sellers about any listing. Messages clear themselves 3 days after they are sent."
    >
      <ChatPanel />
    </DashboardPanel>
  );
}
