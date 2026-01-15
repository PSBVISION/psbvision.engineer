import { Component } from "@/components/etheral-shadow";

export default function Home() {
  return (
    <div className="flex w-full h-screen justify-center items-center dark">
      <Component
      color="rgba(128, 128, 128, 1)"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill" className="bg-zinc-800"
         />
    </div>
  );
}
