const token = sessionStorage.getItem("analogue-jwt")
const initialState = token ? { token: token } : null

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      sessionStorage.setItem("analogue-jwt", action.user.token)
      return {
        ...state,
        ...action.user,
      }
    default:
      return state
  }
}
