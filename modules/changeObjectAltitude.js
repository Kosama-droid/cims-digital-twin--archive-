export default function changeObjectAltitude(object, altitude = 0){
    let mslInput = document.getElementById('object-msl')
    mslInput.addEventListener('change', () => {
      let msl =  mslInput.value - altitude
      if(object.gltfModel) object.gltfModel.position.y = msl
      if(object.ifcModel)object.ifcModel.position.y = msl
      object.coordinates.msl = msl
    })
    }