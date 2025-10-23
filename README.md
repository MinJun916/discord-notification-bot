# Discord Notification Bot

Discord 웹훅을 사용하여 정기적으로 알림을 보내는 봇입니다.

## 기능

- 평일 10시, 13시, 16시: 진행 상황 공유 알림
- 평일 19시: 프로젝트 마무리 안내
- 한국 시간대 기준으로 동작

## 설치 및 실행

1. 의존성 설치

```bash
npm install
```

2. 환경변수 설정

```bash
cp .env.example .env
# .env 파일을 열어서 WEBHOOK_URL을 설정하세요
```

3. 서버 실행

```bash
npm start
```

## 환경변수

- `WEBHOOK_URL`: Discord 웹훅 URL (필수)
- `PORT`: 서버 포트 (선택사항, 기본값: 3000)

## API 엔드포인트

- `GET /`: 서버 상태 확인
- `GET /health`: 헬스체크

## 스케줄

- 평일 10:00, 13:00, 16:00, 19:00 (한국 시간)
- 자동으로 한국 시간대를 사용합니다.
