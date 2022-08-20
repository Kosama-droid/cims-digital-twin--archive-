export default function unhideElementsById(...ids) {
    ids.forEach(id => {
       document.getElementById(id).classList.remove('hidden');
    });
  }
