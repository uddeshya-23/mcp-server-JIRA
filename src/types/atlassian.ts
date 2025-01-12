export interface AtlassianResource {
    type: 'jira.issue' | 'jira.project' | 'jira.sprint';
    id: string;
    uri: string;
    metadata: Record<string, any>;
}

export interface AtlassianClient {
    getResource(uri: string): Promise<AtlassianResource>;
    listResources(query: any): Promise<AtlassianResource[]>;
    updateResource(uri: string, data: any): Promise<AtlassianResource>;
    deleteResource(uri: string): Promise<void>;
}