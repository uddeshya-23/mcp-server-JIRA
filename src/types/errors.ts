export class MCPError extends Error {
    constructor(
        public status: number,
        message: string,
        public code: string = 'MCP_ERROR'
    ) {
        super(message);
        this.name = 'MCPError';
    }
}