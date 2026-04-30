@AGENTS.md

## Project info

- **Lokaal pad:** /Users/elinetibboel/Brein/Claude/Code/harvey_spector_sprint
- **Vercel project:** harvey-spector-sprint
- **Vercel account:** eline-1418
- **GitHub gebruiker:** ElineMare (ElineMare@users.noreply.github.com)
- **Sanity project ID:** v1c8g0jp
- **Sanity dataset:** production

## MCP verbindingen

- **Vercel MCP:** verbonden via OAuth (`plugin:vercel@claude-plugins-official`)
- **GitHub MCP:** verbonden via `@modelcontextprotocol/server-github` (user-scope, token van `gh` CLI — account: ElineMare, scopes: repo, read:org, gist, workflow)
- **Sanity MCP:** verbonden via `https://mcp.sanity.io`
- **Figma MCP:** verbonden via `plugin:figma@claude-plugins-official`

### MCP server toevoegen via Ship Studio UI

Via het MCP-icoon in Ship Studio → tabblad **Add** → plak het commando **zonder** `claude mcp add` prefix.

Kies scope:
- **User** = beschikbaar in alle projecten
- **Project** = alleen dit project (opgeslagen in `.mcp.json`)

Voorbeeld voor GitHub MCP (User scope):
```
-e GITHUB_PERSONAL_ACCESS_TOKEN=<token> github -- npx -y @modelcontextprotocol/server-github
```

Token ophalen via terminal: `gh auth token`
