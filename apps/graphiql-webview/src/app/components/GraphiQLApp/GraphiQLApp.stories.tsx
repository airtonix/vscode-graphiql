import React, { useState } from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { graphql } from 'msw';

import { schema, server } from '../../mocks';

import { GraphiQLApp } from './GraphiQLApp';

export default {
  title: 'AppView/GraphiQLApp',
  component: GraphiQLApp,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  parameters: {
    msw: {
      handlers: [
        graphql.query(/.*/, async (req, res, ctx) => {
          const result = await server.query(
            req.body?.query,
            req.body?.variables
          );
          return res(ctx.data(result));
        }),
      ],
    },
  },
} as ComponentMeta<typeof GraphiQLApp>;

const Template: ComponentStory<typeof GraphiQLApp> = (args) => {
  const [state, setState] = useState({ query: '' });
  return (
    <GraphiQLApp
      {...args}
      query={state.query}
      onEditQuery={(query) => setState({ ...state, query: query || '' })}
    />
  );
};

export const Primary = Template.bind({});
Primary.args = {
  schema: schema,
};

export const WithHost = Template.bind({});
WithHost.args = {
  schema: schema,
  host: 'http://localhost',
};
