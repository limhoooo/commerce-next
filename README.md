### lint-staged<br>

git staged 상태의 파일들만 타켓으로 뭔가 할 수 있게 해줌 <br>

### husky 설치<br>

git hook 동작에 따른 액션을 할수있음<br>

### 노션 api 를 DB 로 사용<br> (사용안함)

> yarn add @notionhq/client 설치<br>

### planetscale 사용 (서버리스 database)<br>

### prisma 설치 (ORM)<br>

ORM : 객체와 데이터베이스의 관계를 매핑해주는것<br>

> yarn add -D prisma<br>
> yarn add @prisma/client<br>
> yarn prisma init<br>

> yarn prisma db push (schema.prisma 에서 만든 테이블 등등 실제 db에다 push)
> yarn prisma generate (schema.prisma 파일변경시 싱크 맞추기)<br>

### taliwindcss 설치<br>

> yarn add -D tailwindcss postcss autoprefixer<br>
> yarn tailwindcss init -p<br>

### emotion 설치<br>

> yarn add @emotion/react @emotion/styled @emotion/css<br>

### iamge-gallery 설치<br> (사용안함)

> yarn add react-image-gallery<br>
> yarn add -D @types/react-image-gallery<br>

### nuka-carousel 설치<br>

> yarn add nuka-carousel<br>

### sitemap 설치<br>

> yarn add -D next-sitemap<br>

### draft 에디터 설치<br>

> yarn add draft-js react-draft-wysiwyg<br>
> yarn add -D @types/draft-js @types/react-draft-wysiwyg<br>

### ts-node 설치

> yarn add -D ts-node

## blur images

https://png-pixel.com/

## mantine 설치 (페이지네이션, 카테고리, 필터)

> yarn add @mantine/core @mantine/hooks
> yarn add @tabler/icons-react

## react-query 설치

https://velog.io/@kimhyo_0218/React-Query-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%BF%BC%EB%A6%AC-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-useQuery

> yarn add @tanstack/react-query

## google oauth 설치 (사용안함)

https://github.com/MomenSherif/react-oauth#googlelogin

> yarn add @react-oauth/google@latest

## jwt decode 설치 (사용안함)

> yarn add jwt-decode

## next-auth + prisma 설치/

로그인(구글)을 하면 쿠키에 토큰 담는것까지 해줌
https://next-auth.js.org/getting-started/example

> yarn add next-auth @next-auth/prisma-adapter

## date-fns 설치

> yarn add date-fns
