# MCP-Server-Jira Documentation

## Overview
MCP-Server-Jira implements the Model Context Protocol (MCP) for Jira integration, enabling seamless resource access and manipulation through a standardized interface.

## Resource Types

### Jira Issue
```typescript
{
  mimeType: "application/vnd.jira.issue+json",
  attributes: ["summary", "description", "status", ...]
}
```

### Jira Project
```typescript
{
  mimeType: "application/vnd.jira.project+json",
  attributes: ["key", "name", "description", ...]
}
```

## API Endpoints

### Resources
- `GET /resources/:uri` - Retrieve resource
- `POST /resources/list` - List resources with filtering
- `PATCH /resources/:uri` - Update resource
- `DELETE /resources/:uri` - Delete resource

### Relationships
- `POST /resources/:uri/relationships` - Create relationship

### Inspector
- `GET /mcp-inspector` - Get server metadata and capabilities

## Authentication
Uses Jira API token authentication. Configure in `.env`:
```
JIRA_HOST=your-domain.atlassian.net
JIRA_EMAIL=your-email
JIRA_API_TOKEN=your-token
```

## Error Handling
- 400: Validation errors
- 404: Resource not found
- 500: Internal server error

Error response format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```