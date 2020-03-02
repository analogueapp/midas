const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_TOKEN':
      return action.token
    default:
      return state
  }
}
