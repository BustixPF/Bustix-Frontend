import Sidebar from "@/components/client-dashboard/Sidebar";
import RequireAuth from "@/components/auth/RequiereAuth";
import EditProfileForm from "@/components/forms/profile/EditProfileForm";

export default function EditProfilePage() {
  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
          <h1 className="font-display text-3xl text-foreground">Editar perfil</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Actualiza tus datos personales.
          </p>
          <div className="mt-6 border-t border-border" />

          <EditProfileForm />
        </main>
      </div>
    </RequireAuth>
  );
}
