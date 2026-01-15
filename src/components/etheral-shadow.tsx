"use client";

import React, { useRef, useId, useEffect, CSSProperties } from "react";
import {
  animate,
  useMotionValue,
  AnimationPlaybackControls,
} from "framer-motion";
import Link from "next/link";
import GithubIcon from "./ui/github-icon";
import LinkedinIcon from "./ui/linkedin-icon";
import TwitterXIcon from "./ui/twitter-x-icon";
import CallToAction from "./CallToAction";
import FileDescriptionIcon from "./ui/file-description-icon";

// Type definitions
interface ResponsiveImage {
  src: string;
  alt?: string;
  srcSet?: string;
}

interface AnimationConfig {
  preview?: boolean;
  scale: number;
  speed: number;
}

interface NoiseConfig {
  opacity: number;
  scale: number;
}

interface ShadowOverlayProps {
  type?: "preset" | "custom";
  presetIndex?: number;
  customImage?: ResponsiveImage;
  sizing?: "fill" | "stretch";
  color?: string;
  animation?: AnimationConfig;
  noise?: NoiseConfig;
  style?: CSSProperties;
  className?: string;
}

/**
 * Linearly maps a numeric value from one range to another.
 *
 * @param value - The input value to map.
 * @param fromLow - Lower bound of the input range.
 * @param fromHigh - Upper bound of the input range.
 * @param toLow - Lower bound of the target range.
 * @param toHigh - Upper bound of the target range.
 * @returns The mapped value in the target range. If `fromLow` equals `fromHigh`, returns `toLow`.
 */
function mapRange(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
): number {
  if (fromLow === fromHigh) {
    return toLow;
  }
  const percentage = (value - fromLow) / (fromHigh - fromLow);
  return toLow + percentage * (toHigh - toLow);
}

const useInstanceId = (): string => {
  const id = useId();
  const cleanId = id.replace(/:/g, "");
  const instanceId = `shadowoverlay-${cleanId}`;
  return instanceId;
};

/**
 * Render a full-size stylized shadow/overlay with an optional turbulence-based animated shader, masked color layer, and a centered call-to-action with social links.
 *
 * @param sizing - Controls mask sizing; "stretch" forces the mask to fill the container, otherwise the mask uses "cover".
 * @param color - Background color applied to the masked layer.
 * @param animation - When provided and `animation.scale > 0`, enables an SVG turbulence/displacement filter and a looping hue-rotation. Relevant fields: `scale` (controls displacement intensity) and `speed` (controls animation tempo).
 * @param noise - Optional top-layer texture; `noise.opacity` controls overlay opacity and `noise.scale` controls the tiling/scale of the repeating noise image.
 * @param style - Inline styles applied to the outer container.
 * @param className - CSS class names applied to the outer container.
 *
 * @returns A React element containing the overlay (animated when `animation` is enabled), the centered content block (title, subtitle, social links, and CallToAction), and an optional noise overlay.
 */
export function Component({
  sizing = "fill",
  color = "rgba(128, 128, 128, 1)",
  animation,
  noise,
  style,
  className,
}: ShadowOverlayProps) {
  const id = useInstanceId();
  const animationEnabled = animation && animation.scale > 0;
  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
  const hueRotateMotionValue = useMotionValue(180);
  const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null);

  const displacementScale = animation
    ? mapRange(animation.scale, 1, 100, 20, 100)
    : 0;
  const animationDuration = animation
    ? mapRange(animation.speed, 1, 100, 1000, 50)
    : 1;

  useEffect(() => {
    if (feColorMatrixRef.current && animationEnabled) {
      if (hueRotateAnimation.current) {
        hueRotateAnimation.current.stop();
      }
      hueRotateMotionValue.set(0);
      hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
        duration: animationDuration / 25,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        ease: "linear",
        delay: 0,
        onUpdate: (value: number) => {
          if (feColorMatrixRef.current) {
            feColorMatrixRef.current.setAttribute("values", String(value));
          }
        },
      });

      return () => {
        if (hueRotateAnimation.current) {
          hueRotateAnimation.current.stop();
        }
      };
    }
  }, [animationEnabled, animationDuration, hueRotateMotionValue]);

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -displacementScale,
          filter: animationEnabled ? `url(#${id}) blur(4px)` : "none",
        }}
      >
        {animationEnabled && (
          <svg style={{ position: "absolute" }}>
            <defs>
              <filter id={id}>
                <feTurbulence
                  result="undulation"
                  numOctaves="2"
                  baseFrequency={`${mapRange(
                    animation.scale,
                    0,
                    100,
                    0.001,
                    0.0005
                  )},${mapRange(animation.scale, 0, 100, 0.004, 0.002)}`}
                  seed="0"
                  type="turbulence"
                />
                <feColorMatrix
                  ref={feColorMatrixRef}
                  in="undulation"
                  type="hueRotate"
                  values="180"
                />
                <feColorMatrix
                  in="dist"
                  result="circulation"
                  type="matrix"
                  values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="circulation"
                  scale={displacementScale}
                  result="dist"
                />
                <feDisplacementMap
                  in="dist"
                  in2="undulation"
                  scale={displacementScale}
                  result="output"
                />
              </filter>
            </defs>
          </svg>
        )}
        <div
          style={{
            backgroundColor: color,
            maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
            maskSize: sizing === "stretch" ? "100% 100%" : "cover",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <h1 className="md:text-3xl text-2xl lg:text-4xl text-center text-foreground relative z-20 pb-6 font-sans">
          Website under development 🚧
        </h1>
        <p className="md:text-5xl text-4xl lg:text-6xl text-center text-foreground relative z-20 font-black font-sans tracking-wide">
          I’m polishing my portfolio right now.
        </p>
        <p className="md:text-2xl text-xl lg:text-3xl font-medium font-sans text-center text-foreground relative z-20 py-5 italic">
          Until then, check out my work and socials here:
        </p>
        <div className="flex justify-center gap-2">
          <Link href="https://github.com/psbvision" className="z-20" target="_blank" rel="noopener noreferrer">
            <GithubIcon size={42} />
          </Link>
          <Link href="https://www.linkedin.com/in/psbvision/" className="z-20" target="_blank" rel="noopener noreferrer">
            <LinkedinIcon size={42} />
          </Link>
          <Link href="https://x.com/PSBVISION_X" className="z-20" target="_blank" rel="noopener noreferrer">
            <TwitterXIcon size={42} />
          </Link>
          <Link href="https://drive.google.com/file/d/1R0zr25Ak8Sw_j4NEcrrcBV0ew2Y7u5jx/view?usp=sharing" className="z-20" target="_blank" rel="noopener noreferrer">
            <FileDescriptionIcon size={42} />
          </Link>
        </div>
            <h1 className="md:text-3xl text-2xl lg:text-4xl text-center text-foreground relative z-20 font-sans py-4">Or</h1>
            <CallToAction/>
      </div>

      {noise && noise.opacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
            backgroundSize: noise.scale * 200,
            backgroundRepeat: "repeat",
            opacity: noise.opacity / 2,
          }}
        />
      )}
    </div>
  );
}