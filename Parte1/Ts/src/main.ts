import pool from './db'

interface Pais {
  codigoPais: number
  nombrePais: string
  capitalPais: string
  region: string
  subregion: string
  poblacion: number
  latitud: number
  longitud: number
}

//Metodo para obtener la informacion del país segun el codigo
async function getCountryData(code: string): Promise<Pais | null> {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)

    if (!response.ok) {
      throw new Error(`${response.status}`)
    }

    const countryData: any[] = (await response.json()) as any[]
    const newData = countryData[0]

    return {
      codigoPais: newData.ccn3 || 0,
      nombrePais: newData.name.common || 'Desconocido',
      capitalPais: newData.capital ? newData.capital[0] : 'No disponible',
      region: newData.region || 'Desconocida',
      subregion: newData.subregion || 'Desconocida',
      poblacion: newData.population || 0,
      latitud: newData.latlng ? newData.latlng[0] : null,
      longitud: newData.latlng ? newData.latlng[1] : null,
    }
  } catch (error) {
    console.warn(`⚠️ No se encontraron datos para el código: ${code}`)
    return null
  }
}

//Metodo para guardar un pais en la BDD
async function saveCountry(code: string) {
  const country = await getCountryData(code)

  if (!country) {
    return
  }

  const connection = pool.getConnection()

  try {
    const query = `
        INSERT INTO pais (codigoPais,nombrePais, capitalPais, region, subregion, poblacion, latitud, longitud)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `

    const values = [
      country.codigoPais,
      country.nombrePais,
      country.capitalPais,
      country.region,
      country.subregion,
      country.poblacion,
      country.latitud,
      country.longitud,
    ]

    if (values.includes(undefined)) {
      console.warn(
        `⚠️ Datos inválidos para el país con código ${code}:`,
        values
      )
      return
    }

    ;(await connection).execute(query, values)
    console.log(
      `✅ País ${country.nombrePais}, con id ${country.codigoPais}, fue guardado en la base de datos`
    )
  } catch (error) {
    console.error(`❌ Error al guardar el país con codigo ${code}: `, error)
  } finally {
    ;(await connection).release()
  }
}

async function saveAllCountries() {
  const promises: Promise<void>[] = []

  for (let index = 0; index < 999; index++) {
    let code = index.toString().padStart(3, '0')
    promises.push(saveCountry(code))
  }

  await Promise.allSettled(promises)
}

saveAllCountries()
