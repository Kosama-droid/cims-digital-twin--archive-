document.getElementById('close-window').addEventListener('click', (e) => {
      document.getElementById('selectors').classList.remove('hidden');
      document.getElementById('close-window').classList.add('hidden');
      document.getElementById('iframe-container').classList.add('hidden');
      document.getElementById('iframe').remove;
    })