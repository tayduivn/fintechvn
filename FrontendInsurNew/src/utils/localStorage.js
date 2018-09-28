export const loadState = (key) => {
  try {
    const jsonState: ?string = localStorage.getItem(key);
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
    localStorage.setItem(key, jsonState);
  } catch (err) {}
}

export const deleteState = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {}
}

export const clear = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {}
}