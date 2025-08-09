import { Navbar } from "~/components/Navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | Color Composer" },
    { name: "description", content: "Home" },
  ];
}

export default function Home() {
  return <Navbar title="Color Composer" selectedNavItemText="/" />;
}
