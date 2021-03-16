const getAllEditableFieldsAsMergeVariables = function() {
  let mergeVariables = [];
  const elements = document.querySelectorAll('[contenteditable=true]');
  Array.prototype.forEach.call(elements, function(el, i) {
    const name = el.getAttribute('title');
    const value = el.innerHTML;
    mergeVariables.push({ name: name, value: value });
  });
  return mergeVariables;
};

const setAllEditableFieldsAsMergeVariables = function(mergeVariables) {
  mergeVariables.forEach(function(item) {
    const name = item.name;
    const value = item.value;
    const selector = 'span[title=' + name + ']';
    const el = document.querySelector(selector);
    if (!el) return;
    el.innerHTML = value;
  });
};

const domLoaded = () => {
  let __parentWindow;
  let __parentOrigin;

  const switchImageUrl = function(imageTitle, newUrl) {
    let imageNode = document.querySelector(`img[title="${imageTitle}"]`);
    imageNode.src = newUrl;
  };

  const handleImgDrop = (e, name) => {
    const newSrc = e.dataTransfer.getData('text');
    __parentWindow.postMessage({ name, value: newSrc }, __parentOrigin);
    e.target.src = newSrc;
    e.target.style.opacity = '';
    e.target.style.border = '';
  };

  const handleDragEnter = e => {
    e.target.style.opacity = 0.5;
    e.target.style.border = 'solid 2px green';
  };

  const handleDragLeave = e => {
    e.target.style.opacity = '';
    e.target.style.border = '';
  };

  function receiver(e) {
    __parentWindow = e.source;
    __parentOrigin = e.origin;
    let root = document.documentElement;
    if (Array.isArray(e.data)) setAllEditableFieldsAsMergeVariables(e.data);
    else if (e.data === 'getAllEditableFieldsAsMergeVariables')
      e.source.postMessage(getAllEditableFieldsAsMergeVariables(), e.origin);
    else if (e.data.type === 'updateBrandColor') {
      root.style.setProperty('--brand-color', e.data.value);
    } else if (e.data.type === 'switchImageUrl') {
      const { imageTitle, newUrl } = e.data;
      switchImageUrl(imageTitle, newUrl);
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
    const updateAndNotify = () => {
      listener();
      notifier();
    };
    if (el.nodeName === 'IMG') {
      el.draggable = false;
      el.addEventListener('drop', e => handleImgDrop(e, name));
      el.addEventListener('dragenter', handleDragEnter);
      el.addEventListener('dragleave', handleDragLeave);
    } else {
      el.addEventListener('drop', e => {
        e.preventDefault();
      });
      el.addEventListener('input', updateAndNotify);
      el.addEventListener('blur', notifier);
      el.addEventListener('keyup', updateAndNotify);
      el.addEventListener('paste', updateAndNotify);
      el.addEventListener('copy', listener);
      el.addEventListener('cut', updateAndNotify);
      el.addEventListener('delete', updateAndNotify);
      el.addEventListener('mouseup', listener);
    }
  });
};

window.onload = domLoaded();
