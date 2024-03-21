(() => {
  const script = document.createElement('script');
  script.setAttribute('src', chrome.runtime.getURL('/src/main.js'));
  script.setAttribute('type', 'module');
  script.addEventListener('load', () => {
    console.log('loaded');
    script.remove();
  });
  document.body.append(script);
})();
