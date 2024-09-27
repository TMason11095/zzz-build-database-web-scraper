//FUTURE TODO?: Move URLs into a seperate JSON file. URLs are currently static and are rarely added outside of initial implementation 

export async function navToAgentListPage(page) {
    const agentListUrl = `https://game8.co/games/Zenless-Zone-Zero/archives/435684`;
    await page.goto(agentListUrl);
}