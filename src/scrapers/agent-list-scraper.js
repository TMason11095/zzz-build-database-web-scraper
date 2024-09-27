import { getFollowingSiblingByPartialHeaderText } from '../utils/scraper-helpers/playwright-extensions.js';

export async function scrapePlayableAgentList(page) {
    //Get the playable character section
    const playableSec = await getFollowingSiblingByPartialHeaderText(page, 'Playable Characters');
    //Playable table
    const playableTable = await playableSec.locator('div table');
    //Playable rows
    const playableRows = await playableTable.locator('tbody tr td:first-child a').all();
    //Playable agents
    const playableAgents = await Promise.all(playableRows.map(async row => {
        const name = await row.textContent().then(text => text.trim());
        const url = await row.getAttribute('href');
        return {
            name,
            url
        }
    }));
    //Return the names
    return playableAgents;
}