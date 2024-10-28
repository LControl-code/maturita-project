import { TestingUplot } from "@/components/graph/TestingUplot";

export default function Home() {
  return (
    <main className="w-full max-w-5xl mx-auto flex flex-col justify-center flex-grow mt-12">
      <TestingUplot />
    </main>
  );
}