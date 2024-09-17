import { assertNotNullish } from '../src-shared/utils/assert-not-nullish';

export function applyIsDarkMode(isDarkMode: boolean): void {
    const bodyElem = document.getElementById('body');
    assertNotNullish(bodyElem);
    if (isDarkMode) {
        bodyElem.classList.add('dark');
        bodyElem.classList.add('theme-dark');
    } else {
        bodyElem.classList.add('light');
        bodyElem.classList.add('theme-light');
    }
}
