import { test } from '@playwright/test';

class TestingEnvironment {
  static IPHONE_HEIGHT: number = 844;

  static IPHONE_WIDTH: number = 390;

  static URLS_TO_SCRAPE: string[] = [
    'https://m.investing.com/indices/us-spx-500-futures-chart',
    'https://m.investing.com/indices/us-spx-500-chart',
    'https://m.investing.com/currencies/usd-jpy-chart',
  ];

  static getFilename(URL: string): string {
    const segmented = URL.split('/');
    const endUrl = segmented[segmented.length - 1];
    // usd-jpy-chart would become usd-jpy
    return endUrl.slice(0, endUrl.indexOf('-chart'));
  }
}

test.use({
  viewport: {
    width: TestingEnvironment.IPHONE_WIDTH,
    height: TestingEnvironment.IPHONE_HEIGHT,
  },
});

// Parameterized tests
for (const URL of TestingEnvironment.URLS_TO_SCRAPE) {
  const filename = TestingEnvironment.getFilename(URL);

  test(`Capturing ${filename}`, async ({ page }) => {
    await page.goto(URL);
    // Remove ad
    await page.getByRole('button', { name: 'Not now' }).click();

    // Remove Header and bottom from screenshot
    const header = page.locator('#topHeader');
    const bottomAd = page.locator('#div-gpt-ad-1333374405327-0');
    const fullChartLink = page.getByRole('link', { name: 'Full Chart »' });

    const headerBox = await header.boundingBox();
    const bottomAdBox = await bottomAd.boundingBox();
    const fullChartLinkBox = await fullChartLink.boundingBox();

    if (headerBox && bottomAdBox && fullChartLinkBox) {
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
      throw new Error('Failed');
    }
  });
}
