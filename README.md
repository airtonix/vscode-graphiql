# VScode GraphQL Explorer

This VScode extension will allow you to explore your locally stored `*.graphql` typedef schema files with GraphiQL.

This is done by:
1. right clicking a `*.graphql` (or any file associated with the `GraphQL` file grammar type) and,
2. choosing `Explore Schema`

## Features

- doesn't rely on network connection to server.
- supports monorepos by focusing on local `.schema` files.
- server connection config UI if you want to run your queries against a server.
- supports simple jwt token auth at the moment.
- queries, variables, headers remembered per file.

## Roadmap

- [ ] workspace server connection profiles
- [ ] global server connection profiles
- [ ] configurable server authentication strategies (basic auth, oauth, etc)
- [ ] other ways to launch graphiql panel (command pallete, file pane toolbar)
