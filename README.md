# Alma Schema MCP Server

This is a Model Context Protocol (MCP) server that provides tools for accessing and querying MongoDB database schemas. It allows AI assistants to discover and understand your database structure directly through the MCP interface.

## Features

- Get database context information
- List available collection schemas
- Retrieve detailed JSON schema for specific collections
- Search for collections by name with fuzzy matching

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-alma-schema.git
cd mcp-alma-schema

# Install dependencies
npm install
```

## Configuration

The server can be configured using environment variables:

- `API_BASE_URL`: The base URL for the API endpoints (defaults to `http://localhost`)

Example configuration:

```bash
export API_BASE_URL=http://your-api-server:3000
```

## Usage as an MCP Tool

### Via CLI

1. Build the project:
   ```bash
   npm run build
   ```

2. Run the MCP server:
   ```bash
   npm start
   ```

3. Connect to the MCP server using an MCP-compatible client.

### Via Model Integration

#### For Claude Desktop

To integrate with Claude Desktop, add the server to your Claude Desktop configuration file located at:
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

Example configuration:

```json
{
  "mcpServers": {
    "mcp-alma-schema": {
      "command": "node",
      "args": [
        "/path/to/mcp-alma-schema/dist/index.js"
      ],
      "env": {
        "API_BASE_URL": "http://your-api-server:3000"
      }
    }
  }
}
```

Replace `/path/to/mcp-alma-schema/dist/index.js` with the absolute path to the built index.js file.

#### For OpenAI or other supported models

To integrate with OpenAI or other supported models, add this to your MCP configuration:

```json
{
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "alma-schema",
        "description": "Access MongoDB schema information",
        "parameters": {}
      }
    }
  ]
}
```

## Available Tools

### get-database-context

Get context information about a specific database.

Parameters:
- `database` (string): The name of the database

### list-collection-schemas

Get a list of mongo collection schemas in the database.

Parameters:
- `database` (string): The name of the database

### get-collection-schema

Get the JSON schema for a specific mongo database collection.

Parameters:
- `database` (string): The name of the database
- `collection` (string): The name of the collection

### search-collections

Search for collections in a database by name with fuzzy matching fallback.

Parameters:
- `database` (string): The name of the database
- `search` (string): Search string to match against collection names

## Example Usage

Using the AI assistant:

```
I need to understand the database structure. What collections are available in the "users" database?

> Using tool: list-collection-schemas with {"database": "users"}
> The available collection schemas in the "users" database are:
> accounts
> profiles
> sessions
> preferences

Tell me about the schema for the profiles collection.

> Using tool: get-collection-schema with {"database": "users", "collection": "profiles"}
> [Returns JSON schema for profiles collection]
```
## Private RepositoryThis is a private repository. All rights reserved. Not licensed for distribution or use without explicit permission.