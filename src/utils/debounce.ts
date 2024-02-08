let debounceCallback: any = "";
// eslint-disable-next-line no-unused-vars
export const debounce = (callback: (args: any) => void, wait = 3000) => {
  let timeoutId: any = null;
  return (...args: any) => {
    if (debounceCallback.toString() === callback.toString()) {
      debounceCallback = callback;
      return;
    }
    window.clearTimeout(timeoutId);
    debounceCallback = callback;
    timeoutId = window.setTimeout(() => {
      if (debounceCallback) {
        debounceCallback.apply(null, args);
      }
      debounceCallback = "";
    }, wait);
  };
};
