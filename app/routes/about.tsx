import { Navbar } from "~/components/Navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About | Color Composer" },
    { name: "description", content: "About" },
  ];
}

export default function About() {
  return <Navbar title="Color Composer" selectedNavItemText="about" />;
}
