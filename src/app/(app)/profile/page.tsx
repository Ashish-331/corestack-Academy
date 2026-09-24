import { redirect } from "next/navigation";
import ProfileClient from "@/components/ProfileClient";
import { getCurrentUser } from "@/lib/auth";
import { getUserProfile } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile & Settings" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const data = await getUserProfile(user.id);
  if (!data) redirect("/login");

  return (
    <ProfileClient
      initialData={{
        user: {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          createdAt: data.user.createdAt.toISOString(),
        },
        stats: data.stats,
      }}
    />
  );
}
