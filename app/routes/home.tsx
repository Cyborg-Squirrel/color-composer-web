import { Navbar } from "~/layouts/Navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Color Composer" },
    { name: "description", content: "Welcome to Color Composer!" },
  ];
}

export default function Home() {
  return (
    <div className="wrapper">
      <Navbar navbarTitle="Color Composer" selectedNavbarItem="Clients" />
    </div>
  );
}
