export const loadState = (key) => {
  try {
    const jsonState: ?string = sessionStorage.getItem(key);
    if (jsonState == null) return { };

    const session = JSON.parse(jsonState);
    return { ...session };
  } catch (err) {
    return { };
  }
};

export const saveState = (key, state) => {
  try {
    const jsonState = JSON.stringify(state);
    sessionStorage.setItem(key, jsonState);
  } catch (err) {
  }
}

export const deleteState = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (err) {
  }
}

export const clear = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (err) {
  }
}
