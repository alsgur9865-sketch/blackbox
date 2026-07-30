# 블랙박스 (Blackbox) — 랜딩페이지

> **AI 투자 복기 · 자기진단 리포트 서비스**
> 태그라인: 내 투자 실수엔 패턴이 있다
> 스프린트 미션 5 제출물 · 2026.07

---

## 1. 프로젝트 소개

거래내역을 올리면 AI가 반복되는 투자 실수 패턴(**FINDING**)을 찾아 이름 붙여주는 서비스의 사전 신청 랜딩페이지입니다.
종목 추천 서비스가 아니며, 과거 매매에 대한 **복기·자기진단**에 집중합니다.

| 항목 | 내용 |
|---|---|
| 1순위 타깃 | 첫 손실 후 원인이 궁금한 투자 1~3년차 (20~30대) |
| 핵심 메시지 | 내 투자 실수엔 **패턴**이 있다 |
| 주 CTA | 사전 신청 모달 (이메일 + 투자 경력) |
| 유입 경로 | 토스 커뮤니티 · 네이버 주식카페 → 모바일 비중 높음 |

---

## 2. 파일 구조

```
blackbox-landing/
├─ index.html          ← 압축 파일 최상위 경로
├─ css/
│  └─ style.css        디자인 토큰 + 전체 스타일 (24개 섹션 주석)
├─ js/
│  └─ main.js          Vanilla JS 7개 모듈
├─ assets/
│  ├─ og-image.png     1200×630 소셜 공유 이미지
│  ├─ logo.svg         브랜드 마크
│  └─ favicon.svg      파비콘
└─ README.md
```

**기술 스택**: HTML5 · CSS3 · Vanilla JavaScript
프레임워크 · 빌드 도구 · npm · 외부 JS 라이브러리를 일절 사용하지 않았습니다.
폰트만 CDN(Pretendard, JetBrains Mono)에서 불러옵니다.

---

## 3. 섹션 구성

| # | 섹션 | 역할 |
|---|---|---|
| — | `header` (sticky) | 로고 · 앵커 내비 · CTA · 모바일 햄버거 |
| ① | Hero | 태그라인 + CTA 2개 + FINDING 미리보기 카드 |
| ② | Problem | "이런 적 없나요?" 3카드 |
| ③ | How it works | 업로드 → AI 분석 → FINDING 3스텝 |
| ④ | Pattern library | 4가지 실수 패턴 + 프로그레스 미터 |
| ⑤ | Sample report | 무료 리포트 목업 |
| ⑥ | Checklist | 매수 전 체크리스트 (인터랙티브) |
| ⑦ | Community | 복기 결과 공유 카드 |
| ⑧ | Pricing | 무료 / 9,900원 (Fake Door) |
| ⑨ | FAQ | 아코디언 5문항 |
| ⑩ | Final CTA | 마지막 전환 유도 |
| — | `footer` | 링크 · 투자 추천 아님 면책 고지 |
| — | 모바일 하단 고정바 | 400px 스크롤 후 등장 |

---

## 4. 요구사항 대응

### 기본 요구사항

| 항목 | 구현 위치 |
|---|---|
| 시맨틱 태그 | `header` · `main` · `section`×10 · `footer` · `nav`×3 · `article` · `ol`/`ul` |
| 히어로 / 기능 소개 / CTA | ① Hero · ③④ 기능 · ⑩ Final CTA |
| 컬러 · 타이포 통일 | `style.css` §00 Design Tokens (CSS 변수 24개) |
| Flex / Grid | `.grid-2` `.grid-3` `.grid-4` `.steps` — 전부 CSS Grid `auto-fit` |
| 일관된 UI 스타일 | 라운드 카드 12px / 버튼 10px / 배지 4px, 8px 여백 그리드 |

### 심화 요구사항

| 항목 | 구현 |
|---|---|
| 미디어 쿼리 | 1024px · 768px · 480px 3단 브레이크포인트 |
| 스크롤 애니메이션 | `IntersectionObserver` + `.reveal--d1~d3` 스태거 |
| 호버 효과 | 카드 `translateY(-4px)`, 버튼 `brightness`, 내비 밑줄 `scaleX` |
| 메뉴 토글 | 햄버거 + `aria-expanded` / `aria-controls` 연동 |
| CTA 피드백 | 사전 신청 모달 → 이메일 검증 → 완료 화면 전환 |
| 아이콘 | 전부 인라인 SVG (외부 아이콘 라이브러리 없음) |
| `alt` 속성 | 헤더 · 푸터 로고 `<img alt="블랙박스 로고">`, 장식 SVG는 `aria-hidden` |
| 키보드 탐색 | 스킵 링크, `:focus-visible` 전역, 모달 포커스 트랩 |

### 접근성 상세

- `<html lang="ko">`
- 스킵 링크 (`Tab` 첫 진입 시 노출)
- 모든 섹션에 `aria-labelledby`
- 모달: `role="dialog"` · `aria-modal` · `Esc` 닫기 · `Tab` 포커스 트랩 · 배경 스크롤 잠금 · 닫을 때 이전 포커스 복원
- 체크리스트는 네이티브 `<input type="checkbox">` + `<label>` (JS 없이 키보드 조작 가능)
- 내비게이션 스크롤 스파이 → `aria-current="true"`
- `prefers-reduced-motion: reduce` 대응
- `<noscript>` 폴백 — JS 없이도 전체 콘텐츠 노출
- 터치 타깃 최소 44px

---

## 5. 로컬에서 실행

`index.html`을 브라우저로 바로 열어도 동작합니다.
로컬 서버로 확인하려면:

```bash
# Python 3
python3 -m http.server 8000
# → http://localhost:8000
```

---

## 6. Vercel 배포

### GitHub 연동 방식

```bash
git init
git add .
git commit -m "feat: 블랙박스 랜딩페이지"
git branch -M main
git remote add origin <저장소 URL>
git push -u origin main
```

1. [vercel.com](https://vercel.com) 로그인 → **Add New → Project**
2. GitHub 저장소 Import
3. 설정값
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: **비움**
   - Output Directory: **비움**
4. **Deploy**

### 드래그 앤 드롭 방식

Vercel 대시보드에 `blackbox-landing` 폴더를 그대로 끌어다 놓으면 즉시 배포됩니다.

### 배포 후 확인

- [ ] 모바일 실기기 접속
- [ ] 개발자도구 Network 탭에서 CSS · JS · 폰트 404 없음
- [ ] 경로 대소문자 일치 (로컬은 통과해도 배포 시 404 나는 대표 원인)
- [ ] CTA 모달 정상 동작
- [ ] OG 이미지 미리보기 (`https://www.opengraph.xyz` 등에서 확인)

---

## 7. zip 압축 주의사항

`index.html`이 **압축 파일 최상위 경로**에 있어야 합니다.

```
✅ blackbox-landing.zip
   ├─ index.html
   ├─ css/
   ├─ js/
   └─ assets/

❌ blackbox-landing.zip
   └─ blackbox-landing/
      └─ index.html      ← 요구사항 위반
```

폴더를 통째로 압축하지 말고, **폴더 안으로 들어가 파일들을 선택해서** 압축하세요.

---

## 8. 카피라이팅 가드레일

투자 서비스라 표현을 엄격히 제한했습니다.

| 사용한 표현 | 사용하지 않은 표현 |
|---|---|
| 과거 매매를 복기한다 | 종목을 추천한다 |
| 실수 패턴을 진단한다 | 수익률을 올려준다 |
| 투자 습관을 개선한다 | 투자 방향성을 결정해준다 |
| 데이터로 보여준다 | 성공한 투자자로 만들어준다 |

"투자 추천이 아님"을 Hero 캡션 · FAQ 2번 · 푸터 면책 고지 **3곳**에서 반복 명시했습니다.
패턴 검출 빈도 수치는 예시임을 별도 캡션으로 표기했습니다.

---

## 9. 디자인 시스템

### 컬러

| 토큰 | 값 | 용도 |
|---|---|---|
| `--bg-deep` | `#060B14` | 페이지 기본 배경 |
| `--bg-surface` | `#0D1626` | 섹션 대비 배경 |
| `--bg-card` | `#111D2E` | 카드 배경 |
| `--border` | `rgba(255,255,255,.07)` | 기본 테두리 |
| `--border-hi` | `rgba(255,255,255,.14)` | 강조 · 호버 테두리 |
| `--orange` | `#F97316` | Primary 액션 |
| `--red` | `#E5383B` | 경고 · 손실 지표 |
| `--text-1` | `#EDF2FF` | 본문 강조 |
| `--text-2` | `#8896AD` | 보조 텍스트 |
| `--text-3` | `#4D5E74` | 캡션 · 비활성 |

### 타이포그래피

- 헤드라인 · 본문: **Pretendard** — H1 `clamp(32px, 6vw, 64px)` / weight 800 / `letter-spacing: -0.03em`
- 캡션 · 라벨 · 수치: **JetBrains Mono** — 9.5~13px / `letter-spacing: 0.12em` / uppercase
- 한글 줄바꿈 깨짐 방지: `word-break: keep-all` 전역 적용

### 스타일 규칙

**적용**
- 라운드: 카드 12px · 버튼 10px · 배지 4px
- 여백: 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px (8px 그리드)
- 미세 그리드 오버레이 + 노이즈 텍스처로 "포렌식" 질감
- 데이터는 CSS로 그린 미니 바차트 · 프로그레스바로 표현

**금지**
- 그라디언트 배경 · 글로우 블러
- 추상적 3D 렌더링 · 스톡 일러스트
- 이모지를 아이콘 대용으로 사용
- 상승 화살표 · 우상향 차트 (수익 추천 서비스로 오인)

> 레퍼런스 무드: Linear · Notion · Toss — 진단서 · 사고기록장치 톤

---

## 10. 라이선스 · 고지

본 페이지는 투자자문·투자추천 서비스가 아니며, 제공되는 모든 진단 결과는 참고용입니다.
투자의 최종 판단과 책임은 이용자 본인에게 있습니다.

폰트: Pretendard (OFL-1.1) · JetBrains Mono (OFL-1.1)

---

## 11. 변경 이력

### v1.1 (2026.07.30) — 최종 수정 3건

| # | 수정 내용 | 파일 |
|---|---|---|
| 1 | `③ How it works` 스텝 사이 **점선(`.step__line`) 전면 삭제** — STEP 02·03 라벨과 겹쳐 보이는 문제 | `index.html`, `css/style.css` |
| 2 | 로고 마크를 **라운드 스퀘어 + 라인 형태**로 교체하고 브랜드 오렌지(`#F97316`) 적용, 파비콘 통일. 마크 크기 14px → 20px(푸터 18px) | `assets/logo.svg`, `assets/favicon.svg`, `css/style.css` |
| 3 | 사전 신청 모달 **투자 경력 `<select>` 가시성 개선** — `color-scheme: dark` + `option` 배경·글자색 명시로 흰 배경에 밝은 글씨가 묻히던 문제 해결, 커스텀 오렌지 화살표 추가 | `css/style.css` |
