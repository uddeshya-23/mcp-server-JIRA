export interface MCPResource {
    uri: string;
    mimeType: string;
    metadata: Record<string, any>;
}

export interface ListRequest {
    filter?: Record<string, any>;
    page?: number;
    limit?: number;
}

export interface ReadRequest {
    uri: string;
    include?: string[];
}

export interface UpdateRequest {
    uri: string;
    data: Record<string, any>;
}

export interface DeleteRequest {
    uri: string;
}

export interface ResourceListResponse {
    contents: MCPResource[];
}

export interface ResourceReadResponse {
    contents: [MCPResource];
}

export interface ErrorResponse {
    error: {
        message: string;
        code: string;
    };
}