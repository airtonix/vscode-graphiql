---
to: packages/<%= domain %>/<%= code %>/tsconfig.json
---
{
  "extends": "../../../tsconfig.json",
  "include": ["./src"],
  "exclude": ["node_modules"]

}
