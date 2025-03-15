export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const UPDATE_BALANCE = 'UPDATE_BALANCE';
export const ANGEL_ID='ANGEL_ID';
export const DELETE='DELETE';
export const BROKER_LOGIN='BROKER_LOGIN'
export const AUTH='AUTH'
export const ADDITEM='ADDITEM'
export const REMOVEITEM='REMOVEITEM'
export const USERSCHEMAREDUX='USERSCHEMAREDUX'
export const ALLCLIENTDATA='ALLCLIENTDATA'

export const loginSuccess = (userData: any) => ({
  type: LOGIN_SUCCESS,
  payload: userData
});

export const updateBalance = (newBalance: any) => ({
  type: UPDATE_BALANCE,
  payload: newBalance
});

export const angelId = (angelData: any)=>({
  type: ANGEL_ID,
  payload: angelData
})


export const deleteBroker=(del: any)=>({
  type:DELETE,
  payload:del
})

export const brokerLogin=(blogin: any)=>({
  type:BROKER_LOGIN,
  payload:blogin
})
export const auth=(a: any)=>({
  type:AUTH,
  payload:a
})

export const addItem=(item: any)=>({
  type:ADDITEM,
  payload:item
})

export const removeItem=()=>({
  type: REMOVEITEM,
  // payload:removeitems
})

export const userSchemaRedux=(schema: any)=>({
  type: USERSCHEMAREDUX,
  payload: schema
})

export const allClientData=(item: any)=>({
  type: ALLCLIENTDATA,
  payload: item
})