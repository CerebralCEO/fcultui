import Link from "next/link";
import AppForm from "@/components/admin/AppForm";
import { requireAdmin } from "@/lib/admin";
import { adminApps } from "@/lib/admin-queries";

export default async function NewAppPage() {
  await requireAdmin();
  const categories = [...new Set((await adminApps()).map((a) => a.category))];
  return (
    <main className="admin-main">
      <header className="admin-head">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/admin">Admin</Link>
          <span>/</span>
          <Link href="/admin/apps">Apps</Link>
          <span>/</span>
          <strong>New app</strong>
        </nav>
        <h1>New app</h1>
        <p className="admin-lead">An app is one card in the gallery and one page at /screens/&lt;slug&gt;. Its screens make up the flow.</p>
      </header>
      <AppForm categories={categories} />
    </main>
  );
}
