import { RESET_PROPS, SET_LAYOUT } from './constants';

export const resetProps = () => ({ type: RESET_PROPS });

export const setLayout = layout => ({
  type: SET_LAYOUT,
  layout,
});
