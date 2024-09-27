//Singleton class to handle Playwright Browser Context
let instance;

export function setContext(context) {
    instance = context;
}

export function getContext() {
    return instance;
}