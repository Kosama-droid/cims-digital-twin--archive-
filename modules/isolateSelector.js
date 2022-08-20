export default function isolateSelector(selectors, ...keys) {
    selectors.forEach((selector) => {
      if (keys.includes(selector.id)) {
        selector.classList.remove('hidden');
      } else {
        selector.classList.add('hidden');
      }
    });
  }