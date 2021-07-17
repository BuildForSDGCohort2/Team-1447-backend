const router = require("express").Router(); 
const Auth = require("../../middlewares/auth");
const ArticleCtrl= require("../controllers/articleCtrl_changed");
// const {getCache, setCache, } = require("../../middlewares/cache");

router.post("/article/create", Auth.verifyUser, ArticleCtrl.createArticle);
router.get("/feed", Auth.verifyUser, ArticleCtrl.getAllArticle );
// router.get("/articles/", Auth.verifyUser,, ArticleCtrl.getAllArticle);
router.get("/articles/:article_id", Auth.verifyUser, ArticleCtrl.getOneArticle);
router.patch("/articles/:article_id/edit", Auth.verifyUser, ArticleCtrl.editOneArticle);
router.delete("/articles/:article_id/delete", Auth.verifyUser, ArticleCtrl.deleteOneArticle);
router.delete("/:user_id/articles/delete", Auth.verifyUser, ArticleCtrl.deleteAllArticle);

module.exports = router;