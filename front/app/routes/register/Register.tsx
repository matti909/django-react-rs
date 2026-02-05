import { useActionState } from "react";
import { Link, useNavigate } from "react-router";
import axiosService from "~/lib/axios";
import { setTokens, setUser } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type RegisterState = {
  error?: string;
  success?: boolean;
};

const initialState: RegisterState = {};

export function meta() {
  return [
    { title: "Registro" },
    { name: "description", content: "Crea tu cuenta" },
  ];
}

export default function Register() {
  const navigate = useNavigate();

  async function registerAction(
    _prev: RegisterState,
    formData: FormData,
  ): Promise<RegisterState> {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const bio = (formData.get("bio") as string) ?? "";

    if (!username || !email || !password || !first_name || !last_name) {
      return { error: "Todos los campos obligatorios son requeridos" };
    }

    try {
      const res = await axiosService.post("/api/auth/register/", {
        username,
        email,
        password,
        first_name,
        last_name,
        bio,
      });
      setTokens(res.data.access, res.data.refresh);
      setUser(res.data.user);
      navigate("/");
      return { success: true };
    } catch {
      return { error: "Error al crear la cuenta. Intenta con otros datos." };
    }
  }

  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Completa los datos para registrarte
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Juan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Pérez"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
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
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creando cuenta..." : "Registrarse"}
            </Button>
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-primary underline">
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
