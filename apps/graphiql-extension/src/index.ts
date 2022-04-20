import { ExtensionContext, commands } from 'vscode';

import { COMMAND_EXPLORE } from './constants';
import { ExploreSchemaCommand } from './ExploreSchemaCommand';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(COMMAND_EXPLORE, ExploreSchemaCommand(context))
  );
}

export function deactivate() {}
