export default async function getJson(path) {
    let response = await fetch(path);
    let json = await response.json();
    return json;
  }