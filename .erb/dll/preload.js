/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*****************************!*\
  !*** ./src/main/preload.ts ***!
  \*****************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const electron_1 = __webpack_require__(/*! electron */ "electron");
const validChannels = {
    // From render to main.
    'send': [
        'connect:port',
        'disconnect:port',
        'kill:app',
        'reload:app'
    ],
    // From main to render.
    'receive': [
        'port:status',
        'asynchronous-message',
        'port:connection:data',
        'reload:app:reply'
    ],
    // From render to main and back again.
    'sendReceive': [
        'dialog:portList'
    ]
};
electron_1.contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        sendMessage(channel, ...args) {
            if (validChannels.send.includes(channel)) {
                electron_1.ipcRenderer.send(channel, args);
            }
            else {
                console.error("Undefined channel: " + channel);
            }
        },
        on(channel, func) {
            if (validChannels.receive.includes(channel) && !electron_1.ipcRenderer.listeners('myEvent').length) {
                const subscription = (_event, ...args) => func(...args);
                // Deliberately strip event as it includes `sender`
                electron_1.ipcRenderer.addListener(channel, subscription);
                return () => electron_1.ipcRenderer.removeListener(channel, subscription);
            }
            console.error("Undefined channel: " + channel);
            return undefined;
        },
        once(channel, func) {
            if (validChannels.receive.includes(channel)) {
                electron_1.ipcRenderer.once(channel, (_event, ...args) => func(...args));
            }
            else {
                console.error("Undefined channel: " + channel);
            }
        },
        removeAllListener(channel) {
            return () => electron_1.ipcRenderer.removeAllListeners(channel);
        },
    },
    store: {
        get(key) {
            return electron_1.ipcRenderer.sendSync('electron-store-get', key);
        },
        set(key, val) {
            electron_1.ipcRenderer.send('electron-store-set', key, val);
        },
    }
});

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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azovL21pbnRlcm0vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vbWludGVybS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9taW50ZXJtLy4vc3JjL21haW4vcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgY29udGV4dEJyaWRnZSwgaXBjUmVuZGVyZXIsIElwY1JlbmRlcmVyRXZlbnQgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgeyBTdG9yZUtleSB9IGZyb20gJ3JlbmRlcmVyL3R5cGVzJztcblxuY29uc3QgdmFsaWRDaGFubmVscyA9IHtcbiAgICAgIC8vIEZyb20gcmVuZGVyIHRvIG1haW4uXG4gICAgICAnc2VuZCc6IFtcbiAgICAgICAgICAnY29ubmVjdDpwb3J0JyxcbiAgICAgICAgICAnZGlzY29ubmVjdDpwb3J0JyxcbiAgICAgICAgICAna2lsbDphcHAnLFxuICAgICAgICAgICdyZWxvYWQ6YXBwJ1xuICAgICAgXSxcbiAgICAgIC8vIEZyb20gbWFpbiB0byByZW5kZXIuXG4gICAgICAncmVjZWl2ZSc6IFtcbiAgICAgICAgICAncG9ydDpzdGF0dXMnLFxuICAgICAgICAgICdhc3luY2hyb25vdXMtbWVzc2FnZScsXG4gICAgICAgICAgJ3BvcnQ6Y29ubmVjdGlvbjpkYXRhJyxcbiAgICAgICAgICAncmVsb2FkOmFwcDpyZXBseSdcbiAgICAgIF0sXG4gICAgICAvLyBGcm9tIHJlbmRlciB0byBtYWluIGFuZCBiYWNrIGFnYWluLlxuICAgICAgJ3NlbmRSZWNlaXZlJzogW1xuICAgICAgICAgICdkaWFsb2c6cG9ydExpc3QnXG4gICAgICBdXG4gIH07XG5cbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ2VsZWN0cm9uJywge1xuICBpcGNSZW5kZXJlcjoge1xuICAgIHNlbmRNZXNzYWdlKGNoYW5uZWw6IHN0cmluZywgLi4uYXJnczogdW5rbm93bltdKSB7XG4gICAgICBpZiAodmFsaWRDaGFubmVscy5zZW5kLmluY2x1ZGVzKGNoYW5uZWwpKSB7XG4gICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoY2hhbm5lbCwgYXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5kZWZpbmVkIGNoYW5uZWw6IFwiICsgY2hhbm5lbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBvbihjaGFubmVsOiBzdHJpbmcsIGZ1bmM6ICguLi5hcmdzOiB1bmtub3duW10pID0+IHZvaWQpIHtcbiAgICAgIGlmICh2YWxpZENoYW5uZWxzLnJlY2VpdmUuaW5jbHVkZXMoY2hhbm5lbCkgJiYgIWlwY1JlbmRlcmVyLmxpc3RlbmVycygnbXlFdmVudCcpLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSAoX2V2ZW50OiBJcGNSZW5kZXJlckV2ZW50LCAuLi5hcmdzOiB1bmtub3duW10pID0+XG4gICAgICAgICAgZnVuYyguLi5hcmdzKTtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IHN0cmlwIGV2ZW50IGFzIGl0IGluY2x1ZGVzIGBzZW5kZXJgXG4gICAgICAgIGlwY1JlbmRlcmVyLmFkZExpc3RlbmVyKGNoYW5uZWwsIHN1YnNjcmlwdGlvbik7XG4gICAgICAgIHJldHVybiAoKSA9PiBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuICAgICAgfVxuICAgICAgY29uc29sZS5lcnJvcihcIlVuZGVmaW5lZCBjaGFubmVsOiBcIiArIGNoYW5uZWwpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIG9uY2UoY2hhbm5lbDogc3RyaW5nLCBmdW5jOiAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkKSB7XG4gICAgICBpZiAodmFsaWRDaGFubmVscy5yZWNlaXZlLmluY2x1ZGVzKGNoYW5uZWwpKSB7XG4gICAgICAgIGlwY1JlbmRlcmVyLm9uY2UoY2hhbm5lbCwgKF9ldmVudCwgLi4uYXJncykgPT4gZnVuYyguLi5hcmdzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5kZWZpbmVkIGNoYW5uZWw6IFwiICsgY2hhbm5lbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICByZW1vdmVBbGxMaXN0ZW5lcihjaGFubmVsOiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiAoKSA9PiBpcGNSZW5kZXJlci5yZW1vdmVBbGxMaXN0ZW5lcnMoY2hhbm5lbCk7XG4gICAgfSxcbiAgfSxcbiAgc3RvcmU6IHtcbiAgICBnZXQoa2V5OiBTdG9yZUtleSkge1xuICAgICAgcmV0dXJuIGlwY1JlbmRlcmVyLnNlbmRTeW5jKCdlbGVjdHJvbi1zdG9yZS1nZXQnLCBrZXkpO1xuICAgIH0sXG4gICAgc2V0KGtleTogU3RvcmVLZXksIHZhbDogYW55KSB7XG4gICAgICBpcGNSZW5kZXJlci5zZW5kKCdlbGVjdHJvbi1zdG9yZS1zZXQnLCBrZXksIHZhbCk7XG4gICAgfSxcbiAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=