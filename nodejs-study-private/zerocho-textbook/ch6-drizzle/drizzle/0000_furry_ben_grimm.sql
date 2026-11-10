-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`commenter` int NOT NULL,
	`comment` varchar(1000) NOT NULL,
	`created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`age` int unsigned NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`memo` text,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `email` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `commenter` FOREIGN KEY (`commenter`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `commenter_index` ON `comments` (`commenter`);
*/