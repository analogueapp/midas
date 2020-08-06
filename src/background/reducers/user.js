let initialState = null
chrome.storage.local.get("analogue-jwt", function(token) {
  if (Object.keys(token).length !== 0) { setState(token) }
})

function setState(token) {
  initialState = { token: token}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      chrome.storage.local.set({"analogue-jwt": action.user.token})
      return {
        ...state,
        ...action.user,
      }
    default:
      return state
  }
}
