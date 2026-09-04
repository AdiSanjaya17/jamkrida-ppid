-- AlterTable
-- NOTE: MySQL tidak mengizinkan DEFAULT pada kolom TEXT — default ditangani di level aplikasi.
ALTER TABLE `news` ADD COLUMN `images` TEXT NULL;
UPDATE `news` SET `images` = '[]' WHERE `images` IS NULL;
ALTER TABLE `news` MODIFY `images` TEXT NULL;
