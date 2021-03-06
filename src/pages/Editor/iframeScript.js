const domLoaded = () => {
  let __parentWindow;
  let __parentOrigin;
  function receiver(e) {
    __parentWindow = e.source;
    __parentOrigin = e.origin;
    let root = document.documentElement;
    if (Array.isArray(e.data)) window.setAllEditableFieldsAsMergeVariables(e.data);
    else if (e.data === 'getAllEditableFieldsAsMergeVariables')
      e.source.postMessage(window.getAllEditableFieldsAsMergeVariables(), e.origin);
    else if (e.data.type === 'updateBrandColor') {
      root.style.setProperty('--brand-color', e.data.value);
    } else console.log(JSON.stringify(e.data));
  }

  window.addEventListener('message', receiver, false);

  const elements = document.querySelectorAll('[contenteditable=true]');
  Array.prototype.forEach.call(elements, function(el, i) {
    const name = el.getAttribute('title');
    const value = el.innerHTML;
    let changed = false;
    let newValue = null;
    const listener = function(e) {
      newValue = el.innerHTML;
      if (value !== newValue) changed = true;
    };
    const notifier = function(e) {
      if (!changed) return;
      if (!__parentWindow) return;
      if (!__parentOrigin) return;
      __parentWindow.postMessage({ name, value: newValue }, __parentOrigin);
    };
    el.addEventListener('input', listener);
    el.addEventListener('blur', notifier);
    el.addEventListener('keyup', listener);
    el.addEventListener('paste', listener);
    el.addEventListener('copy', listener);
    el.addEventListener('cut', listener);
    el.addEventListener('delete', listener);
    el.addEventListener('mouseup', listener);
  });
};

window.getAllEditableFieldsAsMergeVariables = function() {
  let mergeVariables = [];
  const elements = document.querySelectorAll('[contenteditable=true]');
  Array.prototype.forEach.call(elements, function(el, i) {
    const name = el.getAttribute('title');
    const value = el.innerHTML;
    mergeVariables.push({ name: name, value: value });
  });
  return mergeVariables;
};

window.setAllEditableFieldsAsMergeVariables = function(mergeVariables) {
  mergeVariables.forEach(function(item) {
    const name = item.name;
    const value = item.value;
    const selector = 'span[title=' + name + ']';
    const el = document.querySelector(selector);
    if (!el) return;
    el.innerHTML = value;
  });
};

window.onload = domLoaded();
