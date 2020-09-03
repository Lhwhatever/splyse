import { combineReducers } from 'redux';
import importWizard from './ducks/ImportWizard';

const rootReducer = combineReducers({
    importWizard,
});

export default rootReducer;
