// Create character objects
var charactersObj = {
  kenobi: {
    name: "Obi-Wan Kenobi",
    hp: 120,
    attackPower: 8,
    baseAttackPower: 8,
    counterAttackPower: 8
  },
  skywalker: {
    name: "Luke Skywalker",
    hp: 100,
    attackPower: 11,
    baseAttackPower: 11,
    counterAttackPower: 5
  },
  sidious: {
    name: "Darth Sidious",
    hp: 150,
    attackPower: 4,
    baseAttackPower: 4,
    counterAttackPower: 20
  },
  maul: {
    name: "Darth Maul",
    hp: 180,
    attackPower: 3,
    baseAttackPower: 3,
    counterAttackPower: 25
  }
};

$(document).ready(function () {
  // Declare DOM nodes
  var $charSelectDiv = $('#character-select');
  var $playerDiv = $('#player');
  var $enemiesDiv = $('#enemies');
  var $fightDiv = $('#fight');
  var $defenderDiv = $('#defender');
  var $message = $('#message');
  var $attack = $('#attack');
  var $reset = $('#reset');

  // Declare global variables
  var charName;
  var charClassSelector;
  var defenderActive = false;
  var playerCharacter;
  var enemyCharacter;
  var enemiesToDefeat = $charSelectDiv.children('.character').length -1;
  var enemiesDefeated = 0;

  function reset() {
    charName = "";
    charClassSelector = "";
    defenderActive = false;
    $charSelectDiv.removeClass('d-none');
    $charSelectDiv.append($('.character'));
    $charSelectDiv.children('.character').each(function () {
      $(this).removeClass('d-none')
    });
    $fightDiv.addClass('d-none');
    $message.text("");
    $reset.addClass('d-none');
    $playerDiv.addClass('d-none');
    $defenderDiv.addClass('d-none');
    $enemiesDiv.addClass('d-none');
    enemiesDefeated = 0;
    charactersObj.kenobi.hp = 120;
    charactersObj.kenobi.attackPower = charactersObj.kenobi.baseAttackPower;
    charactersObj.skywalker.hp = 100;
    charactersObj.skywalker.attackPower = charactersObj.skywalker.baseAttackPower;
    charactersObj.sidious.hp = 150;
    charactersObj.sidious.attackPower = charactersObj.sidious.baseAttackPower;
    charactersObj.maul.hp = 180;
    charactersObj.maul.attackPower = charactersObj.maul.baseAttackPower;
    update();
  };

  function update() {
    $('.kenobi .hp').text(charactersObj.kenobi.hp);
    $('.skywalker .hp').text(charactersObj.skywalker.hp);
    $('.sidious .hp').text(charactersObj.sidious.hp);
    $('.maul .hp').text(charactersObj.maul.hp);
  }

  function healthCheck() {

    if (playerCharacter.hp < 1) {
      playerCharacter.hp = 0;
      $message.text('You have been defeated... GAME OVER!');
      $attack.addClass('d-none');
      $reset.removeClass('d-none');
    };
    if (enemyCharacter.hp < 1) {
      
      enemyCharacter.hp = 0;
      $message.text('You have defeated ' + enemyCharacter.name + '! Select a new enemy to fight.');
      enemiesDefeated++;
      $attack.addClass('d-none');
      $defenderDiv.addClass('d-none');
      $charSelectDiv.append($defenderDiv.find(charClassSelector));
      defenderActive = false;

      // Check for win condition
      if (enemiesDefeated ===  enemiesToDefeat) {
        $message.text("You win! Click restart to play again.");
        $attack.addClass('d-none');
        $reset.removeClass('d-none');
      }
    }
  }

  function attack(callback) {
    if (defenderActive && playerCharacter.hp > 0) {
    
      // Deal damage to the enemy
      enemyCharacter.hp -= playerCharacter.attackPower;

      // Enemy only counterattacks if they are still alive
      if (enemyCharacter.hp > 1) {
        playerCharacter.hp -= enemyCharacter.counterAttackPower;
      }

      // Display damage
      $message.html(
        "<p>You attacked " + enemyCharacter.name + " for " + playerCharacter.attackPower + " damage.</p>" + 
        "<p>" + enemyCharacter.name + " attacked you back for " + enemyCharacter.counterAttackPower + " damage.</p>"
      );

      // Increase player attack power
      playerCharacter.attackPower += playerCharacter.baseAttackPower;

    } else {
      // If no enemy is preset, display a message
      $message.text('No enemy present. Please select an enemy to attack');
    }    
    callback();
  }

  // Reset game when clicked
  $('#reset').on('click', reset);

  // When a character in the character select area is clicked
  $('#character-select').on('click', '.character', function () {

    $charSelectDiv.addClass('d-none');

    // Store the class name of the element clicked
    charName = $(this).attr('data-name');
    charClassSelector = '.' + charName;

    // Show the corresponding character card in the player div
    $playerDiv.removeClass('d-none');
    $enemiesDiv.removeClass('d-none');
    $playerDiv.append($(this));

    // Set the playerCharacter variable to the corresponding character object
    playerCharacter = charactersObj[charName];

    // Iterate over the remaining characters and place them in #enemies
    $charSelectDiv.children('.character').each(function () {
      $enemiesDiv.append($(this));
    });
  });

  $('#enemies').on('click', '.character', function () {

    // If no defender is active
    if (!defenderActive) {

      // set character selection variables
      charName = $(this).attr('data-name');
      charClassSelector = '.' + charName;

      // Hide the clicked character in #enemies
      // $enemiesDiv.find(charClassSelector).addClass('d-none');

      // Show the clicked character in #defender
      $defenderDiv.removeClass('d-none');
      // $defenderDiv.find(charClassSelector).removeClass('d-none');
      $defenderDiv.append($(this));

      // Show the fight/message area and attack button
      $fightDiv.removeClass('d-none');
      $attack.removeClass('d-none');

      // Set the enemyCharacter variable to the corresponding character object
      enemyCharacter = charactersObj[charName];
      
      $message.text('Prepare for battle!');

      // Hide #enemies when no more are left
      console.log($enemiesDiv.children('.character').length);
      if ($enemiesDiv.children('.character').length ===  0) {
        $enemiesDiv.addClass('d-none');
      }

      defenderActive = true;
    }
  });

  // Attack button functionality
  $attack.on('click', function () {
    if (defenderActive) {
      attack(healthCheck);
      update();
    } else {
      $message.text("Select a new enemy to attack.");
    }
  });
});