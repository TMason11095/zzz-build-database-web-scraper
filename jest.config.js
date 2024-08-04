module.exports = {
    //Directory shortcuts
    moduleNameMapper: {
        '^@scrapers/(.*)$': '<rootDir>/src/scrapers/$1'
    },
    //Test URL shortcuts
    globals: {
        //Anby's agent character page for testing
        AGENT_TEST_PAGE_URL: 'https://game8.co/games/Zenless-Zone-Zero/archives/436705'
    }
}