import { Rive, Fit, Layout, Alignment } from "@rive-app/canvas-single";

const WorldCreatorFile = new URL("/assets/world_creator.riv", import.meta.url);
const DisneyFile = new URL("/assets/disney.riv", import.meta.url);

// ---------------------------------
// The layout the graphic will adhere to
const layout = new Layout({
  fit: Fit.Layout, // Change to: rive.Fit.Contain, or Cover
  // alignment: Alignment.Center,
  // layoutScaleFactor: 2,
});

// ---------------------------------
// Resize on widow
function resizeRiveCanvas(riveInstance: Rive) {
  window.addEventListener(
    "resize",
    () => {
      riveInstance.resizeDrawingSurfaceToCanvas();
    },
    false
  );
}

// ---------------------------------
// Randomly select a Rive file
function getRandomRiveFile(): URL {
  const files = [WorldCreatorFile, DisneyFile];
  const randomIndex = Math.floor(Math.random() * files.length);
  return files[randomIndex];
}

// ---------------------------------
// HTML Canvas element to render to
const riveCanvas = document.getElementById("riveCanvas") as HTMLCanvasElement;

async function loadRiveFile() {
  const RiveFileToLoad = getRandomRiveFile();
  return await (await fetch(new Request(RiveFileToLoad))).arrayBuffer();
}

async function setup() {
  const bytes = await loadRiveFile();

  const riveInstance = new Rive({
    buffer: bytes,
    autoplay: true,
    autoBind: true,
    canvas: riveCanvas,
    layout: layout,
    stateMachines: ["State Machine 1"],
    onLoad: () => {
      resizeRiveCanvas(riveInstance);
      // Prevent a blurry canvas by using the device pixel ratio
      riveInstance.resizeDrawingSurfaceToCanvas();
    },
  });
}

setup();
