export default class Debounce {
  constructor() {
    this.debounceId = null;
  }
  startDebounce(func, delay) {
    this.stopDebounce()
    const args = arguments;
    const that = this;
    this.debounceId = setTimeout(() => {
        func.apply(that, args);
    }, delay);
  }
  stopDebounce() {
    clearTimeout(this.debounceId);
  }
}
