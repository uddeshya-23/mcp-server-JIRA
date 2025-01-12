# Jira MCP Server

A Model Context Protocol server implementation for Jira integration. This server allows AI models to interact with Jira through a standardized interface.

## Features

- Full Jira REST API integration
- Connection pooling for optimal performance
- Comprehensive error handling
- Type-safe implementation
- Built-in rate limiting
- Request logging and monitoring

## Installation

```bash
npm install @modelcontextprotocol/server-jira
```

## Configuration

The server requires the following environment variables:

```env
JIRA_HOST=your-domain.atlassian.net
JIRA_API_TOKEN=your-api-token
JIRA_EMAIL=your-email@domain.com
PORT=3000 # Optional, defaults to 3000
POOL_SIZE=10 # Optional, defaults to 10
```

## Usage

### Starting the Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

### API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/v1/issues/:issueKey` - Get issue details
- `GET /api/v1/sprint/current` - Get current sprint details
- `GET /api/v1/analytics/workload` - Get workload analytics

## Development

### Prerequisites

- Node.js 14 or higher
- npm 6 or higher

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`

### Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.