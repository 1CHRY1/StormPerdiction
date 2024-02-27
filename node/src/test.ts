// fetch(
//   "https://geomodeling.njnu.edu.cn/waterLevel/jiangsu/getInfoByStation/%E5%8D%97%E4%BA%AC"
// ).then((res) => {
//   console.log(res.status, res.headers);
//   const headers = new Headers();
//   headers.set("Cookie", res.headers.getSetCookie()[0].replace(/; Path.*/, ""));

//   fetch(
//     "https://geomodeling.njnu.edu.cn/bXQProcmw6S8/oUiTr72evl6w.9ae0c03.js",
//     {
//       method: "GET",
//       headers: headers,
//     }
//   ).then((res) => {
//     console.log(res.status);
//     console.log(res.headers);
//     return res.text();
//   });
// });

import puppeteer from "puppeteer-core";

(async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "C:/Users/kxh/Downloads/ungoogled-chromium_122.0.6261.69-1.1_windows_x64/ungoogled-chromium_122.0.6261.69-1.1_windows/chrome.exe",
  });
  const page = await browser.newPage();
  const response = await page.goto(
    "https://geomodeling.njnu.edu.cn/waterLevel/jiangsu/getInfoByStation/南京"
  );
  const responseBody = response;
  console.log(responseBody);
  await browser.close();
})();
