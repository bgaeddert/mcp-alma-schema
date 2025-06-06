# Alma Schema MCP Server

This is a Model Context Protocol (MCP) server that provides tools for accessing and querying MongoDB database schemas. It allows AI assistants to discover and understand your database structure directly through the MCP interface.

## Features

- Get database context information
- List available collection schemas
- Retrieve detailed JSON schema for specific collections
- Search for collections by name with fuzzy matching

## Installation

### Using npx (Recommended)

The easiest way to use this MCP server is through npx:

```bash
npx mcp-alma-schema
```

### Manual Installation

If you prefer to install it globally:

```bash
npm install -g mcp-alma-schema
```

Then you can run it with:

```bash
mcp-alma-schema
```

### From GitHub

You can also install directly from GitHub:

```bash
npx bgaeddert/mcp-alma-schema
```

### For Development

If you want to contribute or modify the code:

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-alma-schema.git
cd mcp-alma-schema

# Install dependencies
npm install

# Build the project
npm run build

# Run locally
npm start
```

## Configuration

The server can be configured using environment variables:

- `API_BASE_URL`: The base URL for the API endpoints (defaults to `http://localhost`)

Example configuration:

```bash
# Using environment variable
export API_BASE_URL=http://localhost:6970
npx mcp-alma-schema

# Or inline
API_BASE_URL=http://localhost:6970 npx mcp-alma-schema
```

## Usage as an MCP Tool

### Via CLI

The simplest way to run the MCP server:

```bash
npx mcp-alma-schema
```

### Via Model Integration

#### For Claude Desktop

To integrate with Claude Desktop, add the server to your Claude Desktop configuration file located at:
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

## You can use the GitHub version directly:

```json
{
  "mcpServers": {
    "mcp-alma-schema": {
      "command": "npx",
      "args": [
        "bgaeddert/mcp-alma-schema"
      ],
      "env": {
        "API_BASE_URL": "http://localhost:6970"
      }
    }
  }
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

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request