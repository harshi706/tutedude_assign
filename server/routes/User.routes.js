import { Router } from "express";
import { acceptRequests, addUser, declineRequests, getAllUser, getFriendRecommendations, getFriendRequests, login, logOut, removeUser, sendRequests, signUp } from "../controller/User.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();


router.post('/signup',signUp)
router.post('/login',login)
router.post('/logout',verifyJWT,logOut)
router.get('/homie',verifyJWT,getAllUser)
router.post('/add',verifyJWT,addUser)
router.post('/remove',verifyJWT,removeUser)
router.post('/send',verifyJWT,sendRequests)
router.get('/getrequest',verifyJWT,getFriendRequests)
router.post('/accept',verifyJWT,acceptRequests)
router.post('/decline',verifyJWT,declineRequests)
router.get('/recommendations',verifyJWT,getFriendRecommendations)

export default router;
