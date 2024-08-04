import { combineReducers} from '@reduxjs/toolkit';
import authReducer from './authReducer'
import companyReducer from './companyReducer'

const combinedReducer = combineReducers({
    auth: authReducer,
    companies:companyReducer,
});

export const rootReducer = (state: Partial<{ auth: null | undefined; }> | undefined, action: any) => {
    if (action.type === "logout") {
       state = {};
    }
    return combinedReducer(state, action);
};