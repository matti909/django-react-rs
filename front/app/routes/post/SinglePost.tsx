import { Link, useParams } from "react-router";
import useSWR from "swr";
import { fetcher } from "~/lib/axios";
import { Button } from "~/components/ui/button";
import Post from "~/components/posts/Post";

export function meta() {
  return [
    { title: "Post" },
    { name: "description", content: "Detalle del post" },
  ];
}

export default function SinglePost() {
  const { postId } = useParams();

  const { data: post, mutate } = useSWR(`/api/post/${postId}/`, fetcher);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-4 px-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              &larr; Volver
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Post</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        {post && <Post post={post} isSinglePost refresh={mutate} />}
      </main>
    </div>
  );
}
