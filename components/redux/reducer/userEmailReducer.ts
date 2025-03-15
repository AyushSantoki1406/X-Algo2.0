import {SET_EMAIL} from '../action/email_action'
import { SET_XID } from "../action/email_action";

const initialState = {
    email :null,
    XId:null
}

export const emailReducer = ( state = initialState , action: any ) => {
    switch(action.type){
        case SET_EMAIL:
            return{
                ...state,
                email:action.payload
            };

            case SET_XID:
      return {
        ...state,
        XId: action.payload,
      };
            default:
                return state;
    }
}