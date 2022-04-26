# JUSTFILE
# https://github.com/casey/just
#

export PATH := justfile_directory() + "/node_modules/.bin:" + env_var('PATH')

default:
    @just --list

# Project setup
setup:
    @echo '⛳ Begin project setup'
    pnpm install
    manypkg check
    husky install

# Record a changeset
change *command='':
    changeset {{command}}

build:
    nx run-many --target=build --all

# Process recorded changesets
release:
    changeset version

prcheck:
    eslint . --ext tsx,ts
    jest --coverage --passWithNoTests

clean:
    git clean -xdf

fix:
    @echo "👨‍⚕️ Fixing monorepo problems"
    manypkg fix

nx *command='':
    nx {{command}}

test:
    jest

# AppShortcut: Extension VScode Graphql Explorer
ext *command='dev':
    yarn workspace @vscodegraphiql/extension {{command}}

view *command='dev':
    yarn workspace @vscodegraphiql/webview {{command}}
