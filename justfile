export PATH := "./node_modules/.bin:" + env_var('PATH')

default:
    @just --list

# Project setup
setup:
    @echo 'Project Setup!'
    yarn install
    manypkg check
    husky install

# Record a changeset
change:
    changeset

build:
    preconstruct build
    just view build
    cd apps/graphiql-ext
    vsce package

# Process recorded changesets
release:
    changeset version

prcheck:
    eslint . --ext tsx,ts
    jest --coverage --passWithNoTests

generate *command='help':
    hygen {{command}}

clean:
    git clean -xdf

fix:
    manypkg fix

test:
    jest

# AppShortcut: Extension VScode Graphql Explorer
ext *command='dev':
    yarn workspace graphiql {{command}}

view *command='dev':
    yarn workspace @vscodegraphqlexplorer/vscode-graphql-explorer-view {{command}}
