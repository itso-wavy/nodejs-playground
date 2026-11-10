const { relations } = require('drizzle-orm/relations');
const { users, comments } = require('./schema');

const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.commenter],
    references: [users.id],
  }),
}));

const usersRelations = relations(users, ({ many }) => ({
  comments: many(comments),
}));

module.exports = { commentsRelations, usersRelations };
