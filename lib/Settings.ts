
export const getSettings = (name: string, defaultValue: string) => {
  if (!isServer) {
    const value = window.localStorage.getItem(name);
    if (value == null) UpdateSettings(name, defaultValue);
    return value || defaultValue;
  }
};

export const UpdateSettings = (name: string, value: string) => {
  if (!isServer) {
    localStorage.setItem(name, value);
  }
};

export const deleteSettings = (name: string) => {
  if (!isServer) {
    const value = window.localStorage.getItem(name);
    if (value) localStorage.removeItem(name);
  }
};
const isServer = typeof window === 'undefined';

export default getSettings;
