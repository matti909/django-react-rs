import { Link } from "react-router";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Feed" },
    { name: "description", content: "Tu feed de publicaciones" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <h1 className="text-lg font-semibold">Feed</h1>
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        {/* New post */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="¿Qué estás pensando?"
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-end">
                  <Button size="sm">Publicar</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Hace 2 horas</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Este es un post de ejemplo en el feed. Cuando el backend esté
              conectado, los posts reales aparecerán aquí.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>MR</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Maria Rodriguez</p>
                <p className="text-xs text-muted-foreground">Hace 5 horas</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Otro post de ejemplo para mostrar cómo se ve el feed con múltiples
              publicaciones.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
