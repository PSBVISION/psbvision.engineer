import { Component } from "@/components/etheral-shadow";

/**
 * Render a full-screen, centered layout containing the Etheral Shadow component configured for a dark background.
 *
 * The container uses full viewport height and centers its child both horizontally and vertically.
 *
 * @returns The JSX element for the full-screen layout with the configured Component.
 */
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