import React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { ConnectionConfigPanel } from './ConnectionConfigPanel';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'VscodeGraphqlExplorerView/ConnectionConfigPanel',
  component: ConnectionConfigPanel,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ConnectionConfigPanel>;

const Template: ComponentStory<typeof ConnectionConfigPanel> = (args) => {
  return <ConnectionConfigPanel {...args} />;
};

export const Empty = Template.bind({});
Empty.args = {};

export const InitialData = Template.bind({});
InitialData.args = {
  uri: 'https://something/',
  token: 'a token',
};
