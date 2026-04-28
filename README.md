# 가디언월렛 (Family Guardian Wallet)

인지저하 시기 시니어의 자산을, 가족 2/3 승인이 있어야만 인출되는 XRPL 멀티시그 지갑 PoC. 시니어 1명이 송금을 요청하면 등록된 가족 가디언 3명 중 2명의 서명이 모여야만 testnet 트랜잭션이 제출된다.

- 차별점: XRPL 네이티브 multisig (별도 컨트랙트 불필요), 3~5초 정산, 낮은 수수료, 후견인 1인 권한 집중 한계 해소.
- 시연 환경: XRPL Testnet (예선) → 본선 단계에서 메인넷 검토.
- KFIP 2026 개인 참가.

## 요구사항

- Node.js 20 이상
- 인터넷 연결 (testnet faucet 호출)

## 사전 준비

```bash
npm install
npm --prefix web install
cp .env.example .env
```

`.env` 의 시니어/가디언 키는 1단계 스크립트가 자동으로 채워 넣는다.

## 1단계: testnet 멀티시그 코어 검증 (CLI)

testnet 위에서 가디언 1명 서명은 거부, 2명 서명은 성공하는 흐름을 콘솔로 보여준다.

```bash
npm run create-accounts   # 시니어 + 가디언 3명 testnet 계정 생성, .env 자동 작성
npm run setup-signers     # 시니어 계정에 SignerListSet (quorum=2, weight=1) 등록
npm run demo              # 1명 서명(실패) → 2명 서명(성공) testnet 제출
```

성공하면 마지막에 testnet explorer 링크가 출력된다.

## 2단계: 웹 데모

```bash
npm run dev
```

- 백엔드: `http://localhost:4000` (Express)
- 프론트엔드: `http://localhost:5173` (Vite + React + Tailwind, `/api` 는 자동으로 프록시)

웹 화면 라우팅 (모두 같은 포트):

| URL | 화면 |
|---|---|
| `/` | 시연용 진입 화면 (각 역할 화면으로 이동) |
| `/?role=senior` | 시니어 — 잔액·가디언 목록·송금 요청 |
| `/?role=guardian1` | 가족 가디언 1번 — 승인 대기 목록 + 승인 버튼 |
| `/?role=guardian2` | 가족 가디언 2번 |
| `/?role=guardian3` | 가족 가디언 3번 |
| `/?demo=1` | 시연 모드 — 시니어 + 가디언1 + 가디언2 한 화면 분할 |

### 데모 흐름 (영상 촬영용)

1. `/?demo=1` 한 화면에서 세 역할이 동시에 보인다.
2. 시니어가 받는 분 주소·금액을 입력하고 "가족에게 승인 요청 보내기" 클릭.
3. 가디언 1, 2 화면에 승인 카드가 1.5초 내로 나타난다.
4. 가디언 1이 "이 송금을 승인합니다" 클릭. 카드 상태가 1/2 로 변한다.
5. 가디언 2가 승인하면 서버가 두 partial 서명을 `multisign` 으로 결합 → `submitAndWait` 으로 testnet 에 제출.
6. 시니어 화면에 "송금 완료" + testnet explorer 링크가 노출된다.

## 보안 / 단순화 노트

- 가디언 시드는 서버 환경변수에만 두고 프론트로 절대 내려보내지 않는다. multisign 서명도 서버 측에서 수행.
- 실제 서비스에서는 가디언 디바이스에서 서명 후 서버에 partial 블롭만 전달하는 구조로 분리해야 한다. PoC 단계의 단순화.
- in-memory 송금 요청 저장소. 서버 재시작 시 초기화.
- testnet faucet 발급액과 SignerList reserve 합산 때문에 큰 금액 송금이 잔액 부족으로 실패할 수 있다. `.env` 의 `DEMO_AMOUNT_XRP` 를 낮추거나 송금 폼에서 작게 입력.

## 파일 구조

```
family-guardian-wallet/
├── src/
│   ├── xrpl/                # XRPL 멀티시그 코어 (재사용)
│   ├── scripts/             # 1단계 CLI
│   └── server/              # Express API + lib
├── web/                     # 프론트엔드 (Vite + React + Tailwind)
├── docs/progress.md         # 내부 진행 일지
├── render.yaml              # Render 배포 청사진
└── README.md
```

### 백엔드 엔드포인트

- `GET  /api/health`
- `GET  /api/config` — 시니어 주소·네트워크·가디언 라벨 (시드 미노출)
- `GET  /api/account/:address` — 잔액·시퀀스
- `GET  /api/account/:address/signers` — SignerList·quorum
- `POST /api/signing-requests` — 시니어 송금 요청 생성 (autofill 포함)
- `GET  /api/signing-requests` — 전체 요청 목록 (가디언 폴링)
- `GET  /api/signing-requests/:id`
- `POST /api/signing-requests/:id/sign` — 가디언 1명 partial 서명 추가, quorum 채워지면 자동 결합·제출

## 배포 (Render Free Web Service)

1. 이 저장소를 GitHub 에 push.
2. https://render.com 에서 New → Web Service → 본 저장소 선택.
3. `render.yaml` 이 자동 인식된다. Build / Start command 는 그대로 두면 된다.
4. Environment 탭에서 `.env` 의 모든 값을 그대로 입력. (시드는 testnet 전용)
5. Deploy. 첫 빌드 후 발급되는 `https://guardian-wallet-xxxx.onrender.com` 이 데모 링크.

Render Free 인스턴스는 트래픽이 없으면 잠들었다가 첫 요청에서 30~50초 깨어난다. 시연 영상 촬영 직전에 한 번 호출해 두면 된다.

## 참고

- XRPL 멀티시그 공식 문서: https://xrpl.org/docs/concepts/accounts/multi-signing
- xrpl.js: https://js.xrpl.org/

## 라이선스

MIT
