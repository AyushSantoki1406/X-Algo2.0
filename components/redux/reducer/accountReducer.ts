import { LOGIN_SUCCESS, UPDATE_BALANCE, ANGEL_ID, DELETE, BROKER_LOGIN, AUTH, ADDITEM, REMOVEITEM, USERSCHEMAREDUX, ALLCLIENTDATA } from '../action/action';
import { LOGOUT } from '../action/logout';

interface UserSchema {
  XalgoID: string; // Adjust type based on your actual data structure
}

interface AccountState {
  items: any[];
  balance: number;
  isLoggedIn: boolean;
  allClientData: Record<string, any>;
  angelId: string;
  angelPass: string;
  brokerLogin: boolean;
  auth: boolean;
  userSchemaRedux: UserSchema;
  userData?: {
    data: {
      data: {
        net: any;
      };
    };
    id: any;
    pass: any;
  };
}

const initialState: AccountState = {
  items: [],
  balance: 0,
  isLoggedIn: false,
  allClientData: {},
  angelId: '',
  angelPass: '',
  brokerLogin: false,
  auth: false,
  userSchemaRedux: {} as UserSchema,
};

const accountReducer = (state = initialState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        userData: action.payload,
        balance: action.payload?.data?.data?.net || state.balance,
      };
    case UPDATE_BALANCE:
      return {
        ...state,
        balance: action.payload,
      };
    case LOGOUT:
      return {
        ...initialState,
        isLoggedIn: false,
      };
    case DELETE:
      return {
        ...state,
        isLoggedIn: false,
      };
    case ANGEL_ID:
      return {
        ...state,
        angelId: action.payload.id,
        angelPass: action.payload.pass,
      };
    case BROKER_LOGIN:
      return {
        ...state,
        brokerLogin: action.payload,
      };
    case AUTH:
      return {
        ...state,
        auth: action.payload,
      };
    case USERSCHEMAREDUX:
      return {
        ...state,
        userSchemaRedux: action.payload,
      };
    case ADDITEM:
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case REMOVEITEM:
      return {
        ...state,
        items: [],
      };
    case ALLCLIENTDATA:
      return {
        ...state,
        allClientData: action.payload,
      };
    default:
      return state;
  }
};

export default accountReducer;
