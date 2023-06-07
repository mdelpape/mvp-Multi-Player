const Players = require('./models.js');

const postPlayer = (player) => {
  // console.log('controller', player);
  return Players.create({user:player.user, id:player.id, className:player.className})
  .then(() => console.log('player posted'))
  .catch((err) => console.log(err))
}
module.exports = postPlayer;