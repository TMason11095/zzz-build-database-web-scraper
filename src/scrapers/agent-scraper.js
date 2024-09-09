async function scrapeAgentInfoFromAgentPage(page) {
    //Find the header for the Agent Information section
    const agentInfoTable = await getSectionTableByPartialHeaderText(page, 'Agent Information');
    //Get the agent name
    const nameContainer = await agentInfoTable.locator('tbody tr td b.a-bold').first();
    const name = await nameContainer.textContent();
    //Get the agent rarity
    const rarityHeader = await agentInfoTable.getByText('Rarity');
    const raritySec = await getFollowingSibling(rarityHeader);
    const rarityIcon = await raritySec.locator('img');//Rarity is marked using an icon
    const rarityAltText = await rarityIcon.getAttribute('alt')
    const rarity = rarityAltText.split(' Icon')[0];//Alt text is "S Icon" so pull the rarity before " Icon"
    //Get the agent attribute
    const attribute = await getCellTextByHeader(agentInfoTable, 'Attribute');
    //Get the agent specialty
    const specialty = await getCellTextByHeader(agentInfoTable, 'Specialty');
    //Get the agent faction
    const faction = await getCellTextByHeader(agentInfoTable, 'Faction');

    //Return the agent info
    return {
        name,
        rarity,
        attribute,
        specialty,
        faction
    }
}

async function scrapeRecWEnginesFromAgentPage(page) {

}

async function scrapeRecDriveDiscSetsFromAgentPage(page) {

}

async function scrapeRecSkillPriorityFromAgentPage(page) {

}

async function getSectionTableByPartialHeaderText(page, partialHeaderText) {
    const sectionHeadersSelector = 'body div.l-content div.l-3col div.l-3colMain div.l-3colMain__center div.archive-style-wrapper h3';

    //Find the header that contains the given text
    const targetHeader = await page.locator(sectionHeadersSelector, { hasText: new RegExp('^.*' + partialHeaderText + '$') });
    //Next sibling is the table
    return await getFollowingSibling(targetHeader);
}

async function getFollowingSibling(container) {
    return await container.locator('xpath=following-sibling::*[1]');
}

async function getCellTextByHeader(table, headerText) {
    const header = await table.getByText(headerText);
    const section = await getFollowingSibling(header);
    const rawText = await section.textContent();//Contains whitespace
    const cellText = rawText.trim();

    return cellText;
}

module.exports = {
    scrapeAgentInfoFromAgentPage,
    scrapeRecWEnginesFromAgentPage,
    scrapeRecDriveDiscSetsFromAgentPage,
    scrapeRecSkillPriorityFromAgentPage
}