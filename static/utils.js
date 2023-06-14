//currently these two elements simply check for or toggle d-none class
//if anyone prefers something else, feel free to replace
function isElementDisplayed(el) {
    if (typeof el === 'string') {
        el = document.querySelector(el);
    }
    if (el == null) {
        console.warn('Could not find element ' + el + ' .');
        return;
    }
    return !el.classList.contains('d-none');
}

function toggleElementDisplay(el, display) {
    if (typeof el === 'string') {
        el = document.querySelector(el);
    }
    if (el == null) {
        console.warn('Could not find element ' + el + ' .');
        return;
    }
    if (display) {
        el.classList.remove('d-none');
    } else {
        el.classList.add('d-none');
    }
}

function collapseElement(element, show) {
    const collapse = bootstrap.Collapse.getOrCreateInstance(element, {
        toggle: false
    });
    if(show) {
        collapse.show();
    } else {
        collapse.hide();
    }
}

function loadTemplate(rootSelector, selectors = [], strict = false) {
    const root = document.querySelector(rootSelector);
    if (root == null) {
        console.error('Template with query ' + rootSelector + ' not found.');
        return undefined;
    }
    toggleElementDisplay(root, false);
    const selectedElements = selectors.map((selector) => root.querySelector(selector));
    if (strict && selectedElements.some((el) => el == null)) {
        const failed = selectedElements.map((item, index) => (item == null ? selectors[index] : undefined)).filter((item) => item != null);
        console.error(`Template could not fulfill selector queries: ${failed.join(' , ')}. Check your html.`);
        return undefined;
    }
    const create = (onCreate, { append = true } = {}) => {
        const parent = root.parentElement;
        const clone = root.cloneNode(true);
        clone.id = undefined;
        toggleElementDisplay(clone, true);
        const selectedElements = selectors.map((selector) => clone.querySelector(selector));
        if (append) {
            parent.append(clone);
        } else {
            parent.prepend(clone);
        }
        if (onCreate != null) {
            onCreate({ root: clone, selectedElements });
        }
    };
    const clear = () => {
        const parent = root.parentElement;
        parent.replaceChildren(root);
    };
    return {
        root,
        selectedElements,
        create,
        clear,
    };
}

function findOrCreateTemplateInstance(instanceSelector, templateSelector, selectors = [], strict = false) {
    const instance = document.querySelector(instanceSelector);
    if (instance != null) {
        return (findCallback, { append = false } = {}) => {
            findCallback({
                root: instance,
                selectedElements: selectors.map((selector) => instance.querySelector(selector)),
            });
        };
    } else {
        const { create } = loadTemplate(templateSelector, selectors, strict);
        return create;
    }
}

function minDigits(num, digits) {
    let str = String(num);
    while (str.length < digits) {
        str = '0' + str;
    }
    return str;
}

/**
 * Returns audio extension without leading dot.
 */
function audioExtension(filename) {
    if (typeof filename !== 'string') {
        return '';
    }
    for (const extn of ['mp3', 'wav', 'aac', 'alac', 'flac', 'm4a', 'ogg', 'webm']) {
        if (filename.endsWith('.' + extn)) {
            return extn;
        }
    }
    return '';
}

function secondsToDuration(seconds, hourAlways = false) {
    seconds = Math.ceil(seconds);
    const hours = Math.floor(seconds / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    if (hours > 0 || hourAlways) {
        return `${minDigits(hours, 2)}:${minDigits(minutes, 2)}:${minDigits(seconds, 2)}`;
    }
    return `${minDigits(minutes, 2)}:${minDigits(seconds, 2)}`;
}
