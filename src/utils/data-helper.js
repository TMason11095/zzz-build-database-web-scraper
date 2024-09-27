import { promises as fs } from 'fs';
import path from 'path';

const LOCAL_DATA_PATH = './src/data/cache'

export async function getLastChangeTimeFromInternalJsonFile(fileName) {
    //Add the json file ext to the file name
    fileName += '.json';
    //Build the full path
    const filePath = path.join(LOCAL_DATA_PATH, fileName);
    //Get the file metadata
    try {
        const stats = await fs.stat(filePath);
        //Return the last modified date object
        return stats.mtime;
    }
    catch (error) {
        //Return null if the file/directory doesn't exist
        if (error.code === 'ENOENT') {
            return null;
        }
        else {//Otherwise rethrow the error to handle elsewhere
            throw error;
        }
    }
}

export async function saveJsonToInternalFile(data, fileName) {
    //Add the json file ext to the file name
    fileName += '.json';
    //Call the save data function
    await saveDataToInternalFile(data, fileName);
}

export async function readJsonFromInternalFile(fileName) {
    //Add the json file ext to the file name
    fileName += '.json';
    //Call the read data function
    return await readDataFromInternalFile(fileName);
}

async function saveDataToInternalFile(data, fileName) {
    //Build full path
    const filePath = path.join(LOCAL_DATA_PATH, fileName);
    //Save the data
    try {
        //Create any missing directories
        const dirPath = path.dirname(filePath);
        fs.mkdir(dirPath, {recursive: true});
        //Write the file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    }
    catch (error) {
        console.error('Error saving data to file:', error);
    }
}

async function readDataFromInternalFile(fileName) {
    //Build full path
    const filePath = path.join(LOCAL_DATA_PATH, fileName);
    //Read the data
    try {
        const rawData = await fs.readFile(filePath, 'utf8');
        return JSON.parse(rawData);
    }
    catch (error) {
        //Don't throw a console error if the error is just that the file doesn't exist
        if (error.code === 'ENOENT') {
            console.log(`Tried opening non-existing file: ${filePath}`);
        }
        else {
            console.error('Error reading data from file:', error);
        }
        //Return
        return null;
    }
}