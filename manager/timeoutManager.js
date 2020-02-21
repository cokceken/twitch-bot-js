module.exports = new class TimeOutManager {
    constructor() {
        this.keys = {
            questionEnd: null,
        };
    }

    Clear(key) {
        if (key == null) return;
        clearTimeout(key);
    }

    Set(delegate, timeout) {
        return setTimeout(delegate, timeout);
    }
};
