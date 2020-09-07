const router = require("express").Router(); 
const Auth = require("../../middlewares/auth");
const ArticleCtrl= require("../controllers/articleCtrl");
const {getCache, setCache, clearCache} = require("../../middlewares/cache");

router.post("/create/article", Auth.verifyUser, ArticleCtrl.createArticle, clearCache);
router.get("/feed", Auth.verifyUser, getCache, ArticleCtrl.getAllArticle, clearCache);
// router.get("/articles/", Auth.verifyUser, getCache, ArticleCtrl.getAllArticle, setCache);
router.get("/articles/:articleId", Auth.verifyUser, getCache ,ArticleCtrl.getOneArticle, setCache);
router.patch("/article/edit/:articleId", Auth.verifyUser, ArticleCtrl.editOneArticle, setCache);
router.delete("/articles/delete/:articleId", Auth.verifyUser, ArticleCtrl.deleteOneArticle, clearCache);
router.delete("/delete/articles/:userId", Auth.verifyUser, ArticleCtrl.deleteAllArticle, clearCache);

module.exports = router;