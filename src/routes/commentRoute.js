const router = require("express").Router();
const Auth = require("../../middlewares/auth");
const Comment = require("../controllers/commentCtrl");

router.post(":articleId/comment", Auth.verifyUser, Comment.createComment);
router.get(":articleId/comments", Auth.verifyUser, Comment.getAllComments);
router.get(":articleId/comments/:commentId", Auth.verifyUser, Comment.getOneComment);
router.delete(":articleId/comments/:commentId", Auth.verifyUser, Comment.deleteOneComment);

module.exports = router;