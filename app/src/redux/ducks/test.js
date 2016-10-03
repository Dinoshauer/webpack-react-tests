'use strict';
import { createAction, handleActions } from 'redux-actions';
import Imm from 'immutable';

export const example = createAction('EXAMPLE');

export default handleActions({
  EXAMPLE: (state, { payload }) => Imm.fromJS(state)
    .merge(payload)
    .toJS()
}, {});
