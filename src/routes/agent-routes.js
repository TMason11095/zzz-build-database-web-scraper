import express from 'express';
import { getAgentNameList, getAgentByName } from '../cachers/agent-cacher.js';

//Setup routes
const router = express.Router();

//GET Agent list
router.get('/agents', async (req, res) => {
    try {
        //Get the agent list
        const agents = await getAgentNameList();
        //Return the agents
        res.json(agents);
    }
    catch (error) {
        console.error('Error in /agents API caller:', error);
        res.status(500).json({ error: 'Failed to fetch Agents.' });
    }
});

//GET Agent name=AgentName
router.get('/agent', async (req, res) => {
    //Grab the agent name from the request
    const name = req.query.name;
    if (!name) {
        return res.status(400).send('Name query parameter is required.');
    }
    //Get the requested agent
    const agent = await getAgentByName(name);
    //Return the results
    if (agent) {
        res.json(agent);
    }
    else {
        res.status(500).json({ error: 'Could not retrieve agent data.' });
    }
});

//Export the routes
export default router;