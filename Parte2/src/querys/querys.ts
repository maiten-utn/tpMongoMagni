import { Collection } from 'mongodb'

//5.1 Codifique un método que seleccione los documentos de la colección países
// donde la región sea Americas. Muestre el resultado por pantalla o consola.
export async function getCountriesInAmericas(collection: Collection<Document>) {
  const countries = await collection.find({ region: 'Americas' }).toArray()
  console.log('5.1🌎 Países en América:', countries)
}

//5.2 Codifique un método que seleccione los documentos de la colección países
// donde la región sea Americas y la población sea mayor a 100000000. Muestre el
// resultado por pantalla o consola.
export async function getCountriesWithPopulation100M(
  collection: Collection<Document>
) {
  const countries = await collection
    .find({ region: 'Americas', poblacion: { $gt: 100000000 } })
    .toArray()
  console.log('5.2🌎 Países en América con población mayor a 100M:', countries)
}

//5.3 Codifique un método que seleccione los documentos de la colección países
// donde la región sea distinto de Africa. (investigue $ne). Muestre el resultado por
// pantalla o consola.
export async function getCountriesNotInAfrica(
  collection: Collection<Document>
) {
  const countries = await collection
    .find({ region: { $ne: 'Africa' } })
    .toArray()
  console.log('5.3🌍 Países fuera de África:', countries)
}

//5.4 Codifique un método que actualice el documento de la colección países donde
// el name sea Egypt, cambiando el name a “Egipto” y la población a 95000000
export async function updateEgypt(collection: Collection<Document>) {
  await collection.updateOne(
    { nombrePais: 'Egypt' },
    { $set: { nombrePais: 'Egipto', poblacion: 95000000 } }
  )
  console.log('5.4✅ País actualizado: Egipto')
}

//5.5 Codifique un método que elimine el documento de la colección países donde
// el código del país sea 258
export async function deleteCountryByCode(
  collection: Collection<Document>,
  codigo: number
) {
  await collection.deleteOne({ codigoPais: codigo }) // No solo el 258
  console.log(`5.5🗑️ País eliminado con código ${codigo}`)
}

// 5.6. Describa que sucede al ejecutar el método drop() sobre una colección y sobre
// una base de datos.

export async function whatIsDrop() {
  console.log(
    '5.6🤔 Al ejecutar drop() sobre una colección se elimina la colección y todos sus documentos. Al ejecutar drop() sobre una base de datos seeliminan todas las colecciones y todos sus documentos de la base de datos. '
  )
}

//5.7. Codifique un método que seleccione los documentos de la colección países
// cuya población sea mayor a 50000000 y menor a 150000000. Muestre el resultado por
// pantalla o consola.
export async function getCountriesByPopulationRange(
  collection: Collection<Document>
) {
  const countries = await collection
    .find({ poblacion: { $gt: 50000000, $lt: 150000000 } })
    .toArray()
  console.log('5.7.📊 Países con población entre 50M y 150M:', countries)
}

// 5.8 Codifique un método que seleccione los documentos de la colección países
// ordenados por nombre (name) en forma Ascendente. sort(). Muestre el resultado por
// pantalla o consola.
export async function getCountriesSortedByName(
  collection: Collection<Document>
) {
  const countries = await collection.find().sort({ nombrePais: 1 }).toArray()
  console.log('5.8🔤 Países ordenados por nombre:', countries)
}

// 5.9. Describa que sucede al ejecutar el método skip() sobre una colección.
// Ejemplifique con la colección países.
export async function whatIsSkip() {
  console.log(
    '5.9🔛 El Metodo skip(), Se usa para omitir documentos en una consulta, útil para paginación.'
  )
}

// 5.10. Describa y ejemplifique como el uso de expresiones regulares en Mongo puede
// reemplazar el uso de la cláusula LIKE de SQL.
export async function useRegex(collection: Collection<Document>) {
  const countries = await collection
    .find({ nombrePais: { $regex: '^A', $options: 'i' } })
    .toArray()
  console.log('5.10🌍 Países que empiezan con A:', countries)
}

export async function createIndex(collection: Collection<Document>) {
  await collection.createIndex({ codigoPais: 1 })
  console.log('5.11📌 Índice creado en código de país')
}
