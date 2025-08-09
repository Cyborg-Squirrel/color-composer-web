import { Navbar } from "~/components/Navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Effects | Color Composer" },
    { name: "description", content: "Effects" },
  ];
}

export default function Effects() {
  return <Navbar title="Color Composer" selectedNavItemText="effects" />;
}
