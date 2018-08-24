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
  console.log(charactersObj.length);
  // Declare DOM nodes
  var $kenobiElement = $('#kenobi');
  var $skywalkerElement = $('#skywalker');
  var $sidiousElement = $('#sidious');
  var $maulElement = $('#maul');
  var $charSelectDiv = $('#character-select');
  var $playerDiv = $('#player');
  var $enemiesDiv = $('#enemies');
  var $fightDiv = $('#fight');
  var $defenderDiv = $('#defender');
  var $message = $('#message');
  var $attack = $('#attack');
  var $reset = $('#reset');

  var charName;
  var charClassSelector;
  var defenderActive = false;
  var playerCharacter;
  var enemyCharacter;
  var charactersDefeated = 0;

  function reset() {
    charName = "";
    charClassSelector = "";
    defenderActive = false;
    $charSelectDiv.children().each(function () {
      $(this).removeClass('d-none')
    });
    $playerDiv.children('.character').each(function () {
      $(this).addClass('d-none')
    });
    $enemiesDiv.children('.character').each(function () {
      $(this).addClass('d-none')
    });
    $defenderDiv.children('.character').each(function () {
      $(this).addClass('d-none')
    });
    $fightDiv.addClass('d-none');
    $message.text("");
    $reset.addClass('d-none');
    $playerDiv.addClass('d-none');
    $defenderDiv.addClass('d-none');
    $enemiesDiv.addClass('d-none');
    charactersDefeated = 0;
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
      charactersDefeated++;
      $attack.addClass('d-none');
      $defenderDiv.addClass('d-none');
      $defenderDiv.find(charClassSelector).addClass('d-none');
      defenderActive = false;

      // Check for win condition
      if (charactersDefeated ===  3) {
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
    // show the character that was clicked

    // Assign a variable to store the class name of the element clicked
    charName = $(this).attr('data-name');
    charClassSelector = '.' + charName;

    // Show the corresponding character card in the player div
    $playerDiv.removeClass('d-none');
    $enemiesDiv.removeClass('d-none');
    $playerDiv.find(charClassSelector).removeClass('d-none');

    // TODO Set the playerCharacter variable to the corresponding character object
    playerCharacter = charactersObj[charName];

    console.log(playerCharacter);

    // Iterate over the remaining characters and hide them
    $charSelectDiv.children().each(function () {
      $(this).addClass('d-none');
    });

    // Show the remaining characters in the enemies div
    $enemiesDiv.children().each(function () {
      console.log("data-name: " + $(this).attr('data-name') + " | charClassSelector: " + charClassSelector);
      if ($(this).attr('data-name') !== charName) {
        $(this).removeClass('d-none');
      }
    });
  });

  $('#enemies').on('click', '.character', function () {

    // If no defender is active
    if (!defenderActive) {

      // set character selection variables
      charName = $(this).attr('data-name');
      charClassSelector = '.' + charName;

      // Hide the clicked character in #enemies
      $enemiesDiv.find(charClassSelector).addClass('d-none');

      // Show the clicked character in #defender
      $defenderDiv.removeClass('d-none');
      $defenderDiv.find(charClassSelector).removeClass('d-none');

      // Show the attack button
      $fightDiv.removeClass('d-none');
      $attack.removeClass('d-none');

      // Set the enemyCharacter variable to the corresponding character object
      enemyCharacter = charactersObj[charName];
      
      $message.text('Prepare for battle!');

      if (charactersDefeated ===  2) {
        $enemiesDiv.addClass('d-none');
      }

      // set defenderActive boolean to true
      defenderActive = true;
    }
  });

  // TODO attack button functionality
  $attack.on('click', function () {
    if (defenderActive) {
      attack(healthCheck);
      update();
    } else {
      $message.text("Select a new enemy to attack.");
    }

  });

});


