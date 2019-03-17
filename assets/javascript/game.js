// Create character objects
var charactersObj = {
  rey: {
    name: "Rey",
    hp: 115,
    attackPower: 6,
    baseAttackPower: 6,
    counterAttackPower: 15
  },
  kylo: {
    name: "Kylo",
    hp: 130,
    attackPower: 5,
    baseAttackPower: 5,
    counterAttackPower: 21
  },
  finn: {
    name: "Finn",
    hp: 110,
    attackPower: 9,
    baseAttackPower: 9,
    counterAttackPower: 7
  },
  snoke: {
    name: "Snoke",
    hp: 110,
    attackPower: 5,
    baseAttackPower: 5,
    counterAttackPower: 26
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
  var defenderActive = false;
  var playerCharacter;
  var enemyCharacter;
  var enemiesToDefeat = $charSelectDiv.children('.character').length -1;
  var enemiesDefeated = 0;
  var losses = 0;

  function reset() {
    charName = "";
    defenderActive = false;
    $charSelectDiv.removeClass('d-none');
    $charSelectDiv.append($('.character'));
    $charSelectDiv.children('.character').each(function () {
      $(this).removeClass('d-none attack-left attack-right')
    });
    $fightDiv.addClass('d-none');
    $message.html("");
    $reset.addClass('d-none');
    $playerDiv.addClass('d-none');
    $defenderDiv.addClass('d-none');
    $enemiesDiv.addClass('d-none');
    enemiesDefeated = 0;
    charactersObj.rey.hp = 115;
    charactersObj.rey.attackPower = charactersObj.rey.baseAttackPower;
    charactersObj.kylo.hp = 130;
    charactersObj.kylo.attackPower = charactersObj.kylo.baseAttackPower;
    charactersObj.finn.hp = 110;
    charactersObj.finn.attackPower = charactersObj.finn.baseAttackPower;
    charactersObj.snoke.hp = 110;
    charactersObj.snoke.attackPower = charactersObj.snoke.baseAttackPower;
    update();
  };

  function update() {
    $('[data-name=rey] .hp').text(charactersObj.rey.hp);
    $('[data-name=kylo] .hp').text(charactersObj.kylo.hp);
    $('[data-name=finn] .hp').text(charactersObj.finn.hp);
    $('[data-name=snoke] .hp').text(charactersObj.snoke.hp);
  }

  function healthCheck() {

    if (playerCharacter.hp < 1) {
      playerCharacter.hp = 0;
      losses++;
      if (losses > 2) {
        $message.html('<p>You have been defeated... GAME OVER!</p>' + 
        '<p>Don\'t get discouraged... it is possible to win with every character!</p>');
      } else {
        $message.html('<p>You have been defeated... GAME OVER!</p>');
      }
      $attack.addClass('d-none');
      $reset.removeClass('d-none');
    };
    if (enemyCharacter.hp < 1) {
      
      enemyCharacter.hp = 0;
      $message.html('<p>You have defeated ' + enemyCharacter.name + '! Select a new enemy to fight.</p>');
      enemiesDefeated++;
      $attack.addClass('d-none');

      $('#defender').addClass('d-none');
      $charSelectDiv.append($('#defender .character'));
      defenderActive = false;

      // Check for win condition
      if (enemiesDefeated ===  enemiesToDefeat) {
        $message.html("<p>You win! Click restart to play again.</p>");
        $attack.addClass('d-none');
        $('.attack-left').removeClass('attack-left')
        $('.attack-right').removeClass('attack-right')
        $reset.removeClass('d-none');
      }
    }
  }

  function attack(callback) {
    if (defenderActive && playerCharacter.hp > 0) {
    
      // Deal damage to the enemy
      enemyCharacter.hp -= playerCharacter.attackPower;

      attackAnimation();

      // Enemy only counterattacks if they are still alive
      if (enemyCharacter.hp > 1) {
        playerCharacter.hp -= enemyCharacter.counterAttackPower;
      }

      // Display damage
      $message.html(
        `<p>You attacked ${enemyCharacter.name} for <strong>${playerCharacter.attackPower}</strong> damage.</p>
        <p>${enemyCharacter.name} attacked you back for <strong>${enemyCharacter.counterAttackPower}</strong> damage.</p>`
      );

      // Increase player attack power
      playerCharacter.attackPower += playerCharacter.baseAttackPower;

    } else {
      // If no enemy is preset, display a message
      $message.html('<p>No enemy present. Please select an enemy to attack</p>');
    }    
    callback();
  }


  function attackAnimation() {
    // clone the characters and add the animation class
    let $player = $('#player .character').removeClass('attack-right attack-left');
    let $clonedPlayer = $player.clone(true).addClass('attack-right');
    let $defender = $('#defender .character').removeClass('attack-right attack-left');
    let $clonedDefender = $defender.clone(true);
    setTimeout(() => {
      $clonedDefender.addClass('attack-left')
    }, 200);
    
    // Insert the cloned elements before the originals
    $player.before($clonedPlayer);
    $defender.before($clonedDefender);
            
    // remove the original characters
    $("#player .character:last").remove();
    $("#defender .character:last").remove();    
  }

  // Reset game when clicked
  $('#reset').on('click', reset);

  // When a character in the character select area is clicked
  $('#character-select').on('click', '.character', function () {

    $charSelectDiv.addClass('d-none');

    // Show the corresponding character card in the player div
    $playerDiv.removeClass('d-none');
    $playerDiv.append($(this));

    // Store the class name of the element clicked
    charName = $(this).attr('data-name');

    // Set the playerCharacter variable to the corresponding character object
    playerCharacter = charactersObj[charName];

    // Iterate over the remaining characters and place them in #enemies
    $enemiesDiv.removeClass('d-none');
    $charSelectDiv.children('.character').each(function () {
      $enemiesDiv.append($(this));
    });
  });

  $('#enemies').on('click', '.character', function () {

    // If no defender is active
    if (!defenderActive) {

      // set character selection variables
      charName = $(this).attr('data-name');

      // Set the enemyCharacter variable to the corresponding character object
      enemyCharacter = charactersObj[charName];

      // Show the clicked character in #defender
      $defenderDiv.removeClass('d-none');
      $defenderDiv.append($(this));

      // Show the fight/message area and attack button
      $fightDiv.removeClass('d-none');
      $attack.removeClass('d-none');
      
      $message.html('<p>Prepare for battle!</p>');

      // Hide #enemies when no more enemies are left
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
      $message.html("<p>Select a new enemy to attack.</p>");
    }
  });
});