interface ISatelliteTypeAndTimeResponse {
  time: string
  type: string
}
interface ISatelliteTypeAndTime {
  type: Set<string>
  time: Record<string, Set<string>>
}

export const getSatelliteTypeAndTime =
  async (): Promise<ISatelliteTypeAndTime> => {
    const data = (await fetch('/api/v1/data/meteorology')
      .then((res) => res.json())
      .then((value) => value.data)) as ISatelliteTypeAndTimeResponse[]

    let type: Set<string> = new Set()
    let time: Record<string, Set<string>> = {}
    data.forEach((value) => {
      type.add(value.type)
      if (!time[value.type]) {
        time[value.type] = new Set()
      }
      time[value.type].add(value.time)
    })

    return {
      type,
      time,
    }
  }

export const getSatelliteImage = async (type: string, time: string) => {
  const url = `/api/v1/data/meteorology/time&type?time=${time}&type=${type}`
  const imageBlob = await fetch(url)
    .then((res) => res.blob())
    .then((blob) => blob)
  const imageUrl = URL.createObjectURL(imageBlob)
  return imageUrl
}
