import { commands, ExtensionContext } from 'vscode';
import { COMMAND_EXPLORE } from './constants';
import { ExploreSchemaCommand } from './ExploreSchemaCommand';

console.log('in memory');

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(COMMAND_EXPLORE, ExploreSchemaCommand(context))
  );
}

export function deactivate() {}
