import express from 'express';
import { chromium } from 'playwright';
import { setContext } from './utils/context-manager.js';
import agentRoutes from './routes/agent-routes.js';

import { error } from 'console';

async function startServer() {
    //Setup server
    const app = express();
    const port = 3000;
    //Setup browser context for scraper calls
    const browser = await chromium.launch({ dumpio: true, headless: false });
    const context = await browser.newContext();
    setContext(context);
    //Add routes to API server
    app.use(express.json());
    app.use('/api', agentRoutes);
    //Close the browser when the server ends
    process.on('exit', async () => {
        await browser.close();
    });
    //Start the server
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}.`);
    });
    
}

startServer();