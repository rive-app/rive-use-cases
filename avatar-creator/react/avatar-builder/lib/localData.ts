import fsPromises from "fs/promises";
import path from "path";

import data from "@/json/avatarConfig.json";
export type JSONType = typeof data;

export async function getLocalData() {
  // Get the path of the json file
  const filePath = path.join(process.cwd(), "json/avatarConfig.json");
  // Read the json file
  const jsonData = await fsPromises.readFile(filePath) as unknown as string;
  // Parse data as json
  const objectData = JSON.parse(jsonData);

  return objectData;
}
