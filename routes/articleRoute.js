const router = require("express").Router(); 
const Auth = require("../middlewares/auth");
const ArticleCtrl= require("../controllers/articleCtrl");
const Cache = require("../middlewares/cache");

router.post("/create/article", Auth.verifyUser, ArticleCtrl.createArticle, Cache.clearCache);
router.get("/articles/feed", Auth.verifyUser, Cache.getCache, ArticleCtrl.getAllArticle, Cache.setCache);
router.get("/articles/:articleId", Auth.verifyUser, Cache.getCache ,ArticleCtrl.getOneArticle, Cache.setCache);
router.patch("/article/edit/:articleId", Auth.verifyUser, ArticleCtrl.editOneArticle, Cache.setCache);
router.delete("/articles/delete/:articleId", Auth.verifyUser, ArticleCtrl.deleteOneArticle, Cache.clearCache);
router.delete("/delete/articles/:userId", Auth.verifyUser, ArticleCtrl.deleteAllArticle, Cache.clearCache);

module.exports = router;