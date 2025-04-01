import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Define API base URL from environment variable or use default
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost';

// Create server instance
const server = new McpServer({
    name: "alma-schema",
    version: "1.0.1",
});


// Register a tool to get database context
server.tool(
    "get-database-context",
    "Get the context information about a specific database",
    {
        database: z.string().describe("The name of the database"),
    },
    async ({ database }) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/database-context?database=${database}`
            );
            
            if (!response.ok) {
                const error = await response.json();
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error retrieving database context: ${
                                error.message || "Unknown error"
                            }`,
                        },
                    ],
                };
            }

            const contextData = await response.json();
            const jsonString = JSON.stringify(contextData, null, 2);

            return {
                content: [
                    {
                        type: "text",
                        text: `Database Context for "${database}":\n\`\`\`json\n${jsonString}\n\`\`\``,
                    },
                ],
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error retrieving database context: ${
                            error.message || "Unknown error"
                        }`,
                    },
                ],
            };
        }
    }
);

// Register a tool to get database collections
server.tool(
    "list-collection-schemas",
    "Get a list of mongo collection schemas in the database",
    {
        database: z.string().describe("The name of the database"),
    },
    async ({database}) => {
        const collections = await fetch(
            `${API_BASE_URL}/database-collections?database=${database}`
        ).then((res) => res.json());

        const formattedCollections = collections.map(
            (collection: any) => collection + "\n"
        );

        const resultText = `The available collection schemas in the "${database}" database are:\n` +
            formattedCollections.join("");

        // Return in the format expected by the MCP SDK
        return {
            content: [
                {
                    type: "text",
                    text: resultText,
                },
            ],
        };
    }
);

// Register a tool to get database collection schema
server.tool(
    "get-collection-schema",
    "Get the JSON schema for a specific mongo database collection",
    {
        database: z.string().describe("The name of the database"),
        collection: z.string().describe("The name of the collection"),
    },
    // Fix: Return type now matches what the MCP SDK expects
    async ({ database, collection }) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/database-collection-schema?database=${database}&collection=${collection}`
            );
            
            if (!response.ok) {
                const error = await response.json();
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error retrieving schema: ${
                                error.message || "Unknown error"
                            }`,
                        },
                    ],
                };
            }

            const schema = await response.json();

            // Create a readable summary of the schema
            const schemaTitle = schema.title || collection;
            const schemaDescription =
                schema.description || "No description available";

            // Convert JSON to string for the second content item
            const jsonString = JSON.stringify(schema, null, 2);

            return {
                content: [
                    {
                        type: "text",
                        text: `\`\`\`json\n${jsonString}\n\`\`\``,
                    },
                ],
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error retrieving schema: ${
                            error.message || "Unknown error"
                        }`,
                    },
                ],
            };
        }
    }
);

// Register a tool to search for collections by name
server.tool(
    "search-collections",
    "Search for collections in a database by name. Falls back to a fuzzy search if no exact match is found.",
    {
        database: z.string().describe("The name of the database"),
        search: z.string().describe("Search string to match against collection names"),
    },
    async ({ database, search }) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/database-collection-search?database=${database}&search=${search}`
            );
            
            if (!response.ok) {
                const error = await response.json();
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error searching collections: ${
                                error.message || "Unknown error"
                            }`,
                        },
                    ],
                };
            }

            const searchResults = await response.json();
            
            let resultText = '';
            
            if (searchResults.info) {
                resultText += `${searchResults.info}\n\n`;
            }
            
            if (searchResults.matches && searchResults.matches.length > 0) {
                resultText += `Found ${searchResults.count} collection(s) matching "${search}" in database "${database}":\n\n`;
                
                searchResults.matches.forEach((match: { collection: string; similarity: number }) => {
                    resultText += `- ${match.collection} (similarity: ${match.similarity.toFixed(2)})\n`;
                });
            } else {
                resultText += searchResults.warning || `No collections matching "${search}" found in database "${database}".`;
            }

            return {
                content: [
                    {
                        type: "text",
                        text: resultText,
                    },
                ],
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error searching collections: ${
                            error.message || "Unknown error"
                        }`,
                    },
                ],
            };
        }
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
