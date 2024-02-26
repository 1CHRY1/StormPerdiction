import { IImageTypeAndTime, IImageTypeAndTimeResponse, ImageType } from './type'

export const getSatelliteTypeAndTime = async (
  imageType: ImageType,
): Promise<IImageTypeAndTime> => {
  const data = (await fetch(`/api/v1/data/meteorology/${imageType}`)
    .then((res) => res.json())
    .then((value) => value.data)) as IImageTypeAndTimeResponse[]

  const typeName = data[0].type1
  let typeMap: Set<string> = new Set()
  let timeMap: Record<string, Set<string>> = {}
  data.forEach((value) => {
    const type =
      value.type3.length === 0 ? value.type2 : value.type2 + ' - ' + value.type3
    typeMap.add(type)
    if (!timeMap[type]) {
      timeMap[type] = new Set()
    }
    timeMap[type].add(value.time)
  })

  return {
    imageType: typeName,
    type: typeMap,
    time: timeMap,
  }
}

export const getSatelliteImage = async (
  imageType: string,
  type: string,
  time: string,
) => {
  let type2 = type
  let type3 = ''
  if (type.includes('-')) {
    type2 = type.split(' - ')[0]
    type3 = type.split(' - ')[1]
  }
  const url = `/api/v1/data/meteorology/time&type?time=${time}&type1=${imageType}&type2=${type2}&type3=${type3}`
  const imageBlob = await fetch(url)
    .then((res) => res.blob())
    .then((blob) => blob)
  const imageUrl = URL.createObjectURL(imageBlob)
  return imageUrl
}
