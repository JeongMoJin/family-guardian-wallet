# 가디언월렛 진행 일지

내부 작업 기록. 외부에 보일 README 와는 별개. 다음 세션 시작 시 이 문서부터 읽고 이어가면 됨.

## 일정

| 마일스톤 | 날짜 | 비고 |
|---|---|---|
| KFIP 1차 서류 마감 | 2026-05-13 (수) 23:59 | D-16 (오늘 4/27 기준) |
| 본선 진출 발표 | 2026-05-27 | |
| Final Pitch Day | 2026-06-25 | Two IFC Seoul |

5/13 제출물: 신청서 PDF, 프로젝트 소개, GitHub, XRPL 시니어 주소, 웹 데모 링크 + 영상 링크.

## Phase 진행 상태

| Phase | 상태 | 설명 |
|---|---|---|
| Phase 1 | 코드 완료 / 사용자 testnet 검증 미확인 | testnet multisig 코어 + CLI 스크립트 |
| Phase 2 Day 1 | 완료 (실제 구동 미확인) | 백엔드 Express + 프론트 Vite/React/Tailwind 스캐폴드 + 시니어 화면 v0 |
| Phase 2 Day 2 | 코드 완료 / 사용자 흐름 검증 미확인 | 송금 큐 + 가디언 서명 자동 결합/제출, 가디언/시연 화면, ?role/?demo 라우팅 |
| Phase 3 | 진행 중 | Render Free 배포 청사진(render.yaml), 신청서 PDF, 데모 영상 |

---

## Phase 1: testnet multisig 코어 (이전 세션 완료)

### 산출물
- `src/xrpl/{client.ts, types.ts, setup-signers.ts, multisign.ts}` — XRPL 코어 헬퍼
- `src/scripts/01-create-accounts.ts` — testnet faucet 으로 시니어/가디언1/2/3 계정 생성, `.env` 자동 작성
- `src/scripts/02-setup-signers.ts` — 시니어 계정에 `SignerListSet`(quorum=2, weight=1) 등록
- `src/scripts/03-demo-payment.ts` — 가디언 1명 서명(실패) → 2명 서명(성공) 두 케이스 실행
- `package.json`, `tsconfig.json`, `.env.example`, `.gitignore`, `README.md`

### 사용자 검증 남은 항목
다음 명령이 testnet 에서 끝까지 통과하는지 확인 필요. 통과 안 했으면 Day 2 진입 전에 잡아야 함.

```bash
npm install
cp .env.example .env
npm run create-accounts   # .env 가 자동으로 채워져야 함
npm run setup-signers     # tesSUCCESS 가 떠야 함
npm run demo              # 케이스 2 에서 tx hash + explorer URL 출력
```

알려진 리스크:
- testnet faucet 발급액 + 시니어 계정의 reserve(SignerList 객체 추가됨) 합산 때문에 1000 XRP 송금이 잔액 부족(`tecUNFUNDED_PAYMENT`)으로 실패할 수 있음. 그 경우 `.env` 의 `DEMO_AMOUNT_XRP` 를 900 정도로 낮추고 재실행.

---

## Phase 2 Day 1 (오늘, 2026-04-27)

### 폴더 구조 결정
워크스페이스 미사용. 루트 package.json 한 개 + `web/` 자체 package.json 한 개.

```
family-guardian-wallet/
├── src/
│   ├── xrpl/         (Phase 1 코어, 재사용)
│   ├── scripts/      (CLI)
│   ├── server/       (NEW: Express API)
│   └── config.ts
├── web/              (NEW: Vite + React + Tailwind, 자체 package.json)
├── docs/
│   └── progress.md   (이 파일)
└── package.json
```

### 추가된 파일 (총 18개)

백엔드 (4):
- `src/server/index.ts` — Express 부트, CORS, `/api/health`, 라우터 마운트
- `src/server/lib/with-client.ts` — XRPL Client connect/disconnect 래퍼
- `src/server/routes/config.ts` — `GET /api/config` (시니어 주소·네트워크만 노출, 시드 절대 미노출)
- `src/server/routes/account.ts` — `GET /api/account/:address`(잔액), `GET /api/account/:address/signers`(가디언·quorum)

웹 스캐폴드 (8):
- `web/{package.json, index.html, vite.config.ts, tsconfig.json, tsconfig.node.json, postcss.config.js, tailwind.config.ts, .gitignore}`

웹 소스 (6):
- `web/src/{main.tsx, App.tsx, index.css, vite-env.d.ts}`
- `web/src/lib/api.ts` — `fetchConfig`, `fetchAccount`, `fetchSigners`
- `web/src/views/SeniorView.tsx` — 잔액 + 가디언 목록 + 비활성 송금 버튼

### 주요 결정사항
- **워크스페이스 안 씀**: 셋업 시간 절약, 서버에서 기존 `src/xrpl/*` 상대 경로 import 가능, 배포 분리도 자연스러움.
- **Vite dev 프록시**: 프론트가 `/api/*` 로만 호출 → 자동으로 `localhost:4000` Express 로. CORS·환경변수 분기 없음. (개발 편의)
- **시드 보안**: 가디언/시니어 시드는 서버 환경변수에만 두고 프론트엔드에는 주소만 내려보냄. multisign 서명도 서버 측에서 수행 예정.
- **Tailwind 토큰**: base 폰트 18px, `senior.{bg,card,accent,ink,muted,line}` 팔레트로 시니어 친화 톤 일관화.
- **사양 변경 (작음)**: 원래 `routes/signers.ts` 를 분리하기로 했으나 두 엔드포인트 모두 `/api/account/...` 아래라 `routes/account.ts` 한 파일로 합침. Day 2 의 송금요청·서명수집은 별도 `routes/signing.ts` 로 분리 예정.

### 사용자 검증 남은 항목
다음 명령으로 양쪽이 동시에 떠서 화면이 정상으로 보이는지 확인 필요.

```bash
npm install
npm --prefix web install
npm run dev
```

확인 포인트:
1. 콘솔에 `server listening on http://localhost:4000` + Vite 의 `http://localhost:5173` 두 줄.
2. 브라우저 `http://localhost:5173` 에서:
   - 상단 헤더: "가디언월렛" / "XRPL testnet"
   - 본문: "내 잔액 N XRP" + 시니어 주소
   - 카드: "3명 중 2명이 승인해야 송금이 실행됩니다" + 가디언 3명 주소
   - 비활성 "송금하기 (다음 단계에서 활성화)" 버튼
3. "시니어 계정이 없습니다" 가 뜨면 `.env` 의 `SENIOR_ADDRESS` 가 비어 있다는 뜻 → `npm run create-accounts` 부터.

### 권장 커밋 단위 (3개로 자르기)
1. `chore: 백엔드 Express 셋업` — 루트 `package.json` 변경분 + `src/server/**`
2. `chore: 웹 Vite + Tailwind 스캐폴드` — `web/` 스캐폴드 (App/SeniorView/api.ts 제외)
3. `feat: 시니어 잔액·가디언 목록 화면` — `web/src/{App.tsx, lib/api.ts, views/SeniorView.tsx}` + `docs/progress.md`

---

## Phase 2 Day 2 (2026-04-28 완료)

### 추가/변경된 파일

백엔드:
- `src/server/lib/store.ts` — 인메모리 SigningRequest 저장소 (Map<id, request>)
- `src/server/lib/signer-pool.ts` — 가디언 주소 → wallet 매핑 (서버 env 기반)
- `src/server/routes/signing.ts` — 4 엔드포인트
  - `POST /api/signing-requests` — 시니어 송금 요청 + autofill (signerCount=quorum)
  - `GET /api/signing-requests` / `GET /:id`
  - `POST /api/signing-requests/:id/sign` — 가디언 1명 partial 서명. quorum 충족 시 `multisign` 결합 + `submitAndWait` 자동 처리
- `src/server/routes/config.ts` — 가디언 라벨/주소 추가
- `src/server/index.ts` — production 시 `web/dist` 정적 서빙 + SPA fallback

프론트:
- `web/src/lib/api.ts` — signing 관련 함수와 타입 추가
- `web/src/views/SeniorView.tsx` — 송금 입력 폼 + 진행 상태 폴링 + compact 모드
- `web/src/views/GuardianView.tsx` — 폴링, 승인 버튼, 처리 이력
- `web/src/views/DemoView.tsx` — 시니어 + 가디언1 + 가디언2 한 화면 분할
- `web/src/App.tsx` — `?role=senior|guardian1|guardian2|guardian3` + `?demo=1` 라우팅과 홈 화면

기타:
- `package.json` — `build` / `start` / `typecheck` scripts. `tsx` 를 dependencies 로 이동 (배포 환경에서 sourcemap typescript 직접 실행).
- `render.yaml` — Render Free Web Service 청사진
- `README.md` — Phase 2 흐름·라우팅·배포 가이드 반영

### 검증
- root `npx tsc --noEmit` 통과.
- `npm --prefix web run build` 성공 (gzip 50kB JS / 2.7kB CSS).

### 사용자 검증 남은 항목
- testnet 으로 끝까지 한 번 흘려보기. `npm run dev` 후 `http://localhost:5173/?demo=1` 에서:
  1. 시니어가 송금 요청 생성 → 가디언 1·2 화면에 카드가 등장.
  2. 가디언 1, 2 가 차례로 승인 → 시니어 화면에 testnet explorer 링크가 출력.
- 잔액 부족 시 송금 입력 금액을 100~500 XRP 정도로 낮춰서 재시도.

---

## Phase 2 Day 2 계획 (이전 세션 메모, 보존용)

### 목표
시니어가 송금을 시도하면 → 백엔드 큐에 요청이 쌓이고 → 가디언 화면에서 그 요청이 보이고 → 가디언 2명이 승인을 누르면 → 서버가 multisign 결합·제출까지 처리.

### 추가할 파일 (예상)

백엔드:
- `src/server/lib/store.ts` — 송금 요청 in-memory 저장소 (Map<id, SigningRequest>)
- `src/server/routes/signing.ts` — 4개 엔드포인트
  - `POST /api/signing-requests` (시니어가 송금 요청 생성)
  - `GET /api/signing-requests` (가디언 화면 폴링용 목록)
  - `POST /api/signing-requests/:id/sign` (가디언 서명 1건 추가)
  - 자동 제출: quorum 채워지면 서버가 multisign 결합 후 testnet 제출 → status 갱신
- `src/server/lib/signer-pool.ts` — 가디언 서명용 wallet (시드는 서버 env, 절대 외부 미노출)

프론트:
- `web/src/lib/api.ts` 에 `createSigningRequest`, `listSigningRequests`, `approveSigningRequest` 추가
- `web/src/views/GuardianView.tsx` — 대기 요청 목록, 승인 카드, 폴링
- `web/src/views/DemoView.tsx` — 시니어 + 가디언1 + 가디언2 한 화면 동시 표시 (시연용)
- `web/src/App.tsx` 라우팅: `?role=senior|guardian1|guardian2`, `?demo=1`
- `web/src/views/SeniorView.tsx` 송금 입력 폼 + '송금하기' 활성화

### 데이터 모델 초안

```ts
type SigningRequestStatus =
  | 'pending'    // 서명 수집 중
  | 'submitted'  // multisign 으로 제출 완료
  | 'failed';    // testnet 제출 실패

interface SigningRequest {
  id: string;
  fromAddress: string;
  toAddress: string;
  amountXrp: string;
  preparedTx: Payment;       // autofill 끝난 트랜잭션
  partialSignatures: { guardianAddress: string; txBlob: string }[];
  status: SigningRequestStatus;
  txHash?: string;
  explorerUrl?: string;
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}
```

### 작업 순서 (반나절~하루)
1. `store.ts` + `signing.ts` 백엔드 4 엔드포인트
2. SeniorView 송금 입력 폼 + `POST /api/signing-requests` 연결
3. GuardianView 폴링 + 승인 버튼 + `POST .../sign`
4. quorum 채워지면 자동 multisign + submitAndWait + 결과 갱신
5. DemoView 한 화면 3분할 (시연 영상 촬영용)
6. 시연 흐름 한 번 끝까지 돌려보기 (testnet 트랜잭션 실제 발생 + explorer 링크 노출)

---

## 내일 작업 시작 시 흐름

```bash
# (1) 어제 검증 못 했으면 먼저 수동 실행
npm install
npm --prefix web install
npm run dev
# → http://localhost:5173 에서 시니어 잔액·가디언 목록 확인

# (2) 확인되면 Day 2 시작
# 클로드코드에 "Day 2 시작하자" 정도로만 말해도 이 문서 보고 이어감
```

---

## 미해결 / 유의 사항

- Phase 1 의 `npm run demo` 가 testnet 에서 정상 통과했는지 사용자 확인 필요. 통과 못 했으면 그 메시지부터 잡아야 함.
- `withClient` 가 요청마다 WebSocket 을 새로 여닫음. 1요청당 200~500ms 추가 지연. PoC 수준에서는 문제 없지만, 시연 모드 다듬을 때 singleton 으로 최적화 여지 있음.
- 가디언 시드를 서버에 두는 구조: PoC 단계에서는 단일 서버가 모든 가디언 서명을 보관. 실제 서비스에서는 가디언 디바이스에서 서명 후 서버에 전달하는 구조로 분리해야 함. KFIP 제출 시 "PoC 단계의 단순화" 라고 명시할 것.
- 1000 XRP 송금이 잔액 부족으로 실패하면 `.env` 의 `DEMO_AMOUNT_XRP` 를 900 으로 낮춰 재실행.
- xrpl.js v3 의 `dropsToXrp` 가 string 을 반환하므로 프론트에서 그대로 표기. 천 단위 콤마는 Day 2 다듬을 때 고려.
