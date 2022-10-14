export default function closeWindow(){
document.getElementById('close-window').addEventListener('click', (e) => {
      document.getElementsByClassName('iframe').remove;
      document.getElementById('selectors').classList.remove('hidden');
      document.getElementById('close-window').classList.add('hidden');
      document.getElementById('iframe-container').classList.add('hidden');
    })
  }