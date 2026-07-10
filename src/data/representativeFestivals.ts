import type { Festival, Region } from '../types'

/**
 * Curated list of Korea's representative festivals (문화관광축제 등), verified via
 * web research. Recurring start/end months let the D-day / status logic project
 * onto the current or next year. `imageUrl` is intentionally blank where no
 * stable public image is available (the card falls back to a gradient).
 */
interface RepSeed {
  name: string
  regionLabel: string
  location: string
  period: string
  startMonth: number
  endMonth: number
  description: string
  homepage: string
  imageUrl: string
}

const REGION_KEY: Record<string, Region> = {
  서울: 'seoul',
  '경기·인천': 'gyeonggi',
  '충청·대전·세종': 'chungcheong',
  '전라·광주': 'jeolla',
  '경북·대구': 'gyeongbuk',
  강원: 'gangwon',
  '경남·부산·울산': 'gyeongnam',
  제주: 'jeju',
}

/**
 * Verified Wikimedia Commons image URLs (all HTTP 200, image/*). A few are
 * sensible substitutes where no direct festival photo exists — the festival
 * venue or subject (marked below).
 */
const IMAGE_BY_NAME: Record<string, string> = {
  보령머드축제:
    'https://upload.wikimedia.org/wikipedia/commons/a/aa/Korea-Boryeong_Mud_Festival-01.jpg',
  부여서동연꽃축제:
    'https://upload.wikimedia.org/wikipedia/commons/9/94/%EA%B6%81%EB%82%A8%EC%A7%80-Gungnamji-6.jpg', // 개최지 궁남지
  금산인삼축제:
    'https://upload.wikimedia.org/wikipedia/commons/d/d8/Insam_%28ginseng%29.jpg', // 소재: 인삼
  진주남강유등축제:
    'https://upload.wikimedia.org/wikipedia/commons/d/d8/Jinju_namgang_lantern_festival.jpg',
  진해군항제:
    'https://upload.wikimedia.org/wikipedia/commons/1/1f/2015_Jinhae_Naval_Port_Festival_004.JPG',
  산청한방약초축제:
    'https://upload.wikimedia.org/wikipedia/commons/5/52/Korea_Sancheong_Traditional_Medicine_EXPO_09_%289993928964%29.jpg',
  안동국제탈춤페스티벌:
    'https://upload.wikimedia.org/wikipedia/commons/e/ef/Andong_Mask_Dance_Festival_2006-02.jpg',
  문경찻사발축제:
    'https://upload.wikimedia.org/wikipedia/commons/c/c7/Mungyeongsaejae_mountains.jpg', // 개최지 문경새재
  대구치맥페스티벌:
    'https://upload.wikimedia.org/wikipedia/commons/3/31/Ambassador_Mark_Lippert_visits_Daegu%27s_Chicken%26Beer_Festival._%2819882807409%29.jpg',
  화천산천어축제:
    'https://upload.wikimedia.org/wikipedia/commons/b/b8/Hwacheon_Sancheoneo_Ice_Festival_01_%2852620586388%29.jpg',
  강릉단오제:
    'https://upload.wikimedia.org/wikipedia/commons/b/b5/Korea_Gangneung_Danoje_Jangneung_64_%2814346986323%29.jpg',
  김제지평선축제:
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Gimje_Horizon_Festival.png',
  함평나비대축제:
    'https://upload.wikimedia.org/wikipedia/commons/7/7f/Hampyeong_butterfly_festival_007.JPG',
  담양대나무축제:
    'https://upload.wikimedia.org/wikipedia/commons/3/30/Bamboo_forest_in_Damyang_South_Korea_2015-05-06%286%29.jpg', // 죽녹원
  서울빛초롱축제:
    'https://upload.wikimedia.org/wikipedia/commons/4/4c/Lantern_Sculptures_at_the_2019_Seoul_Lantern_Festival.jpg',
  서울세계불꽃축제:
    'https://upload.wikimedia.org/wikipedia/commons/3/30/Seoul_international_fireworks_festival_2011-001.JPG',
  제주들불축제:
    'https://upload.wikimedia.org/wikipedia/commons/8/8d/Saebyeol_Oreum_01.jpg', // 개최지 새별오름
  이천쌀문화축제:
    'https://upload.wikimedia.org/wikipedia/commons/b/b1/Icheon_rice_festival.jpg',
  수원화성문화제:
    'https://upload.wikimedia.org/wikipedia/commons/e/ed/Hwaseong_Fortress_01.jpg', // 개최지 수원화성
}

const SEEDS: RepSeed[] = [
  {
    name: '보령머드축제',
    regionLabel: '충청·대전·세종',
    location: '충남 보령시 대천해수욕장 머드광장',
    period: '매년 7월 중순 ~ 8월 초순',
    startMonth: 7,
    endMonth: 8,
    description:
      '대천해수욕장의 청정 갯벌 머드를 활용한 체험형 축제로, 외국인에게도 널리 알려진 대한민국 대표 여름 축제이다.',
    homepage: 'https://www.mudfestival.or.kr/',
    imageUrl: '',
  },
  {
    name: '부여서동연꽃축제',
    regionLabel: '충청·대전·세종',
    location: '충남 부여군 부여읍 궁남지 일원',
    period: '매년 7월 초·중순',
    startMonth: 7,
    endMonth: 7,
    description:
      '우리나라 최고(最古)의 인공정원인 궁남지에 만개한 연꽃과 서동왕자·선화공주 설화를 주제로 한 여름 야간경관 축제이다.',
    homepage: 'https://xn--js0bz0g15jvvd8vh0a700bh8n.kr/',
    imageUrl: '',
  },
  {
    name: '금산인삼축제',
    regionLabel: '충청·대전·세종',
    location: '충남 금산군 인삼약초거리 및 인삼엑스포광장 일원',
    period: '매년 9월 중순 ~ 10월 초순',
    startMonth: 9,
    endMonth: 10,
    description:
      '1500여 년 역사의 고려인삼 종주지 금산에서 열리는 인삼·약초 특산물 축제로, 인삼 판매와 다양한 건강 체험이 어우러진다.',
    homepage: 'https://www.insamfestival.co.kr/',
    imageUrl: '',
  },
  {
    name: '진주남강유등축제',
    regionLabel: '경남·부산·울산',
    location: '경남 진주시 남강 및 진주성 일원',
    period: '매년 10월',
    startMonth: 10,
    endMonth: 10,
    description:
      '임진왜란 진주성 전투에서 군사 신호로 쓰인 유등에서 유래한 축제로, 남강을 수놓는 화려한 등불과 야간 퍼레이드가 장관을 이룬다.',
    homepage: 'https://yudeung.com/',
    imageUrl: '',
  },
  {
    name: '진해군항제',
    regionLabel: '경남·부산·울산',
    location: '경남 창원시 진해구 여좌천·경화역 일원',
    period: '매년 3월 말 ~ 4월 초',
    startMonth: 3,
    endMonth: 4,
    description:
      '36만여 그루의 벚꽃이 만개하는 대한민국 최대 규모의 벚꽃 축제로, 충무공 추모제와 군악·의장 행사가 함께 열린다.',
    homepage: 'http://www.jgfestival.or.kr/',
    imageUrl: '',
  },
  {
    name: '산청한방약초축제',
    regionLabel: '경남·부산·울산',
    location: '경남 산청군 금서면 동의보감촌 일원',
    period: '매년 9월 하순 ~ 10월 초',
    startMonth: 9,
    endMonth: 10,
    description:
      '지리산 자락 청정 약초와 허준·동의보감을 주제로 한 한방 축제로, 약초 체험과 건강 프로그램이 풍성하게 펼쳐진다.',
    homepage: 'http://scherb.or.kr/',
    imageUrl: '',
  },
  {
    name: '안동국제탈춤페스티벌',
    regionLabel: '경북·대구',
    location: '경북 안동시 탈춤공원 및 하회마을 일원',
    period: '매년 9월 말 ~ 10월 초',
    startMonth: 9,
    endMonth: 10,
    description:
      '하회별신굿탈놀이를 비롯한 국내외 탈춤 공연이 어우러지는 국제 축제로, 한국 전통문화를 대표하는 명품 축제이다.',
    homepage: 'https://www.maskdance.com/',
    imageUrl: '',
  },
  {
    name: '문경찻사발축제',
    regionLabel: '경북·대구',
    location: '경북 문경시 문경새재 오픈세트장 일원',
    period: '매년 4월 말 ~ 5월 초',
    startMonth: 4,
    endMonth: 5,
    description:
      '전통 도자기 찻사발과 문경 도예 장인들의 작품을 만나는 도자 축제로, 문경새재의 봄 경관과 함께 즐길 수 있다.',
    homepage: 'https://www.sabal21.com/',
    imageUrl: '',
  },
  {
    name: '대구치맥페스티벌',
    regionLabel: '경북·대구',
    location: '대구 달서구 두류공원 일원',
    period: '매년 7월 초·중순',
    startMonth: 7,
    endMonth: 7,
    description:
      '치킨과 맥주를 결합한 국내 최대 규모의 식음 축제로, 한여름 밤 다양한 공연과 함께 즐기는 대구 대표 여름 축제이다.',
    homepage: 'https://www.chimacfestival.com/',
    imageUrl: '',
  },
  {
    name: '화천산천어축제',
    regionLabel: '강원',
    location: '강원 화천군 화천읍 화천천 일원',
    period: '매년 1월 초 ~ 2월 초',
    startMonth: 1,
    endMonth: 2,
    description:
      '꽁꽁 언 화천천에서 즐기는 산천어 얼음낚시 축제로, 세계 4대 겨울축제로 꼽히는 대한민국 대표 겨울 축제이다.',
    homepage: 'https://www.narafestival.com/',
    imageUrl: '',
  },
  {
    name: '강릉단오제',
    regionLabel: '강원',
    location: '강원 강릉시 남대천 단오장 일원',
    period: '매년 음력 5월 5일 전후 (양력 6월)',
    startMonth: 6,
    endMonth: 6,
    description:
      '유네스코 인류무형문화유산으로 등재된 천년 역사의 전통 민속 축제로, 단오굿·관노가면극 등 전통 제례와 놀이가 펼쳐진다.',
    homepage: 'https://www.danojefestival.or.kr/',
    imageUrl: '',
  },
  {
    name: '김제지평선축제',
    regionLabel: '전라·광주',
    location: '전북 김제시 벽골제 일원',
    period: '매년 10월 초',
    startMonth: 10,
    endMonth: 10,
    description:
      '지평선이 보이는 드넓은 호남평야와 고대 저수지 벽골제를 배경으로 한 전통 농경문화 축제이다.',
    homepage: 'http://festival.gimje.go.kr/',
    imageUrl: '',
  },
  {
    name: '함평나비대축제',
    regionLabel: '전라·광주',
    location: '전남 함평군 함평엑스포공원 일원',
    period: '매년 4월 말 ~ 5월 초',
    startMonth: 4,
    endMonth: 5,
    description:
      '청정 자연 속 살아있는 나비와 봄꽃, 곤충을 주제로 한 생태 축제로, 온 가족이 함께 즐기는 봄 대표 축제이다.',
    homepage: 'https://www.hpftf.or.kr/',
    imageUrl: '',
  },
  {
    name: '담양대나무축제',
    regionLabel: '전라·광주',
    location: '전남 담양군 죽녹원 및 관방제림 일원',
    period: '매년 5월',
    startMonth: 5,
    endMonth: 5,
    description:
      '푸른 대나무숲 죽녹원을 중심으로 대나무를 활용한 다양한 체험과 공연이 어우러지는 담양 대표 축제이다.',
    homepage: 'https://www.bamboofestival.co.kr/',
    imageUrl: '',
  },
  {
    name: '서울빛초롱축제',
    regionLabel: '서울',
    location: '서울 중구 청계천 일원',
    period: '매년 11월 ~ 12월 (겨울)',
    startMonth: 11,
    endMonth: 12,
    description:
      '청계천을 따라 설치된 다채로운 전통·현대 등불이 도심의 밤을 밝히는 서울 대표 빛 축제이다.',
    homepage: 'https://www.stolantern.com/',
    imageUrl: '',
  },
  {
    name: '서울세계불꽃축제',
    regionLabel: '서울',
    location: '서울 영등포구 여의도한강공원 및 한강변 일원',
    period: '매년 9월 말 ~ 10월 초',
    startMonth: 10,
    endMonth: 10,
    description:
      '한화가 주최하는 국내 최대 규모의 불꽃 축제로, 여의도 한강 밤하늘을 수놓는 국내외 불꽃 팀들의 화려한 경연이 펼쳐진다.',
    homepage: 'https://www.hanwhafireworks.com/',
    imageUrl: '',
  },
  {
    name: '제주들불축제',
    regionLabel: '제주',
    location: '제주 제주시 애월읍 새별오름 일원',
    period: '매년 3월 (경칩 전후)',
    startMonth: 3,
    endMonth: 3,
    description:
      '제주의 옛 목축문화인 방애(들불 놓기)에서 유래한 축제로, 새별오름을 태우는 오름 불놓기가 장관을 이루는 제주 대표 봄 축제이다.',
    homepage: 'https://www.jejusi.go.kr/buriburi/main.do',
    imageUrl: '',
  },
  {
    name: '이천쌀문화축제',
    regionLabel: '경기·인천',
    location: '경기 이천시 이천농업테마공원 일원',
    period: '매년 10월 하순',
    startMonth: 10,
    endMonth: 10,
    description:
      '임금님표 이천쌀을 주제로 한 농경문화 축제로, 가마솥 밥짓기와 다양한 먹거리·체험 프로그램이 풍성하다.',
    homepage: 'http://www.ricefestival.or.kr/',
    imageUrl: '',
  },
  {
    name: '수원화성문화제',
    regionLabel: '경기·인천',
    location: '경기 수원시 화성행궁 및 수원화성 일원',
    period: '매년 10월 초',
    startMonth: 10,
    endMonth: 10,
    description:
      '유네스코 세계문화유산 수원화성을 배경으로 정조대왕 능행차와 조선시대 궁중문화를 재현하는 역사 문화 축제이다.',
    homepage: 'https://www.swcf.or.kr/hlfl/',
    imageUrl: '',
  },
]

export const REPRESENTATIVE_FESTIVALS: Festival[] = SEEDS.map((s, i) => ({
  id: `fest-rep-${i}`,
  name: s.name,
  region: REGION_KEY[s.regionLabel] ?? 'seoul',
  location: s.location,
  period: s.period,
  startMonth: s.startMonth,
  endMonth: s.endMonth,
  description: s.description,
  homepage: s.homepage,
  imageUrl: IMAGE_BY_NAME[s.name] ?? s.imageUrl,
  lat: null,
  lng: null,
}))
