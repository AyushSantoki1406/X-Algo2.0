import {combineReducers} from 'redux'
import accountReducer from './accountReducer';
import {emailReducer} from './userEmailReducer'
import authReducer from './logoutReducer';
const rootReducer = combineReducers({
    email:emailReducer,
  logout:authReducer,
    account: accountReducer,

})

export default rootReducer