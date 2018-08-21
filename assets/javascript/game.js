var obiWan = {
  name: "Obi-Wan Kenobi",
  hp: 120,
  attackPower: 8,
  image: "obi-wan.jpg"
};

var skywalker = {
  name: "Luke Skywalker",
  hp: 100,
  attackPower: 5,
  image: "luke-skywalker.jpg"
};

var sidious = {
  name: "Darth Sidious",
  hp: 150,
  attackPower: 20,
  image: "darth-sidious.jpg"
};

var maul = {
  name: "Darth Maul",
  hp: 180,
  attackPower: 25,
  image: "darth-maul.jpg"
};

$(document).ready(function() {
  var playerCharacter;
  var $obiWanElement = $("<div>", {id: "kenobi", "class": "character"});
  $('.character-select').append($obiWanElement);
});
