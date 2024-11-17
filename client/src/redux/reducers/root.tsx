import { combineReducers} from '@reduxjs/toolkit';
import authReducer from './authReducer'
import companyReducer from './companyReducer'
import searchInputReducer from './searchInputReducer'
import officeReducer from './officeReducer'
import departmentReducer from './departmentReducer'

const combinedReducer = combineReducers({
    auth: authReducer,
    companies:companyReducer,
    searchInput:searchInputReducer,
    offices:officeReducer,
    departments:departmentReducer
});

export const rootReducer = (state: Partial<{ auth: null | undefined; }> | undefined, action: any) => {
    if (action.type === "logout") {
       state = {};
    }
    return combinedReducer(state, action);
};