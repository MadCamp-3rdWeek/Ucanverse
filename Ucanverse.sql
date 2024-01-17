-- Active: 1705146774798@@127.0.0.1@3306@ucanverse
DROP DATABASE ucanverse;
CREATE DATABASE ucanverse;
USE ucanverse;
CREATE TABLE users(user_id VARCHAR(20) NOT NULL, password VARCHAR(20) NOT NULL, user_name VARCHAR(20) NOT NULL, PRIMARY KEY(user_id));
CREATE TABLE brands(brand_id INT AUTO_INCREMENT, brand_name VARCHAR(20) NOT NULL, logo_url VARCHAR(2048) NOT NULL, navilogo_url VARCHAR(2048) NOT NULL, PRIMARY KEY(brand_id));
CREATE TABLE posts(post_id INT AUTO_INCREMENT, user_id VARCHAR(20), brand_id INT, likes INT DEFAULT 0, title VARCHAR(20), contents VARCHAR(1000), upload_time TIMESTAMP, PRIMARY KEY(post_id), FOREIGN KEY(user_id) REFERENCES users(user_id), views INT DEFAULT 0, FOREIGN KEY(brand_id) REFERENCES brands(brand_id));
CREATE TABLE attachments(attachment_id INT AUTO_INCREMENT, post_id INT, img_url VARCHAR(2048), PRIMARY KEY(attachment_id), FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE);
CREATE TABLE comments(comments_id INT AUTO_INCREMENT, user_id VARCHAR(20), post_id INT, contents VARCHAR(100), upload_time TIMESTAMP, 
PRIMARY KEY(comments_id), FOREIGN KEY(user_id) REFERENCES users(user_id), FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE);
CREATE TABLE likes(user_id VARCHAR(20), post_id INT, PRIMARY KEY(user_id, post_id), FOREIGN KEY(user_id) REFERENCES users(user_id), Foreign Key (post_id) REFERENCES posts(post_id) ON DELETE CASCADE);
CREATE TABLE follow(following_id VARCHAR(20), followed_id VARCHAR(20), PRIMARY KEY(following_id, followed_id), FOREIGN KEY(following_id) REFERENCES users(user_id), FOREIGN KEY(followed_id) REFERENCES users(user_id));
CREATE TABLE brandlike(user_id VARCHAR(20), brand_id INT, PRIMARY KEY(user_id, brand_id), FOREIGN KEY(user_id) REFERENCES users(user_id), FOREIGN KEY(brand_id) REFERENCES brands(brand_id));
CREATE TABLE chatroom(chatroom_id INT AUTO_INCREMENT, user1_id VARCHAR(20), user2_id VARCHAR(20), PRIMARY KEY(chatroom_id), FOREIGN KEY(user1_id) REFERENCES users(user_id), FOREIGN KEY(user2_id) REFERENCES users(user_id), CHECK (user1_id <> user2_id));
CREATE TABLE message(message_id INT AUTO_INCREMENT, chatroom_id INT, user1_id VARCHAR(20), user2_id VARCHAR(20), contents VARCHAR(20), upload_time TIMESTAMP, 
PRIMARY KEY(message_id), FOREIGN KEY(user1_id) REFERENCES chatroom(user1_id), FOREIGN KEY(user2_id) REFERENCES chatroom(user2_id));