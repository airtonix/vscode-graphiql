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
    nx run-many \
        --target=build \
        --all

# Process recorded changesets
release:
    changeset version

lint:
    nx affected \
        --target=lint \
        --base=origin/master

test:
    nx affected \
        --target=test \
        --base=origin/master \
        -- --ci --reporters=default --reporters=jest-junit

typecheck:
    nx affected \
        --target=typecheck \
        --base=origin/master

workspacelint:
    nx workspace-lint \
        --base=origin/master

prcheck: lint test typecheck

clean:
    git clean -xdf

fix:
    @echo "👨‍⚕️ Fixing monorepo problems"
    manypkg fix

nx *command='':
    nx {{command}}

# AppShortcut: Extension VScode Graphql Explorer
ext *command='dev':
    yarn workspace @vscodegraphiql/extension {{command}}

view *command='dev':
    yarn workspace @vscodegraphiql/webview {{command}}
