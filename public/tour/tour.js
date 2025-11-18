window.TOUR_SCENES = [
  {
    id: "0-inicio_tour_tarde",
    preview: "tiles/0-inicio_tour_tarde/preview.jpg",
    links: [
      { yaw: 0.24801502410277187, pitch: 0.00508774673274992, target: "4-terreo_entrada" }
    ]
  },
  {
    id: "1-terreo_corredor1",
    preview: "tiles/1-terreo_corredor1/preview.jpg",
    links: [
      { yaw: 1.0735606268200542, pitch: 0.03738691076886269, target: "4-terreo_entrada" },
      { yaw: -1.1153978683053865, pitch: 0.10868417225476534, target: "2-terreo_corredor2" }
    ]
  },
  {
    id: "2-terreo_corredor2",
    preview: "tiles/2-terreo_corredor2/preview.jpg",
    links: [
      { yaw: 0.5929105891396542, pitch: 0.0424899989512042, target: "1-terreo_corredor1" },
      { yaw: -0.9132415475924489, pitch: 0.012539750143877981, target: "5-terreo_salao" }
    ]
  },
  {
    id: "3-terreo_elevadores",
    preview: "tiles/3-terreo_elevadores/preview.jpg",
    links: [
      { yaw: 0.6192906781599206, pitch: 0.11086410118181256, target: "4-terreo_entrada" },
      { yaw: -0.544399187359252, pitch: 0.12670496266287756, target: "1-terreo_corredor1" },
      { yaw: 0.2417422605399313, pitch: 0.06626956663803796, target: "5-terreo_salao" },
      { yaw: -1.1393748211895662, pitch: 0.26623227553930384, target: "11-2andar_entrada" }
    ]
  },
  {
    id: "4-terreo_entrada",
    preview: "tiles/4-terreo_entrada/preview.jpg",
    links: [
      { yaw: -0.22367681620762525, pitch: 0.039844590852032624, target: "1-terreo_corredor1" },
      { yaw: 0.6609768248997749, pitch: 0.09264028829624138, target: "5-terreo_salao" },
      { yaw: -0.6927287621561504, pitch: 0.08187682611910674, target: "3-terreo_elevadores" },
      { yaw: 2.876320631705182, pitch: 0.09803303902510763, target: "0-inicio_tour_tarde" }
    ]
  },
  {
    id: "5-terreo_salao",
    preview: "tiles/5-terreo_salao/preview.jpg",
    links: [
      { yaw: -0.6710212006368828, pitch: 0.03263231645916065, target: "4-terreo_entrada" },
      { yaw: 0.5467844882970567, pitch: 0.03511967101082725, target: "2-terreo_corredor2" }
    ]
  },
  {
    id: "6-2andar_corredor_final",
    preview: "tiles/6-2andar_corredor_final/preview.jpg",
    links: [
      { yaw: -0.0049000819968973985, pitch: 0.07312228294958167, target: "9-2andar_corredor2" }
    ]
  },
  {
    id: "7-2andar_corredor1",
    preview: "tiles/7-2andar_corredor1/preview.jpg",
    links: [
      { yaw: 0.026253178226600227, pitch: 0.06762324156693467, target: "8-2andar_corredor1-2" },
      { yaw: -1.5374510846373255, pitch: 0.02195658292280278, target: "9-2andar_corredor2" },
      { yaw: -2.557966832549498, pitch: 0.11788250051217908, target: "11-2andar_entrada" }
    ]
  },
  {
    id: "8-2andar_corredor1-2",
    preview: "tiles/8-2andar_corredor1-2/preview.jpg",
    links: [
      { yaw: 0.006406430531882279, pitch: 0.04838802936830078, target: "7-2andar_corredor1" }
    ]
  },
  {
    id: "9-2andar_corredor2",
    preview: "tiles/9-2andar_corredor2/preview.jpg",
    links: [
      { yaw: 0.00174014230031716, pitch: 0.04703195185015119, target: "10-2andar_corredor2-2" },
      { yaw: 1.572300005945948, pitch: 0.04345235965113581, target: "7-2andar_corredor1" },
      { yaw: -1.5873851090988556, pitch: 0.043734765259030084, target: "6-2andar_corredor_final" }
    ]
  },
  {
    id: "10-2andar_corredor2-2",
    preview: "tiles/10-2andar_corredor2-2/preview.jpg",
    links: [
      { yaw: 2.4352585411517165, pitch: 0.040160919801659034, target: "12-2andar_janelao" },
      { yaw: -0.5882837593353454, pitch: 0.08316966361907063, target: "9-2andar_corredor2" }
    ]
  },
  {
    id: "11-2andar_entrada",
    preview: "tiles/11-2andar_entrada/preview.jpg",
    links: [
      { yaw: 0.4208326168486831, pitch: 0.06125981046817408, target: "7-2andar_corredor1" },
      { yaw: -0.5203533756405783, pitch: 0.09070635501270097, target: "9-2andar_corredor2" },
      { yaw: 1.9085886808972115, pitch: 0.3648145815216566, target: "3-terreo_elevadores" },
      { yaw: -1.0090349037202504, pitch: 0.17360072002386673, target: "3-terreo_elevadores" }
    ]
  },
  {
    id: "12-2andar_janelao",
    preview: "tiles/12-2andar_janelao/preview.jpg",
    links: [
      { yaw: 0.6899414975927023, pitch: 0.012381008166356011, target: "10-2andar_corredor2-2" }
    ]
  }
];
