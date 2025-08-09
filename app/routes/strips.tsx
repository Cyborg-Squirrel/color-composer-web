import { Navbar } from "~/components/Navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LED Strips | Color Composer" },
    { name: "description", content: "LED Strips" },
  ];
}

export default function Strips() {
  return <Navbar title="Color Composer" selectedNavItemText="strips" />;
}
