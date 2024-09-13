import { chromium } from 'playwright';
import { scrapeAgentInfoFromAgentPage } from './scrapers/agent-scraper.js';

(async () => {
    //Launch the browser
    const browser = await chromium.launch({dumpio: true, headless: false});
    //Try navigating and close on errors
    try {
        //Create a blank page
        const page = await browser.newPage();
        
        //Test agent page
        await page.goto('https://game8.co/games/Zenless-Zone-Zero/archives/436705');
        const engine = await scrapeRecWEnginesFromAgentPage(page);

        const test = "";
        
    }
    catch (error) {
        //Print error
        console.error('Error in browser: ', error);
        //Fail
        return false;
    }
    finally {
        //Close the browser
        await browser.close();
    }
})();