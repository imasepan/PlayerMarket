import {type Browser, chromium, devices} from "playwright";
import {HttpStatusCode} from "axios";

export class Playwright {
    private static browser: Browser | null = null;

    private static async getBrowser() {
        if (!this.browser) {
            this.browser = await chromium.launch({ headless: true });
        }
        return this.browser;
    }

    public static async fetch<T>(apiUrl: string): Promise<T | null> {

        const browser = await Playwright.getBrowser();
        const context = await browser.newContext(devices['Desktop Chrome']);
        const page = await context.newPage();
        const response = await page.goto(apiUrl, { waitUntil: "networkidle" });

        if (!response) {
            console.log("No Response");
            await context.close();
            return null;
        }

        if (response.status() == HttpStatusCode.UnavailableForLegalReasons) {
            // Private profile
            await context.close();
            return {} as T;
        }

        if (response.status() >= 400) {
            console.log("400+ Error Playwright", await response.text());
            await context.close();
            return null;
        }

        const data = (await response.json()) as T;
        await context.close();
        return data;
    }

    public static async close() {
        if (this.browser != null) {
            await this.browser.close();
        }
    }
}