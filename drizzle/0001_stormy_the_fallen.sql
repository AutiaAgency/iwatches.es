CREATE TABLE `catalog_downloads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`email` text,
	`catalog_type` text NOT NULL,
	`downloaded_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`watch_name` text NOT NULL,
	`watch_reference` text NOT NULL,
	`purchase_amount` real NOT NULL,
	`purchase_date` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
