import axios from "axios"

const prepareAddWaterLayer = async(map,id) =>{
    const jsonPrefix = `/api/v1/data/nc/field/add/9711/json?name=contour_`
    const picPrefix =  `/api/v1/data/nc/field/add/9711/pic?name=addWater_`

    map.addSource('pngsource', {
        "type": "image",
        "url": picPrefix+`${id}.png`,
        "coordinates": [
            [117.6008663, 29.00020341 - 0.02],
            [124.9706147773, 29.00020341 - 0.02],
            [124.9706147773, 33.99616132 - 0.02],
            [117.6008663, 33.99616132 - 0.02]
        ]
    })

    const contourGJ = (await axios.get(jsonPrefix+`${id}.geojson`)).data
    map.addSource('contourSrc', {
        type: "geojson",
        data: contourGJ
    })
}

const addWaterLayer = (map,id) => {

    /**
     *  `/api/v1/data/nc/field/add/9711/json?name=contour_23.geojson`,
     *  `/api/v1/data/nc/field/add/9711/pic?name=addWater_23.png`,
     */

    map.addLayer({
        id: 'addWater',
        type: "raster",
        source: 'pngsource',
        paint: {
            "raster-fade-duration": 0
        }
    })
    map.addLayer({
        id: 'contourLayer',
        type: 'line',
        source: 'contourSrc',
        paint: {
            'line-color': "#000",
            "line-width": 1
        }
    })
    map.addLayer({
        id: 'contourLabel',
        type: "symbol",
        source: 'contourSrc',
        layout: {
            'text-field': ['format', ['get', 'addWater'], { 'font-scale': 1.2 }],
            'symbol-placement':"line-center"
        },
        paint: {
            'text-color': '#ffffff'
        }
    })

}

export {
    prepareAddWaterLayer,
    addWaterLayer
}