import { type configureType } from './flowLayerWithMask'

const config_9711wind: configureType = {
    id: ' 9711wind ',
    geojsonURL: '/ffvsrc/NoMask.geojson',
    binPrefix: '/ffvsrc/9711wind',
    stationURL: '/station.bin',
    uvURLs: [
        "/uv_16.bin", "/uv_17.bin", "/uv_18.bin", "/uv_19.bin", "/uv_20.bin", "/uv_21.bin", "/uv_22.bin", "/uv_23.bin", "/uv_24.bin", "/uv_25.bin",
        "/uv_26.bin", "/uv_27.bin", "/uv_28.bin", "/uv_29.bin", "/uv_30.bin", "/uv_31.bin", "/uv_32.bin", "/uv_33.bin", "/uv_34.bin", "/uv_35.bin",
        "/uv_36.bin", "/uv_37.bin"
    ],

    particleNum: 10000,
    velocityFactor: 100,
    aaWidth: 1,
    fillWidth: 2,
    fadeFactor: 0.99,
    framePerStep: 100
}

const config_9711flow: configureType = {
    id: ' 9711flow ',
    geojsonURL: '/ffvsrc/FlowMask.geojson',
    binPrefix: '/ffvsrc/9711flow',
    stationURL: '/station.bin',
    uvURLs: [
        "/uv_0.bin", "/uv_6.bin", "/uv_12.bin", "/uv_18.bin", "/uv_24.bin",
        "/uv_30.bin", "/uv_36.bin", "/uv_42.bin", "/uv_48.bin", "/uv_54.bin",
        "/uv_60.bin", "/uv_66.bin", "/uv_72.bin", "/uv_78.bin", "/uv_84.bin",
        "/uv_90.bin", "/uv_96.bin", "/uv_102.bin", "/uv_108.bin", "/uv_114.bin",
        "/uv_120.bin", "/uv_126.bin"
    ],

    particleNum: 20000,
    velocityFactor: 50,
    aaWidth: 1,
    fillWidth: 2,
    fadeFactor: 0.99,
    framePerStep: 160
}

const config_normalWind: configureType = {
    id: 'wind',
    geojsonURL: '/ffvsrc/WindMask.geojson',
    binPrefix: '/field/wind/bin?name=',
    stationURL: 'station.bin',
    uvURLs: [
        "uv_0.bin","uv_1.bin","uv_2.bin","uv_3.bin","uv_4.bin","uv_5.bin","uv_6.bin","uv_7.bin","uv_8.bin","uv_9.bin","uv_10.bin","uv_11.bin","uv_12.bin","uv_13.bin","uv_14.bin","uv_15.bin","uv_16.bin","uv_17.bin","uv_18.bin","uv_19.bin","uv_20.bin","uv_21.bin","uv_22.bin","uv_23.bin","uv_24.bin","uv_25.bin","uv_26.bin","uv_27.bin","uv_28.bin","uv_29.bin","uv_30.bin","uv_31.bin","uv_32.bin","uv_33.bin","uv_34.bin","uv_35.bin","uv_36.bin","uv_37.bin","uv_38.bin","uv_39.bin",
        "uv_40.bin","uv_41.bin","uv_42.bin","uv_43.bin","uv_44.bin","uv_45.bin","uv_46.bin","uv_47.bin","uv_48.bin","uv_49.bin","uv_50.bin","uv_51.bin","uv_52.bin","uv_53.bin","uv_54.bin","uv_55.bin","uv_56.bin","uv_57.bin","uv_58.bin","uv_59.bin","uv_60.bin","uv_61.bin","uv_62.bin","uv_63.bin","uv_64.bin","uv_65.bin","uv_66.bin","uv_67.bin","uv_68.bin","uv_69.bin","uv_70.bin","uv_71.bin","uv_72.bin","uv_73.bin","uv_74.bin","uv_75.bin","uv_76.bin","uv_77.bin","uv_78.bin","uv_79.bin",
        "uv_80.bin","uv_81.bin","uv_82.bin","uv_83.bin","uv_84.bin","uv_85.bin","uv_86.bin","uv_87.bin","uv_88.bin","uv_89.bin","uv_90.bin","uv_91.bin","uv_92.bin","uv_93.bin","uv_94.bin","uv_95.bin","uv_96.bin","uv_97.bin","uv_98.bin","uv_99.bin","uv_100.bin","uv_101.bin","uv_102.bin","uv_103.bin","uv_104.bin","uv_105.bin","uv_106.bin","uv_107.bin","uv_108.bin","uv_109.bin","uv_110.bin","uv_111.bin","uv_112.bin","uv_113.bin","uv_114.bin","uv_115.bin","uv_116.bin","uv_117.bin","uv_118.bin","uv_119.bin",
        "uv_120.bin","uv_121.bin","uv_122.bin","uv_123.bin","uv_124.bin","uv_125.bin","uv_126.bin","uv_127.bin","uv_128.bin","uv_129.bin","uv_130.bin","uv_131.bin","uv_132.bin","uv_133.bin","uv_134.bin","uv_135.bin","uv_136.bin","uv_137.bin","uv_138.bin","uv_139.bin","uv_140.bin","uv_141.bin","uv_142.bin","uv_143.bin"
    ],

    particleNum: 10000,
    velocityFactor: 100,
    aaWidth: 1,
    fillWidth: 2,
    fadeFactor: 0.99,
    framePerStep: 100
}

const config_normalFlow: configureType = {
    id: 'flow',
    geojsonURL: '/ffvsrc/FlowMask.geojson',
    binPrefix: '/field/flow/bin?name=',
    stationURL: 'station.bin',
    uvURLs: [
        "uv_0.bin","uv_1.bin","uv_2.bin","uv_3.bin","uv_4.bin","uv_5.bin","uv_6.bin","uv_7.bin","uv_8.bin","uv_9.bin","uv_10.bin","uv_11.bin","uv_12.bin","uv_13.bin","uv_14.bin","uv_15.bin","uv_16.bin","uv_17.bin","uv_18.bin","uv_19.bin","uv_20.bin","uv_21.bin","uv_22.bin","uv_23.bin","uv_24.bin","uv_25.bin","uv_26.bin","uv_27.bin","uv_28.bin","uv_29.bin","uv_30.bin","uv_31.bin","uv_32.bin","uv_33.bin","uv_34.bin","uv_35.bin","uv_36.bin","uv_37.bin","uv_38.bin","uv_39.bin",
        "uv_40.bin","uv_41.bin","uv_42.bin","uv_43.bin","uv_44.bin","uv_45.bin","uv_46.bin","uv_47.bin","uv_48.bin","uv_49.bin","uv_50.bin","uv_51.bin","uv_52.bin","uv_53.bin","uv_54.bin","uv_55.bin","uv_56.bin","uv_57.bin","uv_58.bin","uv_59.bin","uv_60.bin","uv_61.bin","uv_62.bin","uv_63.bin","uv_64.bin","uv_65.bin","uv_66.bin","uv_67.bin","uv_68.bin","uv_69.bin","uv_70.bin","uv_71.bin","uv_72.bin","uv_73.bin","uv_74.bin","uv_75.bin","uv_76.bin","uv_77.bin","uv_78.bin","uv_79.bin",
        "uv_80.bin","uv_81.bin","uv_82.bin","uv_83.bin","uv_84.bin","uv_85.bin","uv_86.bin","uv_87.bin","uv_88.bin","uv_89.bin","uv_90.bin","uv_91.bin","uv_92.bin","uv_93.bin","uv_94.bin","uv_95.bin","uv_96.bin","uv_97.bin","uv_98.bin","uv_99.bin","uv_100.bin","uv_101.bin","uv_102.bin","uv_103.bin","uv_104.bin","uv_105.bin","uv_106.bin","uv_107.bin","uv_108.bin","uv_109.bin","uv_110.bin","uv_111.bin","uv_112.bin","uv_113.bin","uv_114.bin","uv_115.bin","uv_116.bin","uv_117.bin","uv_118.bin","uv_119.bin",
        "uv_120.bin","uv_121.bin","uv_122.bin","uv_123.bin","uv_124.bin","uv_125.bin","uv_126.bin","uv_127.bin","uv_128.bin","uv_129.bin","uv_130.bin","uv_131.bin","uv_132.bin","uv_133.bin","uv_134.bin","uv_135.bin","uv_136.bin","uv_137.bin","uv_138.bin","uv_139.bin","uv_140.bin","uv_141.bin","uv_142.bin","uv_143.bin"
    ],

    particleNum: 10000,
    velocityFactor: 100,
    aaWidth: 1,
    fillWidth: 2,
    fadeFactor: 0.99,
    framePerStep: 100
}


export {
    config_9711wind,
    config_9711flow,
    config_normalWind,
    config_normalFlow   
}