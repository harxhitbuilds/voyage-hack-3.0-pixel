import Hero from "@/components/marketing/hero";
import NavBar from "@/components/marketing/navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <Hero />
    </main>
  );
}
