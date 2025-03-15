import { LOGOUT } from '../action/logout';

const initialState = {
  email:null,
  isLoggedIn: false,
  auth:false
};

const authReducer = (state = initialState, action: { type: any; }) => {
  switch (action.type) {
    case LOGOUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default authReducer;
