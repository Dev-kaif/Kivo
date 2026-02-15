import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import * as MemberController from "../controllers/member.controller";

const router = Router();

router.use(authenticate);

// Manual Member Management

// Add member by email
router.post("/:boardId", MemberController.addMember);

// Remove member
router.delete("/:boardId", MemberController.removeMember);


// Invite System

// Generate invite link
router.post("/:boardId/invite", MemberController.generateInviteLink);

// Join via invite token
router.post("/join/:token", MemberController.joinViaInvite);

export default router;
