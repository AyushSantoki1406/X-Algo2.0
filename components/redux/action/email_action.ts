export const SET_EMAIL = 'SET_EMAIL';
export const SET_XID = "SET_XID";

export const setEmail = (email: any) => ({
  type: SET_EMAIL,
  payload: email
});

export const setXId = (XId: any) => ({
  type: SET_XID,
  payload: XId,
});