// Small unread-message bubble shared by the navbar, mobile nav and dashboards.
export function UnreadBadge({ count, className = "" }: { count: number; className?: string }) {
  if (count <= 0) return null;

  return (
    <span
      className={`inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-white shadow-sm ${className}`}
      aria-hidden="true"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
