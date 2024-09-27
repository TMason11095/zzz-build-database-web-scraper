export async function getFollowingSiblingByPartialHeaderText(page, partialHeaderText) {
    const sectionHeadersSelector = 'body div.l-content div.l-3col div.l-3colMain div.l-3colMain__center div.archive-style-wrapper h3, h2';

    //Find the header that contains the given text
    const targetHeader = await page.locator(sectionHeadersSelector, { hasText: new RegExp('^.*' + partialHeaderText + '$') });
    //Next sibling is the table
    return await getFollowingSibling(targetHeader);
}

export async function getFollowingSibling(container) {
    return await container.locator('xpath=following-sibling::*[1]');
}