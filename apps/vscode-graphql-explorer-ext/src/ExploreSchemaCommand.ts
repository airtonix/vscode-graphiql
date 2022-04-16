import type { ExtensionContext } from 'vscode';
import { ExploreSchemaWebview } from './ExploreSchemaWebview';

export const ExploreSchemaCommand = (context: ExtensionContext) => {
  return (commandContext: Record<string, any>) => {
    ExploreSchemaWebview.createOrShow(
      context.extensionPath,
      commandContext.path,
      context.extensionMode
    );
  };
};
