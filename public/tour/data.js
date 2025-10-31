var APP_DATA = {
  "scenes": [
    {
      "id": "0-entrada_tarde",
      "name": "entrada_tarde",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 0.020712603858713763,
          "pitch": 0.0023012308066512333,
          "rotation": 0,
          "target": "1-terreo_entrada"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1-terreo_entrada",
      "name": "terreo_entrada",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "yaw": 0.08074161892552567,
        "pitch": 0.06022994740343535,
        "fov": 1.5440768334336543
      },
      "linkHotspots": [
        {
          "yaw": 1.1683154285182873,
          "pitch": 0.15076076344080036,
          "rotation": 1.5707963267948966,
          "target": "2-salao_geral"
        },
        {
          "yaw": 0.03141003750579863,
          "pitch": 0.05649478059694246,
          "rotation": 0,
          "target": "4-terreo_corredor1"
        },
        {
          "yaw": -0.6126698069973795,
          "pitch": 0.08245513660777704,
          "rotation": 4.71238898038469,
          "target": "3-terreo_elevador"
        },
        {
          "yaw": -3.1102333830243047,
          "pitch": 0.19448452880626022,
          "rotation": 0,
          "target": "0-entrada_tarde"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "2-salao_geral",
      "name": "salao_geral",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 0.18042138975664912,
          "pitch": 0.049328393453830444,
          "rotation": 0,
          "target": "1-terreo_entrada"
        },
        {
          "yaw": 1.8526695786282152,
          "pitch": 0.07193380736109312,
          "rotation": 0,
          "target": "5-terreo_corredor2"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "3-terreo_elevador",
      "name": "terreo_elevador",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "yaw": 0.17740100842952167,
        "pitch": 0.02051147214110216,
        "fov": 1.5440768334336543
      },
      "linkHotspots": [
        {
          "yaw": -0.9974786603228409,
          "pitch": 0.32205566683942166,
          "rotation": 0,
          "target": "13-2andar_entrada"
        },
        {
          "yaw": 2.1386285061604005,
          "pitch": 0.2747502767486356,
          "rotation": 0,
          "target": "6-1andar_entrada"
        },
        {
          "yaw": 0.926910612215309,
          "pitch": 0.104999444926694,
          "rotation": 1.5707963267948966,
          "target": "1-terreo_entrada"
        },
        {
          "yaw": -0.3324183806148113,
          "pitch": 0.14366617954847882,
          "rotation": 4.71238898038469,
          "target": "4-terreo_corredor1"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -1.8139520379245049,
          "pitch": -0.403324105704872,
          "title": "<div>Elevador Segundo Andar</div>",
          "text": "<div>Elevador dedicado ao Segundo andar.</div>"
        },
        {
          "yaw": 1.4051459810406648,
          "pitch": -0.34821872369331075,
          "title": "Elevador Primeiro Andar",
          "text": "Elevador dedicado ao Primeiro andar"
        }
      ]
    },
    {
      "id": "4-terreo_corredor1",
      "name": "terreo_corredor1",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -0.6054663078055373,
          "pitch": 0.13672263688282982,
          "rotation": 4.71238898038469,
          "target": "5-terreo_corredor2"
        },
        {
          "yaw": 0.5656779555690896,
          "pitch": 0.04306405640208055,
          "rotation": 0,
          "target": "1-terreo_entrada"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "5-terreo_corredor2",
      "name": "terreo_corredor2",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 0.6864682716219548,
          "pitch": 0.04447970253648492,
          "rotation": 0,
          "target": "4-terreo_corredor1"
        },
        {
          "yaw": -0.7848736059738375,
          "pitch": 0.050438231616483975,
          "rotation": 0,
          "target": "2-salao_geral"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "6-1andar_entrada",
      "name": "1andar_entrada",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 2.050034534040293,
          "pitch": 0.3017440462468457,
          "rotation": 3.141592653589793,
          "target": "3-terreo_elevador"
        },
        {
          "yaw": -1.0208628742364425,
          "pitch": 0.299520404294098,
          "rotation": 0,
          "target": "13-2andar_entrada"
        },
        {
          "yaw": 0.5341805301438942,
          "pitch": 0.2069849663781298,
          "rotation": 0,
          "target": "7-1andar_meio_corredor"
        },
        {
          "yaw": -0.4276194451216693,
          "pitch": 0.10019783523180692,
          "rotation": 4.71238898038469,
          "target": "10-1andar_finalcorredor1"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "7-1andar_meio_corredor",
      "name": "1andar_meio_corredor",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "yaw": -1.1286203532641181,
        "pitch": 0.09946566585511007,
        "fov": 1.5440768334336543
      },
      "linkHotspots": [
        {
          "yaw": -1.1679684260707042,
          "pitch": 0.014542408739252721,
          "rotation": 0,
          "target": "12-1andar_finalcorredor_elevador"
        },
        {
          "yaw": -2.7227665155313066,
          "pitch": 0.0173387703257859,
          "rotation": 0,
          "target": "8-1andar_corredor_cubiculo"
        },
        {
          "yaw": 0.32567295168022703,
          "pitch": 0.0735140389276836,
          "rotation": 0,
          "target": "10-1andar_finalcorredor1"
        },
        {
          "yaw": 2.591750171776665,
          "pitch": 0.11888902881626606,
          "rotation": 0,
          "target": "6-1andar_entrada"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "8-1andar_corredor_cubiculo",
      "name": "1andar_corredor_cubiculo",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "yaw": 0.6066106106289606,
        "pitch": 0.035857420455599254,
        "fov": 1.5440768334336543
      },
      "linkHotspots": [
        {
          "yaw": -0.9104222650373508,
          "pitch": 0.05095048883063491,
          "rotation": 0,
          "target": "11-1andar_finalcorredor2"
        },
        {
          "yaw": 0.5948626313985557,
          "pitch": 0.025631069042844956,
          "rotation": 0,
          "target": "9-1andar_cubiculos"
        },
        {
          "yaw": 2.15583997955013,
          "pitch": 0.03651988580907073,
          "rotation": 1.5707963267948966,
          "target": "7-1andar_meio_corredor"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "9-1andar_cubiculos",
      "name": "1andar_cubiculos",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -3.111472642260484,
          "pitch": 0.053529127316583214,
          "rotation": 0,
          "target": "8-1andar_corredor_cubiculo"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "10-1andar_finalcorredor1",
      "name": "1andar_finalcorredor1",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 0.16837379716515244,
          "pitch": 0.18749542928628138,
          "rotation": 6.283185307179586,
          "target": "7-1andar_meio_corredor"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "11-1andar_finalcorredor2",
      "name": "1andar_finalcorredor2",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -0.011703259895687879,
          "pitch": -0.0061636813176733085,
          "rotation": 0,
          "target": "7-1andar_meio_corredor"
        },
        {
          "yaw": 0.11291987146567273,
          "pitch": 0.081265760355679,
          "rotation": 1.5707963267948966,
          "target": "8-1andar_corredor_cubiculo"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "12-1andar_finalcorredor_elevador",
      "name": "1andar_finalcorredor_elevador",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -0.010080766520776052,
          "pitch": 0.0516299832109155,
          "rotation": 0,
          "target": "7-1andar_meio_corredor"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "13-2andar_entrada",
      "name": "2andar_entrada",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "yaw": -0.012755593990792846,
        "pitch": 0.03846968536045736,
        "fov": 1.5440768334336543
      },
      "linkHotspots": [
        {
          "yaw": 0.4558803686598836,
          "pitch": 0.22130770695681612,
          "rotation": 0,
          "target": "14-2andar_corredor_elevador"
        },
        {
          "yaw": -0.5450525210780892,
          "pitch": 0.1350135255720879,
          "rotation": 4.71238898038469,
          "target": "17-2andar_entrada_sala"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 1.248939676011009,
          "pitch": -0.4197213651072751,
          "title": "Elevador Primeiro Andar",
          "text": "Elevador dedicado à volta do Primeiro andar"
        }
      ]
    },
    {
      "id": "14-2andar_corredor_elevador",
      "name": "2andar_corredor_elevador",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "yaw": 1.6788231059631507,
        "pitch": 0.1312777368145781,
        "fov": 1.5440768334336543
      },
      "linkHotspots": [
        {
          "yaw": 0.12892014096241944,
          "pitch": -0.005123530275650268,
          "rotation": 0,
          "target": "15-2andar_final_corredor"
        },
        {
          "yaw": 0.2533541115420892,
          "pitch": 0.08010674890354963,
          "rotation": 1.5707963267948966,
          "target": "17-2andar_entrada_sala"
        },
        {
          "yaw": 2.6417100670047713,
          "pitch": 0.15493776524154335,
          "rotation": 4.71238898038469,
          "target": "16-2andar_corredor_espelhado"
        },
        {
          "yaw": -1.4126489024095399,
          "pitch": 0.16934724409261648,
          "rotation": 0,
          "target": "13-2andar_entrada"
        },
        {
          "yaw": -3.028563669235327,
          "pitch": 0.07704607862750734,
          "rotation": 0,
          "target": "15-2andar_final_corredor"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "15-2andar_final_corredor",
      "name": "2andar_final_corredor",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "yaw": -0.8867847870025276,
        "pitch": 0.04827303461669352,
        "fov": 1.5440768334336543
      },
      "linkHotspots": [
        {
          "yaw": -0.9843662188313544,
          "pitch": 0.04983862276940343,
          "rotation": 4.71238898038469,
          "target": "17-2andar_entrada_sala"
        },
        {
          "yaw": -0.722319516275558,
          "pitch": 0.05189205334525582,
          "rotation": 7.853981633974483,
          "target": "14-2andar_corredor_elevador"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "16-2andar_corredor_espelhado",
      "name": "2andar_corredor_espelhado",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "yaw": 0.017613486820607704,
        "pitch": 0.08759201443747422,
        "fov": 1.5440768334336543
      },
      "linkHotspots": [
        {
          "yaw": 0.48238787940792704,
          "pitch": 0.035186141829994355,
          "rotation": 0,
          "target": "14-2andar_corredor_elevador"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "17-2andar_entrada_sala",
      "name": "2andar_entrada_sala",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 2.8016372889439376,
          "pitch": 0.04541430765364751,
          "rotation": 4.71238898038469,
          "target": "15-2andar_final_corredor"
        },
        {
          "yaw": -0.6272101585420398,
          "pitch": 0.23369933142909893,
          "rotation": 0,
          "target": "18-2andar_entrada_janelao"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "18-2andar_entrada_janelao",
      "name": "2andar_entrada_janelao",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "yaw": -3.1026475362728867,
        "pitch": 0.05133234153702304,
        "fov": 1.5440768334336543
      },
      "linkHotspots": [
        {
          "yaw": -3.077821683173733,
          "pitch": 0.3057442656253695,
          "rotation": 0,
          "target": "19-2andar_janelao"
        },
        {
          "yaw": 0.025294302950692682,
          "pitch": 0.1060799499586178,
          "rotation": 0,
          "target": "17-2andar_entrada_sala"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "19-2andar_janelao",
      "name": "2andar_janelao",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -2.6195844581094576,
          "pitch": 0.0834900485617851,
          "rotation": 1.5707963267948966,
          "target": "18-2andar_entrada_janelao"
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "Project Title",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": false,
    "fullscreenButton": true,
    "viewControlButtons": true
  }
};
