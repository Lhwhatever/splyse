import { combineReducers } from 'redux';
import importWizard from './ducks/ImportWizard';
import alertReducer from './ducks/alert';

const rootReducer = combineReducers({
    importWizard,
    alertReducer,
});

export default rootReducer;
