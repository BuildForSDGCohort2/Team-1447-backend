const router = require("express").Router();
const Auth = require("../../middlewares/auth");
const Comment = require("../controllers/commentCtrl_changed");

router.post("/comment", Auth.verifyUser, Comment.createComment);
router.get("/article/:article_id/comments", Auth.verifyUser, Comment.getAllArticleComments);
router.get("/media/:mediaId/comments", Auth.verifyUser, Comment.getAllMediaComments)
router.get("/comments/:comment_id", Auth.verifyUser, Comment.getOneComment);
router.patch("/comment/:comment_id/edit", Auth.verifyUser, Comment.editOneComment);
router.delete("/comments/:comment_id/delete", Auth.verifyUser, Comment.deleteOneComment);

module.exports = router;