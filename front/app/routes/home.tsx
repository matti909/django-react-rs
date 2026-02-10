import useSWR from "swr";
import { Link } from "react-router";
import { fetcher } from "~/lib/axios";
import { getUser } from "~/lib/auth";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import Post from "~/components/posts/Post";
import CreatePost from "~/components/posts/CreatePost";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Feed" },
    { name: "description", content: "Tu feed de publicaciones" },
  ];
}

export default function Home() {
  const user = getUser();
  const { data, mutate } = useSWR("/api/post/", fetcher, {
    refreshInterval: 30000,
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <h1 className="text-lg font-semibold">Feed</h1>
          <Link to={user ? `/profile/${user.id}` : "#"}>
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user?.username?.slice(0, 2).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {user?.username?.slice(0, 2).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CreatePost refresh={mutate} />
              </div>
            </div>
          </CardContent>
        </Card>

        {data?.results?.map((post: any) => (
          <Post key={post.id} post={post} refresh={mutate} />
        ))}
      </main>
    </div>
  );
}
