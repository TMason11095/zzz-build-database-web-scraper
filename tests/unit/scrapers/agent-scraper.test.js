const puppeteer = require('puppeteer');
const { scrapeAgentInfoFromAgentPage, scrapeRecWEnginesFromAgentPage, scrapeRecDriveDiscSetsFromAgentPage, scrapeRecSkillPriorityFromAgentPage } = require('@scrapers/agent-scraper');

let browser;
let page;

//Use beforeAll to setup the page as all the tests should be read-only
beforeAll(async () => {
    //Arrange
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(global.AGENT_TEST_PAGE_URL);
});

//Close the browser after testing
afterAll(async () => {
    await browser.close();
});

//Agent page tests
describe("Agent Page Scraper Tests", () => {
    //Agent info
    test("Scrape agent info from the agent's page", async () => {
        //Act
        const agentInfo = await scrapeAgentInfoFromAgentPage(page);

        //Assert
        expect(agentInfo).toHaveProperty('name');
        expect(agentInfo).toHaveProperty('rarity');
        expect(agentInfo).toHaveProperty('attribute');
        expect(agentInfo).toHaveProperty('specialty');
        expect(agentInfo).toHaveProperty('faction');
    });
    //Agent W-Engines
    test("Scrape agent recommended W-Engines from the agent's page", async () => {
        //Act
        const wEngines = await scrapeRecWEnginesFromAgentPage(page);

        //Assert
        expect(Array.isArray(wEngines)).toBe(true);
        //Verify the properties of all the w-engine objects
        wEngines.foreach(wEngine => {
            expect(wEngine).toHaveProperty('order');
            expect(wEngine).toHaveProperty('name');
        });
    });
    //Agent Drive Disc Sets
    test("Scrape agent recommended drive disc sets from the agent's page", async () => {
        //Act
        const driveDiscSets = await scrapeRecDriveDiscSetsFromAgentPage(page);

        //Assert
        expect(Array.isArray(driveDiscSets)).toBe(true);
        //Verify the drive disc set properties
        driveDiscSets.foreach(driveDiscSet => {
            //Verify the set properties
            expect(driveDiscSet).toHaveProperty('order');
            expect(driveDiscSet).toHaveProperty('driveDiscs');
            //The set is multiple drive disc objects
            expect(Array.isArray(driveDiscSet.driveDiscs)).toBe(true);
            //Verify the drive disc properties
            driveDiscSet.foreach(driveDisc => {
                expect(driveDisc).toHaveProperty('name');
                expect(driveDisc).toHaveProperty('count');
            });
        });
    });
    //Agent Skill Priority
    test("Scrape agent recommended skill priority from the agent's page", async () => {
        //Act
        const skillPriority = await scrapeRecSkillPriorityFromAgentPage(page);

        //Assert
        expect(skillPriority).toHaveProperty('coreSkill');
        expect(skillPriority).toHaveProperty('basicAttack');
        expect(skillPriority).toHaveProperty('dodge');
        expect(skillPriority).toHaveProperty('assist');
        expect(skillPriority).toHaveProperty('specialAttack');
        expect(skillPriority).toHaveProperty('chainAttack');
    });
});