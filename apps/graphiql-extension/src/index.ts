import { ExtensionContext, commands } from 'vscode';

import { COMMAND_EXPLORE } from './constants';
import { ExploreSchemaCommand } from './ExploreSchemaCommand';

console.log(COMMAND_EXPLORE);
export function activate(context: ExtensionContext) {
  console.log(COMMAND_EXPLORE, 'activated');
  context.subscriptions.push(
    commands.registerCommand(COMMAND_EXPLORE, ExploreSchemaCommand(context))
  );
}

export function deactivate() {}
