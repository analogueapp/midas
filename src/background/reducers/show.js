const initialState = false;

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_MODAL':
      return action.show ? action.show : !state;
    default:
      return state;
  }
};
