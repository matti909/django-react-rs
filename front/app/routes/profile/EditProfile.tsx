import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export function meta() {
  return [
    { title: "Editar Perfil" },
    { name: "description", content: "Edita tu perfil" },
  ];
}

export default function EditProfile() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    try {
      // TODO: conectar con API
      toast.success("Perfil actualizado");
      navigate(`/profile/${profileId}`);
    } catch {
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-4 px-4">
          <Link to={`/profile/${profileId}`}>
            <Button variant="ghost" size="sm">
              &larr; Volver
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Editar Perfil</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Editar Perfil</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nombre</Label>
                  <Input id="first_name" name="first_name" type="text" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Apellido</Label>
                  <Input id="last_name" name="last_name" type="text" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input id="username" name="username" type="text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Cuéntanos sobre ti..."
                  className="resize-none"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
