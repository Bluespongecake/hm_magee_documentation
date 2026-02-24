# Document Content

Folder structure mirrors the site. Add projects and documents here:

```
content/
  {project-name}/
    {document-name}.tsx
    another-doc.tsx
  another-project/
    overview.tsx
```

**Workflow:**
1. Create a document (markdown, etc.)
2. Give it to an AI agent to convert to TSX using document-template components
3. Put the `.tsx` file in the project folder
4. Run `npm run generate-content` (or start dev/build — it runs automatically)
5. Site renders at `/{project}/{document}`

**Rules (see AGENTS.md):**
- Only import from `../../app/components/document-template` (adjust `../` count by depth)
- Only use predefined components and design-token classes (`text-positive`, `text-negative`)
- No new components, inline styles, or raw values
- One default export per file
