---
to: <%= domain %>/<%= code %>/package.json
sh: yarn install
---
{
  "name": "<%= package_name %>",
  "version": "0.0.1",
  "main": "src/index.ts",
  "private": true
}
