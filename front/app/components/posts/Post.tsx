import { useState } from "react";
import { Link } from "react-router";
import { format } from "timeago.js";
import { toast } from "sonner";
import { Heart, MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";
import axiosService from "~/lib/axios";
import { getUser } from "~/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import UpdatePost from "./UpdatePost";

export type PostProps = {
  id: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  body: string;
  created: string;
  edited: boolean;
  likes_count: number;
  comments_count: number;
  liked: boolean;
};

type Props = {
  post: PostProps;
  isSinglePost?: boolean;
  refresh: () => void;
};

export default function Post({ post, isSinglePost, refresh }: Props) {
  const user = getUser();

  const handleDelete = () => {
    axiosService
      .delete(`/api/post/${post.id}/`)
      .then(() => {
        toast.success("Post eliminado");
        refresh();
      })
      .catch(() => toast.error("Error al eliminar el post"));
  };

  const handleLikeClick = (action: string) => {
    axiosService
      .post(`/api/post/${post.id}/${action}/`)
      .then(() => refresh())
      .catch(() => toast.error("Error al procesar la acción"));
  };

  const initials = post.author.username.slice(0, 2).toUpperCase();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Link
            to={`/profile/${post.author.id}`}
            className="flex items-center gap-3"
          >
            <Avatar className="h-10 w-10">
              {post.author.avatar && (
                <AvatarImage src={post.author.avatar} />
              )}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.username}</p>
              <p className="text-xs text-muted-foreground">
                {format(post.created)}
                {post.edited && " · editado"}
              </p>
            </div>
          </Link>
          {user?.username === post.author.username && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <UpdatePost post={post} refresh={refresh} />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{post.body}</p>
      </CardContent>
      <CardFooter className="flex items-center gap-6 border-t pt-3">
        <button
          onClick={() =>
            handleLikeClick(post.liked ? "remove_like" : "like")
          }
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${post.liked ? "fill-red-500 text-red-500" : ""}`}
          />
          <span>{post.likes_count}</span>
        </button>
        {!isSinglePost && (
          <Link
            to={`/post/${post.id}/`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments_count}</span>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
