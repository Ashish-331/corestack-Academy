import { redirect } from "next/navigation";
import NotesClient from "@/components/NotesClient";
import { getCurrentUser } from "@/lib/auth";
import { listNotes } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "My notes" };

export default async function NotesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <NotesClient initial={await listNotes(user.id)} />;
}
