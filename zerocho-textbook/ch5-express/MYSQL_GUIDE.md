# MySQL CLI 사용 가이드

## 1. 접속

```bash
mysql -h localhost -u root -p
```

비밀번호 입력 후 `mysql>` 프롬프트가 뜨면 접속 성공.

---

## 2. 데이터베이스

```sql
-- 목록 확인
SHOW DATABASES;

-- 생성
CREATE DATABASE 이름;

-- 선택 (이후 모든 작업은 이 DB에서 실행)
USE 이름;

-- 삭제
DROP DATABASE 이름;
```

---

## 3. 테이블

### 조회

```sql
-- 테이블 목록
SHOW TABLES;

-- 테이블 구조 확인
DESC 테이블명;
```

### 생성

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  age INT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

주요 타입:

| 타입         | 설명                            |
| ------------ | ------------------------------- |
| `INT`        | 정수                            |
| `VARCHAR(n)` | 가변 길이 문자열 (최대 n자)     |
| `TEXT`       | 긴 문자열                       |
| `BOOLEAN`    | 참/거짓 (내부적으로 TINYINT(1)) |
| `TIMESTAMP`  | 날짜+시간                       |

주요 옵션:

| 옵션             | 설명             |
| ---------------- | ---------------- |
| `PRIMARY KEY`    | 기본키           |
| `AUTO_INCREMENT` | 자동 증가        |
| `NOT NULL`       | 빈 값 허용 안 함 |
| `UNIQUE`         | 중복 허용 안 함  |
| `DEFAULT 값`     | 기본값 설정      |

### 수정 / 삭제

```sql
-- 컬럼 추가
ALTER TABLE users ADD COLUMN age INT;

-- 컬럼 삭제
ALTER TABLE users DROP COLUMN age;

-- 테이블 삭제
DROP TABLE users;
```

---

## 4. 데이터 조작 (CRUD)

### INSERT — 삽입

```sql
INSERT INTO users (name, email) VALUES ('홍길동', 'hong@test.com');
```

### SELECT — 조회

```sql
-- 전체 조회
SELECT * FROM users;

-- 특정 컬럼만
SELECT id, name FROM users;

-- 조건 조회
SELECT * FROM users WHERE id = 1;

-- 정렬
SELECT * FROM users ORDER BY age ASC;
SELECT * FROM users ORDER BY created_at DESC;

-- 개수 제한
SELECT * FROM users LIMIT 10;

-- 오프셋
SELECT * FROM users LIMIT 10 OFFSET 10;
```

### UPDATE — 수정

```sql
UPDATE users SET name = '김철수' WHERE id = 1;
```

> WHERE 빠뜨리면 전체 행이 수정됨. 주의.

### DELETE — 삭제

```sql
DELETE FROM users WHERE id = 1;
```

> WHERE 빠뜨리면 전체 행 삭제됨. 주의.

---

## 5. 접속 종료

```sql
EXIT;
-- 또는
QUIT;
```

---

## 6. Node.js에서 연결 (mysql 패키지)

```bash
npm install mysql
```

```js
// db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect(err => {
  if (err) throw err;
  console.log('MySQL 연결 성공');
});

module.exports = connection;
```

```js
// 사용 예시
const db = require('./db');

db.query('SELECT * FROM users', (err, results) => {
  if (err) throw err;
  console.log(results);
});
```

`.env`에 추가:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=비밀번호
DB_NAME=nodejs
```

---

## 7. ORM — Drizzle

### ORM이란

SQL을 직접 문자열로 쓰는 대신, JavaScript 코드로 DB를 다루게 해주는 라이브러리. 타입 안정성과 자동완성이 생기고, SQL 문법 실수를 줄일 수 있어요.

| | mysql (raw) | Drizzle (ORM) |
|---|---|---|
| 쿼리 방식 | SQL 문자열 직접 작성 | JS 코드로 작성 |
| 타입 지원 | 없음 | TypeScript 완전 지원 |
| 스키마 관리 | SQL로 직접 | 코드로 정의 후 마이그레이션 |

### 설치

```bash
npm install drizzle-orm mysql2
npm install -D drizzle-kit
```

> Drizzle은 내부적으로 `mysql2`를 드라이버로 사용해요. `mysql` 패키지와는 별개예요.

### 스키마 정의 (`src/db/schema.ts`)

```ts
import { int, mysqlTable, varchar, text, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  age: int('age').unsigned().notNull(),
  memo: text('memo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const comments = mysqlTable('comments', {
  id: int('id').autoincrement().primaryKey(),
  commenter: int('commenter').notNull().references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  comment: varchar('comment', { length: 1000 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### DB 연결 (`src/db/index.ts`)

```ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const db = drizzle(connection);
```

### CRUD 예시

```ts
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

// INSERT
await db.insert(users).values({ name: 'wavy', email: 'wavy@gmail.com', age: 30 });

// SELECT
const all = await db.select().from(users);
const one = await db.select().from(users).where(eq(users.id, 1));

// UPDATE
await db.update(users).set({ name: '김철수' }).where(eq(users.id, 1));

// DELETE
await db.delete(users).where(eq(users.id, 1));
```

### 마이그레이션 (`drizzle.config.ts`)

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
});
```

```bash
# 마이그레이션 파일 생성
npx drizzle-kit generate

# DB에 적용
npx drizzle-kit migrate
```
