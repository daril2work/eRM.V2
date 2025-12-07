import { getUserById } from "@/app/actions/admin";
import { UserEditForm } from "@/components/modules/admin/UserEditForm";
import { notFound } from "next/navigation";

export default async function EditUserPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const user = await getUserById(userId);

    if (!user) return notFound();

    return (
        <div className="max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Edit Pengguna</h1>
            <UserEditForm user={user} />
        </div>
    );
}
