import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("clients", "routes/clients.tsx"),
    route("strips", "routes/strips.tsx"),
    route("effects", "routes/effects.tsx"),
    route("palettes", "routes/palettes.tsx"),
    route("triggers", "routes/triggers.tsx"),
    route("settings", "routes/settings.tsx"),
    route("about", "routes/about.tsx"),
] satisfies RouteConfig;
