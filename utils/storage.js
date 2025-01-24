class CustomStorage {
    constructor() {
      this.data = new Map();
    }
  
    getItem(key) {
      return this.data.get(key) || null;
    }
  
    setItem(key, value) {
      this.data.set(key, value);
    }
  
    removeItem(key) {
      this.data.delete(key);
    }
  
    clear() {
      this.data.clear();
    }
  }
  
  const customStorage = new CustomStorage();
  
  module.exports = customStorage;