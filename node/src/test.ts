// import { readFile } from "fs/promises";

// const geojson = JSON.parse(
//   (
//     await readFile(
//       "D:/project/StormPerdiction/frontEnd/public/geojson/water.geojson"
//     )
//   ).toString()
// );
// const result: any = {};
// const features: object[] = geojson.features;
// features.forEach((feature: any) => {
//   const coord = feature.geometry.coordinates;
//   const properties = feature.properties;
//   const name = properties.name;
//   const id = properties.id;
//   const pinyin = properties.pinyin;
//   const type = properties.type;
//   result[id] = {
//     coord,
//     name,
//     pinyin,
//     type,
//   };
// });

// console.log(result);

const str = "kxh 521";
console.log(str.split(" "));
