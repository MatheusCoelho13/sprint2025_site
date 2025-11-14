var APP_DATA = {
  "scenes": [
    {
      "id": "0-inicio_tour_tarde",
      "name": "inicio_tour_tarde",
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
        },
        {
          "tileSize": 512,
          "size": 4096
        }
      ],
      "faceSize": 4096,
      "initialViewParameters": {
        "yaw": 0.139334911815304,
        "pitch": -0.11152903237215206,
        "fov": 1.304933665046217
      },
      "linkHotspots": [
        {
          "yaw": 0.24801502410277187,
          "pitch": 0.00508774673274992,
          "rotation": 0,
          "target": "4-terreo_entrada"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1-terreo_corredor1",
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
          "yaw": 1.0735606268200542,
          "pitch": 0.03738691076886269,
          "rotation": 0,
          "target": "4-terreo_entrada"
        },
        {
          "yaw": -1.1153978683053865,
          "pitch": 0.10868417225476534,
          "rotation": 1.5707963267948966,
          "target": "2-terreo_corredor2"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "2-terreo_corredor2",
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
        "yaw": -0.33957463809719,
        "pitch": 0.018769593550754138,
        "fov": 1.304933665046217
      },
      "linkHotspots": [
        {
          "yaw": 0.5929105891396542,
          "pitch": 0.0424899989512042,
          "rotation": 0,
          "target": "1-terreo_corredor1"
        },
        {
          "yaw": -0.9132415475924489,
          "pitch": 0.012539750143877981,
          "rotation": 0,
          "target": "5-terreo_salao"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "3-terreo_elevadores",
      "name": "terreo_elevadores",
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
          "yaw": 0.6192906781599206,
          "pitch": 0.11086410118181256,
          "rotation": 1.5707963267948966,
          "target": "4-terreo_entrada"
        },
        {
          "yaw": -0.544399187359252,
          "pitch": 0.12670496266287756,
          "rotation": 4.71238898038469,
          "target": "1-terreo_corredor1"
        },
        {
          "yaw": 0.2417422605399313,
          "pitch": 0.06626956663803796,
          "rotation": 0,
          "target": "5-terreo_salao"
        },
        {
          "yaw": -1.1393748211895662,
          "pitch": 0.26623227553930384,
          "rotation": 0,
          "target": "11-2andar_entrada"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 1.1223982082887503,
          "pitch": -0.4120452532640684,
          "title": "Elevador do Primeiro andar",
          "text": "Elevador utilizado exclusivamente para o primeiro andar"
        },
        {
          "yaw": -1.8837982097018262,
          "pitch": -0.344615595680672,
          "title": "Elevador do Segundo andar",
          "text": "Elevador utilizado exclusivamente ao Segundo andar"
        }
      ]
    },
    {
      "id": "4-terreo_entrada",
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
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -0.22367681620762525,
          "pitch": 0.039844590852032624,
          "rotation": 0,
          "target": "1-terreo_corredor1"
        },
        {
          "yaw": 0.6609768248997749,
          "pitch": 0.09264028829624138,
          "rotation": 1.5707963267948966,
          "target": "5-terreo_salao"
        },
        {
          "yaw": -0.6927287621561504,
          "pitch": 0.08187682611910674,
          "rotation": 0,
          "target": "3-terreo_elevadores"
        },
        {
          "yaw": 2.876320631705182,
          "pitch": 0.09803303902510763,
          "rotation": 0,
          "target": "0-inicio_tour_tarde"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "5-terreo_salao",
      "name": "terreo_salao",
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
        "yaw": -0.10302647472678927,
        "pitch": 0.03179853158507129,
        "fov": 1.304933665046217
      },
      "linkHotspots": [
        {
          "yaw": -0.6710212006368828,
          "pitch": 0.03263231645916065,
          "rotation": 0,
          "target": "4-terreo_entrada"
        },
        {
          "yaw": 0.5467844882970567,
          "pitch": 0.03511967101082725,
          "rotation": 0,
          "target": "2-terreo_corredor2"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "6-2andar_corredor_final",
      "name": "2andar_corredor_final",
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
          "yaw": -0.0049000819968973985,
          "pitch": 0.07312228294958167,
          "rotation": 0,
          "target": "9-2andar_corredor2"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "7-2andar_corredor1",
      "name": "2andar_corredor1",
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
        "yaw": -0.013525102140311773,
        "pitch": 0.014766242109098826,
        "fov": 1.304933665046217
      },
      "linkHotspots": [
        {
          "yaw": 0.026253178226600227,
          "pitch": 0.06762324156693467,
          "rotation": 0,
          "target": "8-2andar_corredor1-2"
        },
        {
          "yaw": -1.5374510846373255,
          "pitch": 0.02195658292280278,
          "rotation": 0,
          "target": "9-2andar_corredor2"
        },
        {
          "yaw": -2.557966832549498,
          "pitch": 0.11788250051217908,
          "rotation": 0,
          "target": "11-2andar_entrada"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 0.3884210452177861,
          "pitch": 0.10381383085596774,
          "title": "anprotec",
          "text": "<span style=\"font-size: 13px;\">@Anprotec30</span>"
        },
        {
          "yaw": -0.6929630959672046,
          "pitch": 0.1437908302947477,
          "title": "br.ino",
          "text": "@br.ino_edu"
        }
      ]
    },
    {
      "id": "8-2andar_corredor1-2",
      "name": "2andar_corredor1-2",
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
          "yaw": 0.006406430531882279,
          "pitch": 0.04838802936830078,
          "rotation": 0,
          "target": "7-2andar_corredor1"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 2.800821734041893,
          "pitch": 0.13874037697052444,
          "title": "<font color=\"#f5f5f5\" face=\"-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif\"><span style=\"font-size: 14px; white-space-collapse: preserve-breaks;\">ABIPTI</span></font>",
          "text": "@abipti_abipti"
        }
      ]
    },
    {
      "id": "9-2andar_corredor2",
      "name": "2andar_corredor2",
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
          "yaw": 0.00174014230031716,
          "pitch": 0.04703195185015119,
          "rotation": 0,
          "target": "10-2andar_corredor2-2"
        },
        {
          "yaw": 1.572300005945948,
          "pitch": 0.04345235965113581,
          "rotation": 0,
          "target": "7-2andar_corredor1"
        },
        {
          "yaw": -1.5873851090988556,
          "pitch": 0.043734765259030084,
          "rotation": 0,
          "target": "6-2andar_corredor_final"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 0.3874990602062134,
          "pitch": 0.18001259902417033,
          "title": "brino",
          "text": "@br.ino_edu"
        },
        {
          "yaw": -0.7330632226372309,
          "pitch": 0.15988088605014994,
          "title": "Spin engenharia",
          "text": "@spinengenharia"
        },
        {
          "yaw": -0.24125078856445548,
          "pitch": -0.07967797761223494,
          "title": "UnDF",
          "text": "@undf.oficial"
        }
      ]
    },
    {
      "id": "10-2andar_corredor2-2",
      "name": "2andar_corredor2-2",
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
          "yaw": 2.4352585411517165,
          "pitch": 0.040160919801659034,
          "rotation": 0,
          "target": "12-2andar_janelao"
        },
        {
          "yaw": -0.5882837593353454,
          "pitch": 0.08316966361907063,
          "rotation": 0,
          "target": "9-2andar_corredor2"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "11-2andar_entrada",
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
        "yaw": 0.036822635525659564,
        "pitch": 0.10609626685174689,
        "fov": 1.304933665046217
      },
      "linkHotspots": [
        {
          "yaw": 0.4208326168486831,
          "pitch": 0.06125981046817408,
          "rotation": 0,
          "target": "7-2andar_corredor1"
        },
        {
          "yaw": -0.5203533756405783,
          "pitch": 0.09070635501270097,
          "rotation": 4.71238898038469,
          "target": "9-2andar_corredor2"
        },
        {
          "yaw": 1.9085886808972115,
          "pitch": 0.3648145815216566,
          "rotation": 3.141592653589793,
          "target": "3-terreo_elevadores"
        },
        {
          "yaw": -1.0090349037202504,
          "pitch": 0.17360072002386673,
          "rotation": 3.141592653589793,
          "target": "3-terreo_elevadores"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -1.6571860042211775,
          "pitch": -0.33083330703237657,
          "title": "Elevador do Terreo",
          "text": "Text"
        },
        {
          "yaw": 0.9148878759253378,
          "pitch": -0.5323007000131437,
          "title": "Elevador do Primeiro andar",
          "text": "Text"
        }
      ]
    },
    {
      "id": "12-2andar_janelao",
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
          "yaw": 0.6899414975927023,
          "pitch": 0.012381008166356011,
          "rotation": 7.853981633974483,
          "target": "10-2andar_corredor2-2"
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "BioTIC1",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": false,
    "fullscreenButton": true,
    "viewControlButtons": true
  }
};
