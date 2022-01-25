const { Router } = require("express");

const DevController = require("./controller/DevController");
const SearchController = require("./controller/SearchController");

const routes = Router();

routes.get("/devs", DevController.index);
routes.post("/devs", DevController.store);
routes.put("/devs/:github_username", DevController.update);
routes.get("/devs/:github_username", DevController.read);
routes.delete("/devs/:github_username", DevController.delete);

routes.get("/search", SearchController.index);

module.exports = routes;
