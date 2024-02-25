import { readFile } from "fs/promises";
import { pinyin } from "pinyin-pro";

const geojson = JSON.parse(
  (
    await readFile(
      "D:/project/StormPerdiction/frontEnd/public/geojson/station.geojson"
    )
  ).toString()
);
const result: any = {};
const features: object[] = geojson.features;
features.forEach((feature: any) => {
  const coord = feature.geometry.coordinates;
  const properties = feature.properties;
  const name = properties.name;
  const id = properties.id;
  const pinyinOfName = pinyin(name, { toneType: "none" }).replace(/\s/g, "");
  result[id] = {
    name,
    pinyin: pinyinOfName,
    coord,
  };
});

console.log(result);
