import { createAction } from 'redux-actions';
const actionTypes = {
  REQUEST : 'REQUEST',
  SUCCESS : 'SUCCESS',
  FAILURE : 'FAILURE',
  CANCEL : 'CANCEL',
}

const createAsyncAction = (type) => {
  const Action = {
    ORIGIN : type
  }
  Object.keys(actionTypes).forEach( key => {
    Action[key] = createAction(`${type}_${actionTypes[key]}`);
  });
  return Action;
}

export default createAsyncAction;
