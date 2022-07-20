
const GetSettings = (name: string, defaultValue: string) => {
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

export const DeleteSettings = (name: string) => {
  if (!isServer) {
    const value = window.localStorage.getItem(name);
    if (value) localStorage.removeItem(name);
  }
};
const isServer = typeof window === 'undefined';
export default GetSettings;
