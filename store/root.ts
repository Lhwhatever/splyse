import { combineReducers } from 'redux';
import alertReducer from './ducks/alert';
import importWizardReducer from './ducks/ImportWizard';
import resultsReducer from './ducks/results';
import trackManagerReducer from './ducks/TrackManager';

const rootReducer = combineReducers({
    importWizard: importWizardReducer,
    alert: alertReducer,
    trackManager: trackManagerReducer,
    results: resultsReducer,
});

export default rootReducer;
