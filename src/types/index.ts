

export interface JiraConfig {
    host: string;
    apiToken: string;
    email: string;
}

export interface JiraIssue {
    key: string;
    fields: {
        summary: string;
        status: { name: string };
        assignee?: { displayName: string };
        priority?: { name: string };
        created: string;
        updated: string;
    };
}