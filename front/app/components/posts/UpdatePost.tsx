import { useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import axiosService from "~/lib/axios";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import type { PostProps } from "./Post";

type Props = {
  post: PostProps;
  refresh: () => void;
};

export default function UpdatePost({ post, refresh }: Props) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState(post.body);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    axiosService
      .patch(`/api/post/${post.id}/`, { body })
      .then(() => {
        toast.success("Post actualizado");
        setOpen(false);
        refresh();
      })
      .catch(() => toast.error("Error al actualizar el post"))
      .finally(() => setIsPending(false));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button type="submit" disabled={!body.trim() || isPending}>
            {isPending ? "Guardando..." : "Guardar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
