export default class EventBus {
  constructor() {
    this.events = {};
  }

  on(eventName, listener) {
    if(!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  emit(eventName, ...args) {
    if(this.events[eventName]) {
      this.events[eventName].forEach(listener => listener(...args));
    }
  }

  off(eventName, listener) {
    if(this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(l => l !== listener);
    }
  }

  clean(eventName) {
    if(this.events[eventName]) {
      delete this.events[eventName];
    }
  }

  once(eventName, listener) {
    const onceListener = (...args) => {
      listener(...args);
      this.off(eventName, onceListener);
    };
    this.on(eventName, onceListener);
  }
}
