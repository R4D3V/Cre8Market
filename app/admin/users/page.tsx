import { redirect } from "next/navigation";

// The combined users list was split into /admin/sellers and /admin/buyers.
// Keep this route as a redirect so old links and bookmarks still work.
export default function AdminUsersPage() {
  redirect("/admin/sellers");
}
