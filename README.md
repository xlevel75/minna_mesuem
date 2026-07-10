# Museum Contents

전국 박물관·문화행사·축제를 모바일에서 둘러보는 React + Vite 웹앱.

## 탭

- **지도** — 전국 박물관·미술관 ~1074곳을 Leaflet 지도에 클러스터링해 표시. 카테고리별 아이콘, 팝업 → 상세 시트, 이름/지역 검색 및 카테고리 필터.
- **행사** — KCISA 오픈 API 기반 현재 전시·공연을 접이식 섹션으로 제공. 카테고리·지역 필터, "지도로 보기".
- **축제** — 실시간 지역 축제(API) + 한국의 대표 축제(큐레이션). D-day/진행중 상태 배지, 이미지 카드.

## 개발

```bash
npm install
npm run dev      # 개발 서버 (KCISA API 프록시 포함)
npm run build    # 타입체크 + 프로덕션 빌드
npm run lint
npm test
```

Node 20.15 / Vite 6 기준. 자세한 아키텍처와 제약은 [CLAUDE.md](CLAUDE.md) 참고.

## 데이터 출처

- 박물관: 전국박물관미술관정보표준데이터 (`public/data/museums.json`)
- 전시/공연: KCISA API_CCA_145, CNV_060
- 축제: KCISA getKCPG0504 + 큐레이션 대표 축제

> KCISA API는 `http`/CORS 제약으로 브라우저에서 직접 호출할 수 없어 개발 서버 프록시(`/kcisa`)를 사용합니다. 프로덕션 배포 시 별도 백엔드 프록시가 필요합니다.
