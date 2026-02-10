import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("components/ProtectedRoute.tsx", [
    index("routes/home.tsx"),
    route("post/:postId", "routes/post/SinglePost.tsx"),
    route("profile/:profileId", "routes/profile/Profile.tsx"),
    route("profile/:profileId/edit", "routes/profile/EditProfile.tsx"),
  ]),
  route("login", "routes/login/Login.tsx"),
  route("register", "routes/register/Register.tsx"),
] satisfies RouteConfig;
