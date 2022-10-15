export default function closeWindow(bool = false){
  // if bool is false, the window will close with the close icon
if (!bool) document.getElementById('close-window').addEventListener('click', (e) => {
      document.getElementsByClassName('iframe').remove;
      document.getElementById('selectors').classList.remove('hidden');
      document.getElementById('close-window').classList.add('hidden');
      document.getElementById('iframe-container').classList.add('hidden');
    })
    // if bool is true, the window will close 
  else{
    document.getElementsByClassName('iframe').remove;
    document.getElementById('selectors').classList.remove('hidden');
    document.getElementById('close-window').classList.add('hidden');
    document.getElementById('iframe-container').classList.add('hidden');
  }
  }