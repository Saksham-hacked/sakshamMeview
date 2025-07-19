// routes/topListRoutes.js
// const express = require('express');\
import express from 'express';
import{
  createTopList,
  getUsersTopLists,
  getTopListById,
  updateTopList,
  deleteTopList,
} from "../controllers/topfive.controllers.js";

const router = express.Router();

router.post('/create', createTopList);
router.get('/user/:userId', getUsersTopLists);
router.get('/:listId', getTopListById);
router.put('/:listId', updateTopList);
router.delete('/:listId', deleteTopList);

export default router;  