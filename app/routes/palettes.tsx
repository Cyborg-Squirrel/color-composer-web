import { Navbar } from "~/components/Navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Palettes | Color Composer" },
    { name: "description", content: "Palettes" },
  ];
}

export default function Palettes() {
  return <Navbar title="Color Composer" selectedNavItemText="palettes" />;
}
