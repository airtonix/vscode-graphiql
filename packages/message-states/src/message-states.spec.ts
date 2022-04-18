import { MessageStates } from './message-states';

describe('messageStates', () => {
  it('should work', () => {
    expect(MessageStates).toHaveProperty('SAVE_CONNECTION');
  });
});
