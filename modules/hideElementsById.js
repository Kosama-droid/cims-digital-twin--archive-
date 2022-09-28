export default function hideElementsById(...ids) {
    ids.forEach(id => {
       document.getElementById(id).classList.add('hidden');
    });
  }