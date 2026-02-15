/*
  Warnings:

  - The values [USER_ASSIGNED,USER_REMOVED] on the enum `ActivityAction` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityAction_new" AS ENUM ('LIST_CREATED', 'LIST_UPDATED', 'LIST_DELETED', 'TASK_CREATED', 'TASK_UPDATED', 'TASK_MOVED', 'TASK_DELETED', 'MEMBER_ADDED', 'MEMBER_REMOVED', 'ROLE_UPDATED', 'BOARD_CREATED', 'BOARD_UPDATED', 'BOARD_DELETED');
ALTER TABLE "ActivityLog" ALTER COLUMN "action" TYPE "ActivityAction_new" USING ("action"::text::"ActivityAction_new");
ALTER TYPE "ActivityAction" RENAME TO "ActivityAction_old";
ALTER TYPE "ActivityAction_new" RENAME TO "ActivityAction";
DROP TYPE "public"."ActivityAction_old";
COMMIT;
