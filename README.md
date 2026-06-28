# TimeFit

여러 사람의 가능한 시간과 위치를 한 번에 조율하는 정적 웹 프로토타입입니다.

## 실행

별도 빌드 과정 없이 정적 서버에서 실행할 수 있습니다.

```bash
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`으로 접속합니다.

## 배포

`main` 브랜치에 변경 사항을 올리면 `.github/workflows/pages.yml`을 통해 GitHub Pages 배포가 실행됩니다.

> Kakao 지도 기능을 사용하려면 Kakao Developers의 JavaScript 키 플랫폼에 실제 서비스 도메인을 등록해야 합니다.
