import { IWeatherImageInfo, IWeatherTypeInfo } from '../type'

const extractSatelliteType = (text: string): IWeatherTypeInfo[] => {
  const result: IWeatherTypeInfo[] = []
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')
  const div = doc.getElementsByClassName('sl-key')[0]
  const ul = div.parentNode!.childNodes[1]

  let iterator = doc.createNodeIterator(ul, NodeFilter.SHOW_ELEMENT)
  let node = iterator.nextNode()
  while (node !== null) {
    const url = (node as Element).getAttribute('href')
    if (url) {
      result.push({
        url: 'http://www.nmc.cn' + url,
        type: node.textContent as string,
      })
    }

    node = iterator.nextNode()
  }
  return result
}

const extractSatelliteImage = (text: string): IWeatherImageInfo[] => {
  const result: IWeatherImageInfo[] = []
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')
  const div = doc.getElementsByClassName('timeWrap')[0]

  let iterator = doc.createNodeIterator(div, NodeFilter.SHOW_ELEMENT)
  let node = iterator.nextNode()
  while (node !== null) {
    const imageUrl = (node as Element).getAttribute('data-img')
    const time = (node as Element).getAttribute('data-time')
    if (imageUrl && time) {
      result.push({
        imageUrl: imageUrl,
        time: time,
      })
    }

    node = iterator.nextNode()
  }

  return result
}

interface ICrawlSatellite {
  (type: 'type', url: string): Promise<IWeatherTypeInfo[]>
  (type: 'image', url: string): Promise<IWeatherImageInfo[]>
}

export const crawlSatellite = (async (type: 'type' | 'image', url: string) => {
  const result = fetch(url)
    .then((res) => {
      return res.text()
    })
    .then((html) => {
      if (type === 'type') {
        return extractSatelliteType(html)
      }
      return extractSatelliteImage(html)
    })

  return result
}) as ICrawlSatellite
