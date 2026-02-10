import { Link, useParams } from "react-router";
import useSWR from "swr";
import { fetcher } from "~/lib/axios";
import { getUser } from "~/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import Post from "~/components/posts/Post";

export function meta() {
  return [
    { title: "Perfil" },
    { name: "description", content: "Perfil de usuario" },
  ];
}

export default function Profile() {
  const { profileId } = useParams();
  const currentUser = getUser();

  const { data: user } = useSWR(`/api/user/${profileId}/`, fetcher);
  const { data: posts, mutate } = useSWR(
    `/api/post/?author__public_id=${profileId}`,
    fetcher,
    { refreshInterval: 30000 },
  );

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "U";
  const isOwnProfile = currentUser?.id === profileId;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-4 px-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              &larr; Volver
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Perfil</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-20 w-20">
                {user?.avatar && <AvatarImage src={user.avatar} />}
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  {user?.first_name} {user?.last_name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  @{user?.username}
                </p>
                {user?.bio && (
                  <p className="mt-2 text-sm">{user.bio}</p>
                )}
              </div>
              {isOwnProfile && (
                <Link to={`/profile/${profileId}/edit`}>
                  <Button variant="outline" size="sm">
                    Editar perfil
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {posts?.results?.map((post: any) => (
          <Post key={post.id} post={post} refresh={mutate} />
        ))}
      </main>
    </div>
  );
}
