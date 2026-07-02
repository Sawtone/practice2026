class EventBus {
  constructor() {
    this.events = {};
  }

  on(eventName, listener) {
    if(!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  emit(eventName, data) {
    if(this.events[eventName]) {
      this.events[eventName].forEach(listener => listener(data));
    }
  }

  off(eventName, listener) {
    if(this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(l => l !== listener);
    }
  }

  once(eventName, listener) {
    const onceListener = (data) => {
      listener(data);
      this.off(eventName, onceListener);
    };
    this.on(eventName, onceListener);
  }

}
