import { combineReducers } from 'redux';
import importWizardReducer from './ducks/ImportWizard';
import alertReducer from './ducks/alert';
import trackManagerReducer from './ducks/TrackManager';

const rootReducer = combineReducers({
    importWizard: importWizardReducer,
    alert: alertReducer,
    trackManager: trackManagerReducer,
});

export default rootReducer;
