const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections, sendMessage } = require("../websocket");

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      });

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, "new-dev", dev);
    }

    return response.json(dev);
  },

  async update(request, response) {
    const { github_username } = request.params;
    const { techs, ...rest } = request.body;
    rest.github_username = github_username;

    const dev = await Dev.findOne({ github_username });

    if (techs) var techsArray = parseStringAsArray(techs);

    const newdev = await Dev.updateOne(
      { github_username },
      {
        techs: techs ? techsArray : dev.techs,
        ...rest,
      }
    );

    return response.json({
      modifiedCount: newdev.nModified,
      ok: newdev.ok,
    });
  },

  async read(request, response) {
    const { github_username } = request.params;
    const dev = await Dev.findOne({ github_username });

    return response.json(dev === null ? {} : dev);
  },

  async delete(request, response) {
    const { github_username } = request.params;

    await Dev.deleteOne({ github_username });
    return response.json();
  },
};
