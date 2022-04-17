import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { graphql } from 'msw';

import { GraphiQLApp } from './GraphiQLApp';
import { server, schema } from '../../mocks';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'AppView/GraphiQLApp',
  component: GraphiQLApp,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof GraphiQLApp>;

const Template: ComponentStory<typeof GraphiQLApp> = (args) => {
  return <GraphiQLApp {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  schema: schema,
};
Primary.parameters = {
  msw: {
    handlers: [
      graphql.query(/.*/, async (req, res, ctx) => {
        const result = await server.query(req.body?.query, req.body?.variables);
        return res(ctx.data(result));
      }),
    ],
  },
};
