# TimeFit

여러 사람의 가능한 시간과 출발 위치를 모아 약속 시간과 만남 장소를 함께 조율하는 웹 서비스입니다.

## 서비스

https://timefit.lavalabs.co.kr/

## 주요 기능

- 모임 생성 및 초대 링크 발급
- 가능한 시간대와 출발 위치 응답
- 실제 시간 교집합 계산
- 이동 균형이 좋은 장소 후보 추천
- 주최자 전용 관리 화면
- 응답 마감, 모임 수정·삭제, CSV 내보내기

## 구성

- GitHub Pages: 웹 화면
- Supabase Edge Function: 공개 API
- Supabase PostgreSQL: 모임 및 참여 데이터
- Kakao Maps JavaScript SDK: 장소 검색과 지도

`main` 브랜치 변경 시 GitHub Actions로 자동 배포됩니다.
