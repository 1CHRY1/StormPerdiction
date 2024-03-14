const addWaterLayer = async (map,id) => {

    map.addSource('tifsource', {
        "type": "image",
        "url": `/myBackEnd/addWaterOut9711/addWater_${id}.png`,
        "coordinates": [
            [117.6008663, 29.00020341 - 0.02],
            [124.9706147773, 29.00020341 - 0.02],
            [124.9706147773, 33.99616132 - 0.02],
            [117.6008663, 33.99616132 - 0.02]
        ]
    })

    const contourGJ = (await axios.get(`/myBackEnd/addWaterOut9711/contour_${id}.geojson`)).data
    map.addSource('contourSrc', {
        type: "geojson",
        data: contourGJ
    })


    map.addLayer({
        id: 'tifLayer',
        type: "raster",
        source: 'tifsource',
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