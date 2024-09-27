import * as dataHelper from '../utils/data-helper.js';
import { scrapeAgentPage } from '../scrapers/agent-scraper.js'
import { getContext } from '../utils/context-manager.js';
import { navToAgentListPage } from '../utils/scraper-helpers/page-nav.js';
import { scrapePlayableAgentList } from '../scrapers/agent-list-scraper.js';
import path from 'path';

const AGENT_LIST_FILE = 'agent-list';
const AGENT_FILE_DIR = 'agents';

export async function getAgentByName(agentName) {
    //Get agent's link
    const agentLink = await getAgentLinkByName(agentName);
    //Check if the link wasn't found
    if (!agentLink) {
        return null;
    }
    //Get the agent's link info
    const name = agentLink.name;
    const url = agentLink.url;

    //Build the cache'd agent's file path
    const filePath = path.join(AGENT_FILE_DIR, name);
    //Check for an existing agent file's last change date
    const lastChgDate = await dataHelper.getLastChangeTimeFromInternalJsonFile(filePath);
    //If the file doesn't exist (TODO: out of date), then scrape and save a new file
    if (!lastChgDate) {
        await cacheAgentData(filePath, url);
    }
    //Return the agent data
    const agent = await dataHelper.readJsonFromInternalFile(filePath);
    //Return the agent
    return agent;
}

export async function getAgentNameList() {
    //Get the agent list
    const agents = await getAgentLinkList();
    //Return only the names
    if (agents) {
        return agents.map(agent => agent.name);
    }
    else {
        return null;
    }
}

async function getAgentLinkList() {
    //Check the save file's last change date (null if doesn't exist yet)
    const lastChgDate = await dataHelper.getLastChangeTimeFromInternalJsonFile(AGENT_LIST_FILE);
    //If the file doesn't exist (TODO: or is out of date), then scrape and make a new file
    if (!lastChgDate) {
        await cachePlayableAgentListData();
    }
    //Return the agent list
    return await dataHelper.readJsonFromInternalFile(AGENT_LIST_FILE);
}

async function getAgentLinkByName(agentName) {
    //Grab all agent urls
    const agents = await getAgentLinkList();
    //Return null if no agents were found
    if (!agents) {
        return null;
    }
    //Convert the search name to lower case to ignore case
    const targetName = agentName.toLowerCase();
    //Find the agent that matches the input string
    const targetAgent = await agents.find(agent => {
        //Convert the current name to lower to ignore case
        const savedName = agent.name.toLowerCase();
        //Compare against the larger of the 2 names
        if (savedName.length > targetName.length) {//Saved > target
            //Target within saved?
            return savedName.includes(targetName);
        }
        else {//Target >= saved
            //Saved within target?
            return targetName.includes(savedName);
        }
    });
    //Return the agent link if it's found
    return targetAgent;
}

async function cachePlayableAgentListData() {
    //Grab the context and open a new page
    const context = getContext();
    const page = await context.newPage();
    //Navigate to the agent list page
    await navToAgentListPage(page);
    //Get the playable agent list
    const playableAgents = await scrapePlayableAgentList(page);
    //Save to data folder
    dataHelper.saveJsonToInternalFile(playableAgents, AGENT_LIST_FILE);
    //Close the page
    await page.close();
}

async function cacheAgentData(filePath, agentUrl) {
    //Grab the context and open a new page
    const context = getContext();
    const page = await context.newPage();
    //Navigate to the agent's page
    await page.goto(agentUrl);
    //Scrape the page
    const agent = await scrapeAgentPage(page);
    //Save to data folder
    dataHelper.saveJsonToInternalFile(agent, filePath);
    //Close the page
    await page.close();
}