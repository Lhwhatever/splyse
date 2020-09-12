import { combineReducers } from 'redux';
import importWizardReducer from './ducks/ImportWizard';
import alertReducer from './ducks/alert';

const rootReducer = combineReducers({
    importWizard: importWizardReducer,
    alert: alertReducer,
});

export default rootReducer;
