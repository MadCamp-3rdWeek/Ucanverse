![그림2](https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/b08dea31-70b0-4eb0-9c1e-4a780bc8704b)

패션에 관심이 많고 특정 브랜드에 애정이 큰 사람들을 위한 커뮤니티 사이트입니다. 브랜드의 제품을 직접 커스텀하고 이를 공유할 수 있으며, 다른 사람들과 패션에 관해 이야기를 나눌 수 있습니다.

사용자가 직접 디자인 할 수 있다는 의미와 주기능인 커스텀/커뮤니티를 뜻하는 Canvus/Converse를 합쳐서 “UCANVERSE”라고 이름을 붙였습니다.

# 개발환경

- 프론트엔드 : html
- 백엔드 : nodejs, java script
- 서버 : KCloud
- DB : MySQL

# 구현 기능

## 0. 시작 페이지

<img width="953" alt="Untitled" src="https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/d78636ed-a5fa-428d-83e2-06c7ef95bb06">


## 1. 회원가입 및 로그인

<img width="960" alt="Untitled" src="https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/9277f5db-e54f-4b8b-bb95-1d85f3ef7faf">
<img width="958" alt="Untitled" src="https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/29f4e0a8-0628-4d91-b0fd-ee05f684a3c0">


- 이미 있는 아이디로 회원가입을 하면 “아이디가 이미 존재합니다.”라는 경고메세지가 뜹니다.
- 로그인에 실패하면 “로그인 실패”라는 경고메세지가 뜹니다.
- 비밀번호는 숨김처리 되어있고, 버튼을 누르면 텍스트가 뜹니다.

## 2. 메인 페이지 : 브랜드 목록

<img width="944" alt="Untitled" src="https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/1fdd6fa8-f901-4fe3-b7c8-ca9c74273298">
<img width="944" alt="Untitled" src="https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/586a14b3-08eb-4b7e-b1b3-cf8b2544cb36">


- 메인페이지에 등록되어 있는 브랜드 목록이 나타납니다.
- “popular” 탭에서는 즐겨찾기 수가 많은 순으로 정렬이 되고 “name” 탭에서는 이름 순으로 정렬이 됩니다. 단, 본인이 즐겨찾기 한 브랜드는 항상 상단에 나타납니다.

![Untitled](https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/c2776ce1-11cb-4c83-a714-957b6ba23fa1)


- 브랜드 로고 위에 마우스를 올리면 “잡담방”, “커스텀” 옵션이 나타납니다. 각각 클릭하면 해당 브랜드의 잡담방/커스텀 페이지로 넘어갑니다.
- 우측 상단의 검색 버튼을 누르면 브랜드명을 검색할 수 있습니다.
- 우측 상단의 프로필 버튼을 누르면 내 계정 페이지로 이동합니다.

## 3. 잡담방

<img width="959" alt="Untitled" src="https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/2e4c38be-6b67-4c96-b102-0adebda129bb">


<img width="935" alt="Untitled" src="https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/166218ea-3e00-4dd0-9017-9aa24bb297b0">


- 잡담방 메인페이지에는 게시글이 시간 순으로 뜹니다. 게시글에 첨부한 사진이 있으면 제목 옆에 사진 아이콘이 뜹니다.
- 게시글 목록의 행에 마우스를 올리면 해당 행이 회색으로 변하고, 글 제목에 마우스를 올리면 텍스트 색깔이 바뀝니다.
- 글 제목을 올리면 해당 글 상세 페이지로 넘어갑니다. 댓글, 좋아요 기능을 구현했으며 작성자의 id를 클릭하면 작성자의 개인 페이지로 이동합니다.
- 우측 상단의 + 버튼을 클릭하면 게시글을 작성할 수 있습니다.
- 우측 상단의 검색 버튼을 클릭하면 게시글 제목, 작성자 id, 글 내용으로 검색을 할 수 있습니다.
- 좌측 상단의 브랜드 로고를 클릭하면 해당 브랜드의 커스텀 페이지가 로드됩니다.

## 4. 커스텀

<img width="941" alt="Untitled" src="https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/4cc82219-bb04-4ce1-a03b-4429bb294154">

<img width="945" alt="Untitled" src="https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/c16055de-af53-4644-ad04-e8c50d789886">

- 커스텀 메인 페이지에는 게시글이 시간 순으로 뜹니다. 첨부한 파일이 썸네일로 뜹니다.
- 썸네일 이미지를 클릭하면 해당 게시글 상세 페이지가 로드됩니다. 댓글, 좋아요 기능을 구현했으며 작성자 id를 클릭하면 작성자의 개인 페이지로 이동합니다.
- 우측 상단의 검색 버튼을 클릭하면 게시글 제목, 작성자 id, 글 내용으로 검색을 할 수 있습니다.
- 좌측 상단의 브랜드 로고를 클릭하면 해당 브랜드의 잡담방 페이지가 로드됩니다.

## 5. 게시글 작성

<img width="904" alt="Untitled" src="https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/e5dfda94-3723-401b-89f6-a3c615df4def">


- Custom/Community 중 게시글을 업로드 할 카테고리를 선택할 수 있습니다.
- 필수 요소가 채워지지 않으면  Post 버튼이 나타나지 않습니다. Custom 페이지는 사진 추가가 필수입니다.

## 6. 프로필

<img width="956" alt="Untitled" src="https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/65b6dff5-de6d-4f7b-83c4-d20b01c69ac7">


<img width="950" alt="Untitled" src="https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/01516f60-b14c-4a90-89b4-305534820001">


<img width="953" alt="Untitled" src="https://github.com/MadCamp-3rdWeek/frontEnd/assets/102137004/b3e14049-5b38-426c-b9c2-11a1326b005f">

- 해당 사용자가 업로드 한 게시글들과 좋아요 한 게시글들을 확인할 수 있습니다.
- 타사용자의 프로필 페이지에는 Follow/Unfollow 버튼이 나타납니다.
- 본인의 프로필에서 팔로잉 목록을 확인할 수 있습니다. 계정을 클릭하면 해당 계정의 프로필로 이동합니다. 팔로잉 목록 카드를 제외한 영역을 클릭하면 카드가 닫힙니다.
