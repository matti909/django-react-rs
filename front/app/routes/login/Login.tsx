import { useActionState } from "react";
import { Link, useNavigate } from "react-router";
import axiosService from "~/lib/axios";
import { setTokens, setUser } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type LoginState = {
  error?: string;
  success?: boolean;
};

const initialState: LoginState = {};

export function meta() {
  return [
    { title: "Iniciar Sesión" },
    { name: "description", content: "Inicia sesión en tu cuenta" },
  ];
}

export default function Login() {
  const navigate = useNavigate();

  async function loginAction(
    _prev: LoginState,
    formData: FormData,
  ): Promise<LoginState> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email y contraseña son requeridos" };
    }

    try {
      const res = await axiosService.post("/api/auth/login/", {
        email,
        password,
      });
      setTokens(res.data.access, res.data.refresh);
      setUser(res.data.user);
      navigate("/");
      return { success: true };
    } catch {
      return { error: "Credenciales inválidas" };
    }
  }

  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Ingresando..." : "Ingresar"}
            </Button>
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-primary underline">
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
