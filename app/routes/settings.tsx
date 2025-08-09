import { Navbar } from "~/components/Navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings | Color Composer" },
    { name: "description", content: "Settings" },
  ];
}

export default function Settings() {
  return <Navbar title="Color Composer" selectedNavItemText="settings" />;
}
