import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
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

type FieldErrors = Record<string, string>;

function validateField(name: string, value: string): string | null {
  switch (name) {
    case "first_name":
      if (!value.trim()) return "El nombre es requerido";
      return null;
    case "last_name":
      if (!value.trim()) return "El apellido es requerido";
      return null;
    case "username":
      if (!value.trim()) return "El nombre de usuario es requerido";
      if (value.length < 3) return "Mínimo 3 caracteres";
      return null;
    case "email":
      if (!value.trim()) return "El email es requerido";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Email inválido";
      return null;
    case "password":
      if (!value) return "La contraseña es requerida";
      if (value.length < 8) return "Mínimo 8 caracteres";
      return null;
    default:
      return null;
  }
}

export function meta() {
  return [
    { title: "Registro" },
    { name: "description", content: "Crea tu cuenta" },
  ];
}

export default function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isPending, setIsPending] = useState(false);

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => {
      if (error) return { ...prev, [name]: error };
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fields = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    const newErrors: FieldErrors = {};
    for (const name of [
      "first_name",
      "last_name",
      "username",
      "email",
      "password",
    ]) {
      const error = validateField(name, fields[name] ?? "");
      if (error) newErrors[name] = error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsPending(true);
    try {
      const res = await axiosService.post("/api/auth/register/", {
        username: fields.username,
        email: fields.email,
        password: fields.password,
        first_name: fields.first_name,
        last_name: fields.last_name,
        bio: fields.bio ?? "",
      });
      setTokens(res.data.access, res.data.refresh);
      setUser(res.data.user);
      navigate("/");
    } catch (err: any) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        for (const [, value] of Object.entries(data)) {
          const msg = Array.isArray(value) ? value[0] : String(value);
          toast.error(msg);
        }
      } else {
        toast.error("Error al crear la cuenta. Intenta de nuevo.");
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Completa los datos para registrarte
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Juan"
                  onBlur={handleBlur}
                />
                {errors.first_name && (
                  <p className="text-sm text-destructive">{errors.first_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Pérez"
                  onBlur={handleBlur}
                />
                {errors.last_name && (
                  <p className="text-sm text-destructive">{errors.last_name}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                onBlur={handleBlur}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                onBlur={handleBlur}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                onBlur={handleBlur}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
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
