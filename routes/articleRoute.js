const router = require("express").Router(); 
const Auth = require("../middlewares/auth");
const ArticleCtrl= require("../controllers/articleCtrl");

router.post("/create/article", Auth.verifyUser, ArticleCtrl.createArticle);
router.get("/articles/:userId", Auth.verifyUser, ArticleCtrl.getAllArticle);
router.get("/articles/:articleId", Auth.verifyUser, ArticleCtrl.getOneArticle);
router.patch("/article/edit/:articleId", Auth.verifyUser, ArticleCtrl.editOneArticle);
router.delete("/articles/delete/:articleId", Auth.verifyUser, ArticleCtrl.deleteOneArticle);
router.delete("/delete/articles/:userId", Auth.verifyUser, ArticleCtrl.deleteAllArticle);

module.exports = router;