import { test, expect } from '@playwright/test';
import * as agentScraper from '../src/scrapers/agent-scraper.js';
import * as agentListScraper from '../src/scrapers/agent-list-scraper.js';

const TEST_AGENT_PAGE_URL = "https://game8.co/games/Zenless-Zone-Zero/archives/436705";
const TEST_ALL_AGENTS_PAGE_URL = "https://game8.co/games/Zenless-Zone-Zero/archives/435684";

//Agent list page tests
test.describe("Agent List Page Scraper Tests", () => {
    //Agent List Page
    test("Scrape agent list page", async ({ page }) => {
        //Arrange
        await page.goto(TEST_ALL_AGENTS_PAGE_URL);

        //Act
        const agents = await agentListScraper.scrapePlayableAgentList(page);

        //Assert
        const test = "";
    })
})

//Agent page tests
test.describe("Agent Page Scraper Tests", () => {
    //Agent Page
    test("Scrape agent page", async ({ page }) => {
        //Arrange
        await page.goto(TEST_AGENT_PAGE_URL);

        //Act
        const agent = await agentScraper.scrapeAgentPage(page);

        //Assert
        expectAgent(agent);
    })
    //Agent info
    test("Scrape agent info from the agent's page", async ({ page }) => {
        //Arrange
        await page.goto(TEST_AGENT_PAGE_URL);

        //Act
        const agentInfo = await agentScraper.scrapeAgentInfoFromAgentPage(page);

        //Assert
        expectAgentInfo(agentInfo);
    });
    //Agent W-Engines
    test("Scrape agent recommended W-Engines from the agent's page", async ({ page }) => {
        //Arrange
        await page.goto(TEST_AGENT_PAGE_URL);

        //Act
        const wEngines = await agentScraper.scrapeRecWEnginesFromAgentPage(page);

        //Assert
        expectWEngines(wEngines);
    });
    //Agent Drive Disc Sets
    test("Scrape agent recommended drive disc sets from the agent's page", async ({ page }) => {
        //Arrange
        await page.goto(TEST_AGENT_PAGE_URL);

        //Act
        const driveDiscSets = await agentScraper.scrapeRecDriveDiscSetsFromAgentPage(page);

        //Assert
        expectDriveDiscSets(driveDiscSets);
    });
    //Agent Skill Priority
    test("Scrape agent recommended skill priority from the agent's page", async ({ page }) => {
        //Arrange
        await page.goto(TEST_AGENT_PAGE_URL);

        //Act
        const skillPriority = await agentScraper.scrapeRecSkillPriorityFromAgentPage(page);

        //Assert
        expectSkillPriority(skillPriority);
    });
    //Agent Core Skill Upgrade Materials
    test("Scrape agent core skill upgrade materials from the agent's page", async ({ page }) => {
        //Arrange
        await page.goto(TEST_AGENT_PAGE_URL);

        //Act
        const coreSkillMaterials = await agentScraper.scrapeCoreSkillMaterialsFromAgentPage(page);

        //Assert
        expectCoreSkillMaterials(coreSkillMaterials);
    });
});

//Helper functions to reuse expected property checks:

function expectAgent(agent) {
    //Agent info
    expect(agent).toHaveProperty('agentInfo');
    expectAgentInfo(agent.agentInfo);
    //W-engines
    expect(agent).toHaveProperty('wEngines');
    expectWEngines(agent.wEngines);
    //Drive disc sets
    expect(agent).toHaveProperty('driveDiscSets');
    expectDriveDiscSets(agent.driveDiscSets);
    //Skill priority
    expect(agent).toHaveProperty('skillPriority');
    expectSkillPriority(agent.skillPriority);
    //Core skill materials
    expect(agent).toHaveProperty('coreSkillMaterials');
    expectCoreSkillMaterials(agent.coreSkillMaterials);
}

function expectAgentInfo(agentInfo) {
    expect(agentInfo).toHaveProperty('name');
    expect(agentInfo).toHaveProperty('rarity');
    expect(agentInfo).toHaveProperty('attribute');
    expect(agentInfo).toHaveProperty('specialty');
    expect(agentInfo).toHaveProperty('faction');
}

function expectWEngines(wEngines) {
    expect(Array.isArray(wEngines)).toBe(true);
    //Verify the properties of all the w-engine objects
    wEngines.forEach(wEngine => {
        expect(wEngine).toHaveProperty('order');
        expect(wEngine).toHaveProperty('name');
    });
}

function expectDriveDiscSets(driveDiscSets) {
    expect(Array.isArray(driveDiscSets)).toBe(true);
    //Verify the drive disc set properties
    driveDiscSets.forEach(driveDiscSet => {
        //Verify the set properties
        expect(driveDiscSet).toHaveProperty('order');
        expect(driveDiscSet).toHaveProperty('driveDiscs');
        //The set is multiple drive disc objects
        expect(Array.isArray(driveDiscSet.driveDiscs)).toBe(true);
        //Verify the drive disc properties
        driveDiscSet.driveDiscs.forEach(driveDisc => {
            expect(driveDisc).toHaveProperty('name');
            expect(driveDisc).toHaveProperty('count');
        });
    });
}

function expectSkillPriority(skillPriority) {
    expect(skillPriority).toHaveProperty('coreSkill');
    expect(skillPriority).toHaveProperty('basicAttack');
    expect(skillPriority).toHaveProperty('dodge');
    expect(skillPriority).toHaveProperty('assist');
    expect(skillPriority).toHaveProperty('specialAttack');
    expect(skillPriority).toHaveProperty('chainAttack');
}

function expectCoreSkillMaterials(coreSkillMaterials) {
    expect(coreSkillMaterials).toHaveProperty('aRank');
    expect(coreSkillMaterials).toHaveProperty('sRank');
}