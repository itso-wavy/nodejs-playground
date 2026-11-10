const { mysqlTable, index, primaryKey, int, varchar, datetime, unique, timestamp, text } = require('drizzle-orm/mysql-core');
const { sql } = require('drizzle-orm');

const comments = mysqlTable("comments", {
  id: int().autoincrement().notNull(),
  commenter: int().notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  comment: varchar({ length: 1000 }).notNull(),
  createdAt: datetime("created_at", { mode: 'string' }).default(sql`(CURRENT_TIMESTAMP)`),
},
(table) => [
  index("commenter_index").on(table.commenter),
  primaryKey({ columns: [table.id], name: "comments_id" }),
]);

const users = mysqlTable("users", {
  id: int().autoincrement().notNull(),
  name: varchar({ length: 100 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  age: int({ unsigned: true }).notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  memo: text(),
},
(table) => [
  primaryKey({ columns: [table.id], name: "users_id" }),
  unique("email").on(table.email),
]);

module.exports = { comments, users };
