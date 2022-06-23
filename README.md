# Space-Invaders
Space Invaders made with JS with canvas.

## How to play
* w, a, s, d - keys for movement.
* Space to shoot. 

## Goal
Last as long as possible and get as many points as possible. Every invader destroyed gives 100 points.

## Screenshots
![SpaceInvaders_StartScr html](https://user-images.githubusercontent.com/85744016/175244184-27dccc93-3477-4861-8a45-ff43dff86647.png)
![SpaceInvaders_Gameplay html](https://user-images.githubusercontent.com/85744016/175244209-f134d319-b870-4efd-9fbc-a4c018450784.png)
![SpaceInvaders_GameOverScr html](https://user-images.githubusercontent.com/85744016/175244196-912e135c-bd4b-4a82-9c22-0d0fc5058d88.png)

## Assets
Most assets can be changed. Invader's width should be 31 pixels or you will have to make changes in the code.
* [Gameplay sounds](https://www.classicgaming.cc/classics/space-invaders/sounds)
* [Menu sounds](https://pixabay.com)
* [Spaceship](https://www.pinpng.com)
* [Invader](https://www.pngegg.com)

## Optimizations
* `setTimeout(() => {...}, 0);` - In order to get the quickest response possible from the machine, that runs the script. It can also be adjusted for better gameplay experience.
* Garbage collection for all elements of the game (projectiles, invaders, grids).
* Using the same particles on the screen to visualize stars instead of deleting them and creating new ones. 

## Future improvements
* Adding a database to keep scores, times and player initials in game over screen.
* Adding boosts & perks for the player to use during playthrough.
* Adding difficulty modifier.
* Adding different invaders that behave differently.

## Known issues
* Play again refreshes the page instead of resetting the state of the game.
* Caps locked or different language input for movement is ignored by the script.
* There is a bug with the timer when the game ends. Timer briefly sets itself to 00:00 before goinfg to the 
game over screen. It does not affect the game over screen result. This bug rarely appears.
