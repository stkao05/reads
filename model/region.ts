export type RegionCode =
  | "taipei"
  | "keelung"
  | "new-taipei"
  | "taoyuan"
  | "hsinchu"
  | "miaoli"
  | "taichung"
  | "changhua"
  | "nantou"
  | "yunlin"
  | "chiayi"
  | "tainan"
  | "kaohsiung"
  | "pingtung"
  | "taitung"
  | "hualien"
  | "yilan"
  | "outlying";

export type Region = {
  name: string;
  code: RegionCode;
  bound?: {
    northeast: {
      lat: number;
      lng: number;
    };
    southwest: {
      lat: number;
      lng: number;
    };
  };
};

export const regions: Region[] = [
  {
    name: "台北",
    code: "taipei",
    bound: {
      northeast: {
        lat: 25.21030384327183,
        lng: 121.6659421062276,
      },
      southwest: {
        lat: 24.96050843192375,
        lng: 121.4570602672167,
      },
    },
  },
  {
    name: "基隆",
    code: "keelung",
    bound: {
      northeast: {
        lat: 25.19562806276866,
        lng: 121.808450609494,
      },
      southwest: {
        lat: 25.05246638796785,
        lng: 121.6267972509956,
      },
    },
  },
  {
    name: "新北",
    code: "new-taipei",
    bound: {
      northeast: {
        lat: 25.3011501996953,
        lng: 122.0069051529547,
      },
      southwest: {
        lat: 24.67318506386087,
        lng: 121.2826734839207,
      },
    },
  },
  {
    name: "桃園",
    code: "taoyuan",
    bound: {
      northeast: {
        lat: 25.1183727040124,
        lng: 121.4000569500859,
      },
      southwest: {
        lat: 24.83022947244107,
        lng: 121.0214126505539,
      },
    },
  },
  {
    name: "新竹",
    code: "hsinchu",
    bound: {
      northeast: {
        lat: 24.82613855029253,
        lng: 121.0292241620253,
      },
      southwest: {
        lat: 24.74081954464219,
        lng: 120.9041431185356,
      },
    },
  },
  {
    name: "苗栗",
    code: "miaoli",
    bound: {
      northeast: {
        lat: 24.74108203163255,
        lng: 121.2626344277309,
      },
      southwest: {
        lat: 24.28852932323007,
        lng: 120.6208251260396,
      },
    },
  },
  {
    name: "台中",
    code: "taichung",
    bound: {
      northeast: {
        lat: 24.44169755152591,
        lng: 121.4509512295411,
      },
      southwest: {
        lat: 23.99850862585695,
        lng: 120.4607974713122,
      },
    },
  },
  {
    name: "彰化",
    code: "changhua",
    bound: {
      northeast: {
        lat: 24.09892433976498,
        lng: 120.629394,
      },
      southwest: {
        lat: 23.854991,
        lng: 120.289756,
      },
    },
  },
  {
    name: "南投",
    code: "nantou",
    bound: {
      northeast: {
        lat: 24.2463089410465,
        lng: 121.3494752348515,
      },
      southwest: {
        lat: 23.43538500240428,
        lng: 120.6155614446887,
      },
    },
  },
  {
    name: "雲林",
    code: "yunlin",
    bound: {
      northeast: {
        lat: 23.84433155182458,
        lng: 120.7362057132759,
      },
      southwest: {
        lat: 23.50431470875632,
        lng: 120.1329779631994,
      },
    },
  },
  {
    name: "嘉義",
    code: "chiayi",
    bound: {
      northeast: {
        lat: 23.51064872338797,
        lng: 120.4921533960485,
      },
      southwest: {
        lat: 23.45320614560627,
        lng: 120.3934894564538,
      },
    },
  },
  {
    name: "台南",
    code: "tainan",
    bound: {
      northeast: {
        lat: 23.41375679493242,
        lng: 120.6562595831348,
      },
      southwest: {
        lat: 22.88749077297117,
        lng: 120.0277764672772,
      },
    },
  },
  {
    name: "高雄",
    code: "kaohsiung",
    bound: {
      northeast: {
        lat: 23.47172671523912,
        lng: 121.049014734923,
      },
      southwest: {
        lat: 20.51700005687294,
        lng: 116.6665000332656,
      },
    },
  },
  {
    name: "屏東",
    code: "pingtung",
    bound: {
      northeast: {
        lat: 22.88518443701693,
        lng: 120.9042007473567,
      },
      southwest: {
        lat: 21.89669581803975,
        lng: 120.3526403646489,
      },
    },
  },
  {
    name: "台東",
    code: "taitung",
    bound: {
      northeast: {
        lat: 23.44372302324274,
        lng: 121.6012347761384,
      },
      southwest: {
        lat: 21.99996174361468,
        lng: 120.7390580694551,
      },
    },
  },
  {
    name: "花蓮",
    code: "hualien",
    bound: {
      northeast: {
        lat: 24.3705599720216,
        lng: 121.7736010467336,
      },
      southwest: {
        lat: 23.09779827895698,
        lng: 120.9866267483161,
      },
    },
  },
  {
    name: "宜蘭",
    code: "yilan",
    bound: {
      northeast: {
        lat: 25.76513254282132,
        lng: 123.5021011603597,
      },
      southwest: {
        lat: 24.30944474674251,
        lng: 121.3167219446224,
      },
    },
  },
  {
    name: "離島",
    code: "outlying",
    bound: {
      northeast: {
        lat: 22.0199189,
        lng: 118.3176641,
      },
      southwest: {
        lat: 24.4481498,
        lng: 121.5624065,
      },
    },
  },
  // { name: "澎湖", code: "penghu" },
  // { name: "金門", code: "kinmen" },
];

export const regionCodes = regions.map((r) => r.code);

export function getRegion(code: RegionCode): Region {
  return regions.find((x) => x.code == code) as Region;
}

export function findRegion(address: string): Region | null {
  return regions.find((x) => address.includes(x.name)) || null;
}
