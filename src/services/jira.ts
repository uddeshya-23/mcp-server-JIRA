import JiraAPI from 'jira-client';
import { JiraConfig, JiraIssue } from '../types';

export class JiraService {
    private client: JiraAPI;

    constructor(config: JiraConfig) {
        this.client = new JiraAPI({
            protocol: 'https',
            host: config.host,
            username: config.email,
            password: config.apiToken,
            apiVersion: '3',
            strictSSL: true
        });
    }

    async searchIssues(jql: string = '', startAt: number = 0, maxResults: number = 50): Promise<{ issues: JiraIssue[], total: number }> {
        const results = await this.client.searchJira(jql || 'order by created DESC', {
            startAt,
            maxResults,
            fields: ['summary', 'status', 'assignee', 'priority', 'created', 'updated']
        });
        
        return {
            issues: results.issues as JiraIssue[],
            total: results.total
        };
    }

    async getIssue(issueKey: string): Promise<JiraIssue> {
        const issue = await this.client.findIssue(issueKey);
        return issue as JiraIssue;
    }

    async updateIssue(issueKey: string, data: Record<string, any>): Promise<void> {
        await this.client.updateIssue(issueKey, { fields: data });
    }

    async deleteIssue(issueKey: string): Promise<void> {
        await this.client.deleteIssue(issueKey);
    }
}