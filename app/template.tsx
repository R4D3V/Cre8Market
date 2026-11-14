// Unlike layout.tsx, a template re-mounts on every navigation, which replays
// the fade-in below and makes route changes feel like screen transitions.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
