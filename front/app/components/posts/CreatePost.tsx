import { useState } from "react";
import { toast } from "sonner";
import axiosService from "~/lib/axios";
import { getUser } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

type Props = {
  refresh: () => void;
};

export default function CreatePost({ refresh }: Props) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [isPending, setIsPending] = useState(false);
  const user = getUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    axiosService
      .post("/api/post/", { author: user?.id, body })
      .then(() => {
        toast.success("Post creado");
        setOpen(false);
        setBody("");
        refresh();
      })
      .catch(() => toast.error("Error al crear el post"))
      .finally(() => setIsPending(false));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Input
          readOnly
          placeholder="¿Qué estás pensando?"
          className="cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Escribe algo..."
            rows={3}
            className="resize-none"
          />
          <Button type="submit" disabled={!body.trim() || isPending}>
            {isPending ? "Publicando..." : "Publicar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
