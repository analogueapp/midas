const initialState = true;

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_MODAL':
      return !state;
    default:
      return state;
  }
};
