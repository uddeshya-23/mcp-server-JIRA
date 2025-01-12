export interface MCPResource {
    // Required fields
    uri: string;                      // Unique identifier
    mimeType: string;                 // Resource type identifier
    name: string;                     // Display name
    metadata: {                       // Resource-specific data
        id: string;
        type: string;
        [key: string]: any;
    };
    
    // Optional fields
    description?: string;             // Human-readable description
    relationships?: Relationship[];    // Connected resources
    content?: any;                    // Resource-specific content
    parentUri?: string;              // Parent resource reference
}

export interface Relationship {
    type: string;       // Relationship type (e.g., "blockedBy", "relatesTo")
    target: string;     // Target resource URI
    direction: 'inward' | 'outward';
}

export interface ResourceQuery {
    filter?: {
        type?: string[];             // Resource types to include
        status?: string[];           // Status values to filter
        parent?: string;             // Parent resource URI
        [key: string]: any;
    };
    page?: number;                   // Page number for pagination
    limit?: number;                  // Items per page
    sort?: {                         // Sorting criteria
        field: string;
        direction: 'asc' | 'desc';
    };
}