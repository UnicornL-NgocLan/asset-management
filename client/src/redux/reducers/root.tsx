import { combineReducers} from '@reduxjs/toolkit';
import authReducer from './authReducer'

const combinedReducer = combineReducers({
    auth: authReducer,
});

export const rootReducer = (state: Partial<{ auth: null | undefined; }> | undefined, action: any) => {
    if (action.type === "logout") {
       state = {};
    }
    return combinedReducer(state, action);
};