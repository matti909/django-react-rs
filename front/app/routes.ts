import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("components/ProtectedRoute.tsx", [
    index("routes/home.tsx"),
  ]),
  route("login", "routes/login/Login.tsx"),
  route("register", "routes/register/Register.tsx"),
] satisfies RouteConfig;
