const initialState = sessionStorage.getItem("analogue-jwt");

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_TOKEN':
      sessionStorage.setItem("analogue-jwt", action.token)
      return action.token
    default:
      return state
  }
}
