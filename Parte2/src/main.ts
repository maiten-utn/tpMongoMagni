import axios from 'axios'
import { Pais } from './models/PaisModel'
import { closeClient, getCollectionByDatabase } from './db'
import {
  createIndex,
  deleteCountryByCode,
  getCountriesByPopulationRange,
  getCountriesInAmericas,
  getCountriesNotInAfrica,
  getCountriesSortedByName,
  getCountriesWithPopulation100M,
  updateEgypt,
  useRegex,
  whatIsDrop,
  whatIsSkip,
} from './querys/querys'

async function fetchCountry(code: string, collection: any) {
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/alpha/${code}`
    )

    if (!response.data || response.data.length === 0) {
      console.warn(`⚠️ País no encontrado para código: ${code}`)
      return
    }

    const data = response.data[0]

    const newCountry: Pais = {
      codigoPais: data.ccn3 || '000',
      nombrePais: data.name.common || 'Desconocido',
      capitalPais: data.capital ? data.capital[0] : 'No disponible',
      region: data.region || 'Desconocida',
      subregion: data.subregion || 'Desconocida',
      poblacion: data.population || 0,
      latitud: data.latlng ? data.latlng[0] : null,
      longitud: data.latlng ? data.latlng[1] : null,
    }

    const exists = await collection.findOne({
      codigoPais: newCountry.codigoPais,
    })

    if (exists) {
      await collection.updateOne(
        { codigoPais: newCountry.codigoPais },
        { $set: newCountry }
      )
      console.log(`🔄 País actualizado: ${newCountry.nombrePais}`)
    } else {
      await collection.insertOne(newCountry)
      console.log(`✅ País insertado: ${newCountry.nombrePais}`)
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.warn(`⚠️ Código de país no encontrado: ${code}`)
    } else {
      console.error(
        `❌ Error al obtener el país con código ${code}:`,
        error.message
      )
    }
  }
}

async function main() {
  try {
    const collection = await getCollectionByDatabase('pais_db', 'paises')

    // for (let code = 0; code < 300; code++) {
    //   const newCode = code.toString().padStart(3, '0')

    //   await fetchCountry(newCode, collection)

    //   // Pequeña pausa para evitar hacer demasiadas peticiones seguidas (500ms) por errores de api
    //   await new Promise(resolve => setTimeout(resolve, 500))
    // }

    console.info('✅ MÉTODOS Y RESPUESTAS PUNTO 5 ✅')

    await getCountriesInAmericas(collection)

    await getCountriesWithPopulation100M(collection)

    await getCountriesNotInAfrica(collection)

    await updateEgypt(collection)

    await deleteCountryByCode(collection, 258)

    whatIsDrop()

    await getCountriesByPopulationRange(collection)

    await getCountriesSortedByName(collection)

    whatIsSkip()

    await useRegex(collection)

    await createIndex(collection)
  } catch (error) {
    console.error('❌ Error al conectarse a MongoDB:', error)
  } finally {
    await closeClient()
    console.info('🔌 Desconectado de MongoDB')
  }
}

main().catch(console.error)
