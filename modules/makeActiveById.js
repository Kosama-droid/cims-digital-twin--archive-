export default function makeActiveById(...ids) {
  ids.forEach((id) => {
    document.getElementById(id).classList.remove("inactive");
  });
}