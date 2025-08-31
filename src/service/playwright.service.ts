import {type Browser, chromium, devices} from "playwright";
import {HttpStatusCode} from "axios";

// TODO You're perfect - but actually modify behavior to be in-line with needs of application

export class PlaywrightService {
    private static browser: Browser | null = null;

    private static async getBrowser() {
        if (!this.browser) {
            this.browser = await chromium.launch({ headless: true });
        }
        return this.browser;
    }

    public static async close() {
        if (this.browser != null) {
            await this.browser.close();
        }
    }

    public async fetch<T>(apiUrl: string): Promise<T> {

        const browser = await PlaywrightService.getBrowser();
        const context = await browser.newContext(devices['Desktop Chrome']);
        const page = await context.newPage();
        const response = await page.goto(apiUrl, { waitUntil: "networkidle" });

        if (!response) {
            console.log("No Response");
            await context.close();
            throw new Error();
        }

        if (response.status() >= HttpStatusCode.BadRequest) {
            console.log("400+ Error PlaywrightService", await response.text());
            await context.close();
            throw new Error();
        }

        const data = (await response.json()) as T;
        await context.close();
        return data;
    }
}