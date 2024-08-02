const puppeteer = require('puppeteer');

(async () => {
    //Launch the browser
    const browser = await puppeteer.launch({dumpio: true, headless: false});
    //Try navigating and close on errors
    try {
        //Create a blank page
        const page = await browser.newPage();

        
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