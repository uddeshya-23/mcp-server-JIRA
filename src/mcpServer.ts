import { Server, Request, Result, Notification } from "@modelcontextprotocol/typescript-sdk";
import { Resource } from "@modelcontextprotocol/typescript-sdk";
import { JiraService } from './services/jira';

interface ListResourcesResult extends Result {
    resources: Resource[];
    total: number;
    page: number;
    limit: number;
}

interface ResourceResult extends Result {
    resource: Resource;
}

export class JiraMCPServer extends Server {
    constructor(private jiraService: JiraService) {
        super({
            version: '1.0.0',
            supportedMethods: ['list', 'read', 'update', 'delete']
        });
    }

    async handleRequest(request: Request): Promise<Result> {
        switch (request.method) {
            case 'list':
                return this.handleListRequest(request);
            case 'read':
                return this.handleReadRequest(request);
            case 'update':
                return this.handleUpdateRequest(request);
            case 'delete':
                return this.handleDeleteRequest(request);
            default:
                throw new Error(`Unsupported method: ${request.method}`);
        }
    }

    private async handleListRequest(request: Request): Promise<ListResourcesResult> {
        const query = request.params?.query || '';
        const page = request.params?.page || 1;
        const limit = request.params?.limit || 50;
        const startAt = (page - 1) * limit;

        const { issues, total } = await this.jiraService.searchIssues(query, startAt, limit);
        
        return {
            resources: issues.map(this.mapToResource),
            total,
            page,
            limit
        };
    }

    private async handleReadRequest(request: Request): Promise<ResourceResult> {
        const uri = request.params?.uri;
        if (!uri) throw new Error('URI is required');

        const issueKey = this.getIssueKeyFromUri(uri);
        const issue = await this.jiraService.getIssue(issueKey);
        
        return {
            resource: this.mapToResource(issue)
        };
    }

    private async handleUpdateRequest(request: Request): Promise<ResourceResult> {
        const uri = request.params?.uri;
        const data = request.params?.data;
        
        if (!uri) throw new Error('URI is required');
        if (!data) throw new Error('Update data is required');

        const issueKey = this.getIssueKeyFromUri(uri);
        await this.jiraService.updateIssue(issueKey, data);
        const updatedIssue = await this.jiraService.getIssue(issueKey);
        
        return {
            resource: this.mapToResource(updatedIssue)
        };
    }

    private async handleDeleteRequest(request: Request): Promise<Result> {
        const uri = request.params?.uri;
        if (!uri) throw new Error('URI is required');

        const issueKey = this.getIssueKeyFromUri(uri);
        await this.jiraService.deleteIssue(issueKey);
        
        return {};
    }

    private mapToResource(issue: any): Resource {
        return {
            uri: `jira://issue/${issue.key}`,
            name: issue.fields.summary,
            description: issue.fields.description || '',
            mimeType: 'application/vnd.jira.issue+json',
            attributes: {
                key: issue.key,
                status: issue.fields.status.name,
                assignee: issue.fields.assignee?.displayName || 'Unassigned',
                priority: issue.fields.priority?.name || 'None',
                created: issue.fields.created,
                updated: issue.fields.updated
            }
        };
    }

    private getIssueKeyFromUri(uri: string): string {
        const parts = uri.split('/');
        const issueKey = parts[parts.length - 1];
        if (!issueKey) {
            throw new Error('Invalid resource URI');
        }
        return issueKey;
    }
}