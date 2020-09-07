const router = require("express").Router();
const Auth = require("../../middlewares/auth");
const Comment = require("../controllers/commentCtrl");

router.post("/comment", Auth.verifyUser, Comment.createComment);
router.get("/article/:articleId/comments", Auth.verifyUser, Comment.getAllArticleComments);
router.get("/media/:mediaId/comments", Auth.verifyUser, Comment.getAllMediaComments)
router.get("/comments/:commentId", Auth.verifyUser, Comment.getOneComment);
router.patch("/edit/comment", Auth.verifyUser, Comment.editOneComment);
router.delete("/:articleId/comments/:commentId", Auth.verifyUser, Comment.deleteOneComment);

module.exports = router;