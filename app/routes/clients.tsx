import { Navbar } from "~/components/Navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Clients | Color Composer" },
    { name: "description", content: "Clients" },
  ];
}

export default function Clients() {
  return <Navbar title="Color Composer" selectedNavItemText="clients" />;
}
