---
to: packages/<%= domain %>/<%= code %>/package.json
sh: pnpm install
---
{
  "name": "<%= package_name %>",
  "version": "0.0.1",
  "main": "src/index.ts",
  "private": true,
  "dependencies": {
    "@emotion/react": "^11.4.0",
    "react": "^17.0.2"
  }
}
