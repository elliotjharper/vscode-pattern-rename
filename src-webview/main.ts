import { getFileList, getIsDarkMode, setupMessageListener } from './extension-messaging';
import { setupDomListeners } from './setup-dom-listeners';
import './view.css';
import { initVsCodeApi } from './vs-code-api';

function startRenameApp() {
    initVsCodeApi();
    setupMessageListener();
    setupDomListeners();
    getFileList();
    getIsDarkMode();
}

startRenameApp();
