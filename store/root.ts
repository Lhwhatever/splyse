import { combineReducers } from 'redux';
import importWizardReducer from './ducks/ImportWizard';
import alertReducer from './ducks/alert';
import songManagerReducer from './ducks/SongManager';

const rootReducer = combineReducers({
    importWizard: importWizardReducer,
    alert: alertReducer,
    songManager: songManagerReducer,
});

export default rootReducer;
