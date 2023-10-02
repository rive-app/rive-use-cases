import { Suspense } from "react";
import RiveAvatar from "@/components/RiveAvatarComponent";
import { RuntimeLoader } from "@rive-app/react-canvas";
import RiveIconsContainer from "@/components/RiveIconsContainer";
import { getLocalData } from "@/lib/localData";
import { AvatarStateProvider } from "./context/avatarState";

import data from "@/json/avatarConfig.json";
import RiveOptionsContainer from "@/components/RiveOptionsContainer";
import RiveMainEntry from "@/components/RiveMainEntry";
export type JSONData = typeof data;

export default async function Home() {
  const localData: JSONData = await getLocalData();
  return (
    <main className="block relative w-screen max-w-screen-xl h-screen max-h-screen md:mx-auto">
      <Suspense fallback={<p>loading</p>}>
        <AvatarStateProvider>
          <RiveMainEntry localData={localData} />
        </AvatarStateProvider>
      </Suspense>
    </main>
  );
}
