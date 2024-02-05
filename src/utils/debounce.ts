// TODO: verify this
// eslint-disable-next-line no-unused-vars
export const debounce = (callback: (args: any) => void, wait = 500) => {
  let timeoutId: any = null;
  return (...args: any) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};
