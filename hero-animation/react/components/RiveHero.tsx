"use client";

import { useEffect, useState, MouseEvent, MouseEventHandler } from "react";
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";

import useMediaQuery from "@/utils/useMediaBreakpoint";
import usePrefersReducedMotion from "@/utils/usePrefersReducedMotion";
import { throttle } from "@/utils/throttle";
import RiveButton from "./RiveButton";

// @refresh reset

export default function RiveHero() {
  const [lastWidth, setLastWidth] = useState(0);
  const [lastHeight, setLastHeight] = useState(0);

  const lgQuery = useMediaQuery("only screen and (min-width: 1025px)");
  const prefersReducedMotion = usePrefersReducedMotion();

  const {
    rive,
    setCanvasRef,
    setContainerRef,
    canvas: canvasRef,
    container: canvasContainerRef,
  } = useRive(
    {
      src: "/hero_use_case.riv",
      artboard: "Hero Demo Listeners Resize",
      stateMachines: "State Machine 1",
      layout: new Layout({
        fit: Fit.Cover,
        alignment: Alignment.Center,
      }),
      autoplay: true,
    },
    {
      // We disable the automatic resize logic in Rive React runtime so we can manipulate
      // sizing manually, which is necessary for our adaptive layout effect
      shouldResizeCanvasToContainer: false,
    }
  );

  // On larger viewports, display the entire artboard while maintaining aspect ratio
  // On smaller viewports, cover the viewport with the artboard while maintaining aspect ratio
  // which may crop certain parts of the artboard
  useEffect(() => {
    if (rive) {
      if (lgQuery) {
        rive!.layout = new Layout({
          fit: Fit.Contain,
          alignment: Alignment.Center,
        });
      } else {
        rive!.layout = new Layout({
          fit: Fit.Cover,
          alignment: Alignment.Center,
        });
      }
    }
  }, [rive, lgQuery]);

  const numX = useStateMachineInput(rive, "State Machine 1", "numX", 50);
  const numY = useStateMachineInput(rive, "State Machine 1", "numY", 50);
  const numSize = useStateMachineInput(rive, "State Machine 1", "numSize", 0);

  // Pause the animation when the user prefers reduced motion
  useEffect(() => {
    if (rive) {
      prefersReducedMotion ? rive.pause() : rive.play();
    }
  }, [rive, prefersReducedMotion]);

  // Resize the canvas to match its parent container size. Additionally, once the viewport gets below
  // our lg scale threshold, scale the `numSize` input to achieve an adaptive layout effect.
  useEffect(() => {
    if (rive && canvasRef && canvasContainerRef) {
      const resizeObserver = new ResizeObserver(
        throttle(() => {
          //Get the block size
          if (rive && canvasContainerRef) {
            const newWidth = canvasContainerRef.clientWidth;
            const newHeight = canvasContainerRef.clientHeight;
            // From 500px to 1200px, scale the numSize input on a scale of 0-100%
            if (newWidth <= 1200 && numSize) {
              const resizeRange = 1200 - 500;
              numSize!.value = ((1200 - newWidth) / resizeRange) * 100;
            }
            const dpr = window.devicePixelRatio;
            if (
              canvasRef &&
              (lastWidth !== newWidth || lastHeight !== newHeight)
            ) {
              const newCanvasWidth = dpr * newWidth;
              const newCanvasHeight = dpr * newHeight;
              canvasRef.width = newCanvasWidth;
              canvasRef.height = newCanvasHeight;
              setLastWidth(newCanvasWidth);
              setLastHeight(newCanvasHeight);
              canvasRef.style.width = `${newWidth}px`;
              canvasRef.style.height = `${newHeight}px`;
              rive!.resizeToCanvas();
              rive!.startRendering();
            }
          }
        }, 0)
      );

      resizeObserver.observe(canvasContainerRef);

      return () => resizeObserver.unobserve(canvasRef);
    }
    // numSize does not need to be added because we're simply setting its internal value
    // rather than using any reactive state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rive, canvasRef, canvasContainerRef, lastWidth, lastHeight]);

  // Drive the mouse positon inputs for the state machine based on cursor mouse movement position
  const onMouseMove: MouseEventHandler<HTMLDivElement> = (
    e: MouseEvent<HTMLDivElement>
  ) => {
    if (!numX || !numY) {
      return;
    }
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    numX.value = (e.clientX / maxWidth) * 100;
    numY.value = 100 - (e.clientY / maxHeight) * 100;
  };

  return (
    <div
      className="bg-[#09090E] relative rive-canvas-container w-full h-full"
      style={{ width: "100%", height: "100%" }}
      ref={setContainerRef}
      onMouseMove={onMouseMove}
    >
      <canvas
        className="bg-[#09090E] rive-canvas block relative w-full h-full max-h-screen max-w-screen align-top"
        ref={setCanvasRef}
        style={{ width: "100%", height: "100%" }}
        aria-label="Hero element for the Explore page; an interactive graphic showing planets thru a spacesuit visor"
      ></canvas>
      <RiveButton />
    </div>
  );
}
