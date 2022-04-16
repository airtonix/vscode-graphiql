---
to: packages/<%= domain %>s/<%= code %>/src/<%= componentName %>.tsx
---
/** @jsx jsx */
import { jsx } from '@emotion/react';

export type <%= componentName %>Props = {}

export const <%= componentName %>: React.FC<<%= componentName %>Props> = (props) => (
  <div></div>
);
