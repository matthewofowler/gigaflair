import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("shifts", "routes/shifts.tsx"),
    route("contact", "routes/contact.tsx"),
] satisfies RouteConfig;
