import { test, expect } from "@playwright/test";
import { getFilename } from "../src/test_utils";
// Setup
class TestingEnvironment {
  static IPHONE_HEIGHT: number = 844;
  static IPHONE_WIDTH: number = 390;

  static URLS_TO_SCRAPE: string[] = [
    "https://m.investing.com/indices/us-spx-500-futures-chart",
    "https://m.investing.com/indices/us-spx-500-chart",
    "https://m.investing.com/currencies/usd-jpy-chart",
  ];
}

test.use({
  viewport: {
    width: TestingEnvironment.IPHONE_WIDTH,
    height: TestingEnvironment.IPHONE_HEIGHT,
  },
});

// Parameterized tests
for (const URL of TestingEnvironment.URLS_TO_SCRAPE) {
  test(`Capturing ${URL}`, async ({ page }) => {
    await page.goto(URL);
    // Wait a time between 0-4 seconds in order to pretend to be human
    await page.waitForTimeout(Math.random() * 2000);
    // Remove ad
    await page.getByRole("button", { name: "Not now" }).click();

    // Remove Header from screenshot
    const header = page.locator("#topHeader");
    const bottomAd = page.locator("#div-gpt-ad-1333374405327-0");
    const fullChartLink = page.getByRole("link", { name: "Full Chart »" });

    const headerBox = await header.boundingBox();
    const bottomAdBox = await bottomAd.boundingBox();
    const fullChartLinkBox = await fullChartLink.boundingBox();

    const filename = getFilename(URL);

    if (headerBox && bottomAdBox && fullChartLinkBox) {
      console.log(headerBox.height, bottomAdBox.height);
      await page.screenshot({
        path: `${filename}.png`,
        mask: [header, bottomAd],
        clip: {
          y: headerBox.height,
          x: 0,
          height:
            TestingEnvironment.IPHONE_HEIGHT -
            headerBox.height -
            bottomAdBox.height -
            200,
          width: bottomAdBox.width,
        },
      });
    } else {
      throw new Error("Failed");
    }
  });
}
