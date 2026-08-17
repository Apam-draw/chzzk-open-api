# @apam-draw/chzzk-open-api

치지직 Open API의 OAuth, 사용자/채널 조회, 채팅 전송, 세션 구독과 이벤트 정규화를 제공하는 독립 TypeScript 모듈입니다. 애플리케이션 DB나 비즈니스 로직에는 의존하지 않습니다.

## 설치

```bash
npm install @apam-draw/chzzk-open-api
```

비공개 GitHub Packages에서 설치할 때는 `read:packages` 권한이 있는 토큰과 npm scope 설정이 필요합니다.

## 사용

```ts
import { createChzzk, normalizeDonation } from "@apam-draw/chzzk-open-api";

const chzzk = createChzzk({
  clientId: process.env.CHZZK_CLIENT_ID!,
  clientSecret: process.env.CHZZK_CLIENT_SECRET!,
  redirectUri: process.env.CHZZK_REDIRECT_URI!,
});

const authorizationUrl = chzzk.auth.getAuthorizationUrl("signed-oauth-state");
const donation = normalizeDonation({ payload: rawPayload });
```

세션 로그는 애플리케이션 로거를 생성자 두 번째 인자로 주입할 수 있습니다.

```ts
const manager = new ChzzkSessionManager(config, logger);
```

## 개발

```bash
npm install
npm run typecheck
npm test
npm run build
```

Node.js 20 이상이 필요합니다.
