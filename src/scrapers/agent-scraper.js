import { getFollowingSiblingByPartialHeaderText, getFollowingSibling } from '../utils/scraper-helpers/playwright-extensions.js';

export async function scrapeAgentPage(page) {
    //Return the agent components as a single object
    return {
        agentInfo: await scrapeAgentInfoFromAgentPage(page),
        wEngines: await scrapeRecWEnginesFromAgentPage(page),
        driveDiscSets: await scrapeRecDriveDiscSetsFromAgentPage(page),
        skillPriority: await scrapeRecSkillPriorityFromAgentPage(page),
        coreSkillMaterials: await scrapeCoreSkillMaterialsFromAgentPage(page),
    }
}

export async function scrapeAgentInfoFromAgentPage(page) {
    //Find the header for the Agent Information section
    const agentInfoTable = await getFollowingSiblingByPartialHeaderText(page, 'Agent Information');
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

export async function scrapeRecWEnginesFromAgentPage(page) {
    //Get the W-Engine table
    const engineTable = await getFollowingSiblingByPartialHeaderText(page, 'Recommended W-Engines');
    //Grab all the engine rows
    const engineRows = await engineTable.locator('tbody tr').all();
    //Grab the engine order and name from each row (ignoring the first row as that's the header)
    const engines = [];
    for (const engineRow of engineRows.slice(1)) {
        //Get the order
        const orderElement = await engineRow.locator('th');
        const order = await orderElement.textContent();
        //Get the name
        const nameElement = await engineRow.locator('td a');
        const nameRaw = await nameElement.textContent();//Contains whitespace
        const name = nameRaw.trim();
        //Add to the engine list
        engines.push({
            order,
            name
        });
    }
    //Return the engines
    return engines;
}

export async function scrapeRecDriveDiscSetsFromAgentPage(page) {
    //Get the Drive Disc table
    const discTable = await getFollowingSiblingByPartialHeaderText(page, 'Best Drive Discs and Set Bonuses');
    //Grab all the disc set rows
    const discSetRows = await discTable.locator('tbody tr td:nth-child(1)').all();//Only need the 1st child, since the 2nd is just the reasoning paragraph
    //Grab the disc sets
    const driveDiscSets = [];
    const discSetCount = await discSetRows.length;
    for (let i = 0; i < discSetCount; i++) {
        //Disc set row
        const discSetRow = discSetRows[i];

        //Order is just i+1 since discs are already in order, but i starts at 0
        const order = i + 1;

        //Grab the discs (Name and count aren't easily grouped, so we'll grab both seperately and merge based on index)
        //Grab the names
        const discNameElements = await discSetRow.locator('a').all();
        const discNames = await Promise.all(
            discNameElements.map(async (discNameElement) => {
                return await discNameElement.textContent();
            })
        )
        //Grab the counts
        const discSetFullText = await discSetRow.textContent();
        const discCountRegex = /\((\d)-pc\)/g;//Matches (*-pc) where * is the count we want
        const discCounts = splitByRegex(discSetFullText, discCountRegex).map(textNum => parseInt(textNum));//Grabs the count text and converts to ints
        //Merge the names and counts by index
        const driveDiscs = discNames.map((name, index) => ({
            name,
            count: discCounts[index]//Disc count matches on the name's index
        }));

        //Add the disc set to the list
        driveDiscSets.push({
            order,
            driveDiscs
        });
    }
    //Return the disc sets
    return driveDiscSets;
}

export async function scrapeRecSkillPriorityFromAgentPage(page) {
    //Get the skill table
    const skillTable = await getFollowingSiblingByPartialHeaderText(page, 'Skill Priority');
    //Return the skills
    return {
        coreSkill: await getSkillPriorityFromTable(skillTable, 'Core Skill'),
        basicAttack: await getSkillPriorityFromTable(skillTable, 'Basic Attack'),
        dodge: await getSkillPriorityFromTable(skillTable, 'Dodge'),
        assist: await getSkillPriorityFromTable(skillTable, 'Assist'),
        specialAttack: await getSkillPriorityFromTable(skillTable, 'Special Attack'),
        chainAttack: await getSkillPriorityFromTable(skillTable, 'Chain Attack')
    }
}

export async function scrapeCoreSkillMaterialsFromAgentPage(page) {
    //Get the upgrade material table
    const materialTable = await getFollowingSiblingByPartialHeaderText(page, 'Total Upgrade Materials');
    //Get the header section for the core skill materials
    const coreSkillMaterialsHeaderSec = await materialTable.locator('tr', { hasText: 'Total Core Skill Upgrade Materials' });
    //Get the core skill materials section (next sibling)
    const coreSkillMaterialsSec = await getFollowingSibling(coreSkillMaterialsHeaderSec);
    //Return the materials
    return {
        sRank: await getMaterialNameFromCoreSkillMaterialsContainer(coreSkillMaterialsSec, 'x9'),
        aRank: await getMaterialNameFromCoreSkillMaterialsContainer(coreSkillMaterialsSec, 'x60')
    }
}

async function getMaterialNameFromCoreSkillMaterialsContainer(container, materialCountText) {
    //Get the specified material container
    const materialContainer = await container.locator('td div', { hasText: materialCountText }).locator('a');
    //Get the material name
    const materialName = await materialContainer.textContent().then(text => text.trim());

    return materialName;
}

async function getSkillPriorityFromTable(table, skillName) {
    //Get the row that has the given skill name
    const skillRow = await table.locator(`tr:has(td:nth-child(1):has-text("${skillName}"))`);//Has the skill name in the 1st column
    //Get the priority from that row (2nd column)
    const skillPriorityElement = await skillRow.locator('td:nth-child(2)');
    //Get the priority star rating (★★☆☆☆)
    const skillPriorityStars = await skillPriorityElement.textContent();
    //Convert the star rating to a numeric rating (★★☆☆☆ => 2)
    const skillPriority = (skillPriorityStars.match(/★/g)).length;

    return skillPriority;
}

async function getCellTextByHeader(table, headerText) {
    const header = await table.getByText(headerText);
    const section = await getFollowingSibling(header);
    const rawText = await section.textContent();//Contains whitespace
    const cellText = rawText.trim();

    return cellText;
}

function splitByRegex(text, regex) {
    //Loop and grab the results from all the regex matches found
    const results = [];
    let matches;
    while (matches = regex.exec(text)) {//Check for a match till one isn't found
        results.push(matches[1]);//Index 1 contains the dynamic portion of the match
    }
    return results;
}