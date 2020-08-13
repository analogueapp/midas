var initialState = null
chrome.storage.local.get("analogueJWT", function(token) {
  initialState = (Object.keys(token).length !== 0) ? { token: token} : null
})

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      chrome.storage.local.set({"analogueJWT": action.user.token}, function() {
      })
      return {
        ...state,
        ...action.user,
      }
    default:
      return state
  }
}
