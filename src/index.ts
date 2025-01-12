import dotenv from 'dotenv';
import { createServer } from "@modelcontextprotocol/typescript-sdk";
import { JiraMCPServer } from './mcpServer';
import { JiraService } from './services/jira';
import { JiraConfig } from './types';

dotenv.config();

const jiraConfig: JiraConfig = {
    host: process.env.JIRA_HOST || '',
    apiToken: process.env.JIRA_API_TOKEN || '',
    email: process.env.JIRA_EMAIL || ''
};

async function main() {
    try {
        if (!jiraConfig.host || !jiraConfig.apiToken || !jiraConfig.email) {
            throw new Error('Missing required JIRA configuration');
        }

        const jiraService = new JiraService(jiraConfig);
        const mcpServer = new JiraMCPServer(jiraService);
        
        const server = createServer(mcpServer);
        const port = Number(process.env.PORT) || 3001;
        
        server.listen(port, () => {
            console.log(`MCP Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

main();