# MySQL 치트시트

## 접속 / 종료

```sql
mysql -h localhost -u root -p        -- 접속
exit  (또는 quit, \q)                -- 종료
```

## 데이터베이스

```sql
SHOW DATABASES;                      -- 목록 확인
CREATE DATABASE mydb;                -- 생성
USE mydb;                            -- 선택 (이후 명령은 이 DB에 적용)
DROP DATABASE mydb;                  -- 삭제
SELECT DATABASE();                   -- 현재 선택된 DB 확인
```

## 테이블

```sql
SHOW TABLES;                         -- 테이블 목록
DESC tablename;                      -- 테이블 구조 (컬럼, 타입 등)
SHOW CREATE TABLE tablename;         -- 생성 쿼리 확인

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100)
);

DROP TABLE tablename;                -- 테이블 삭제
ALTER TABLE users ADD age INT;       -- 컬럼 추가
ALTER TABLE users DROP COLUMN age;   -- 컬럼 삭제
```

## CRUD

```sql
-- 삽입
INSERT INTO users (name, email) VALUES ('홍길동', 'hong@example.com');

-- 조회
SELECT * FROM users;
SELECT name, email FROM users WHERE id = 1;
SELECT * FROM users ORDER BY name ASC LIMIT 10;

-- 수정
UPDATE users SET email = 'new@example.com' WHERE id = 1;

-- 삭제
DELETE FROM users WHERE id = 1;
```

## 필터 / 조건

```sql
WHERE age > 20 AND name LIKE '홍%'
WHERE email IS NULL
WHERE id IN (1, 2, 3)
BETWEEN 10 AND 20
```

## 집계

```sql
SELECT COUNT(*) FROM users;
SELECT AVG(age), MAX(age), MIN(age) FROM users;
SELECT city, COUNT(*) FROM users GROUP BY city HAVING COUNT(*) > 5;
```

## JOIN

```sql
SELECT u.name, o.product
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN: 왼쪽 테이블 전체 + 매칭되는 오른쪽
-- RIGHT JOIN: 반대
```

## 유저 / 권한 (관리용)

```sql
CREATE USER 'alice'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON mydb.* TO 'alice'@'localhost';
FLUSH PRIVILEGES;
SHOW GRANTS FOR 'alice'@'localhost';
DROP USER 'alice'@'localhost';
```

## 접속 후 테이블 확인 순서

로그인 직후엔 DB를 먼저 선택해야 한다.

```sql
SHOW DATABASES;           -- 어떤 DB가 있는지 확인
USE mydb;                 -- 확인할 DB 선택
SHOW TABLES;              -- 테이블 목록
DESC tablename;           -- 특정 테이블 구조 보기
SELECT * FROM tablename;  -- 데이터 확인
```

> `USE` 없이 `SHOW TABLES` 하면 `No database selected` 에러가 나니까, 반드시 DB 선택 먼저.
