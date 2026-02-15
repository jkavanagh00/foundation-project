# FlipMaster

## Project Description
Foundation project for Hack Your Future. Memory game made according to the following brief: https://program.hackyourfuture.dk/course-content/foundation/final-project/project-brief

## Core Features
- Single player card-matching memory game
- Animated flip cards
- Win detection
- Shuffling algorithm

## Extra Features
- Moves and matches tracking
- Game timer
- Scoring system
- Multiple card decks
- Games of different sizes

## Project Structure

### index.html
- Game grid structure
- Statistics display
- Game win popup
- New game button

### styles.css
- 3D flip card animations using CSS transforms
- Responsive grid layout (4x4)
- Fade-out animations for matched cards
- Win popup styling

### index.js
Application entry point that initializes the Game class and exposes it to the global window object for DOM event handlers.

### game.js
Core game logic class containing:
- Card creation and shuffling (Fisher-Yates algorithm)
- Game state management (moves, matches, timer)
- Event handling for card clicks and flips
- Win condition detection
- Card animation methods (flip, fade-out, reset)

## Technologies Used

- Vanilla JavaScript
- CSS3
- HTML5
- MYSQL(Database)
- PostgreSQL (for Render deployment)
- postman(for API checkup)

## Future improvements

- Backend database for storing scores
- Leaderboard
- Personal Best Tracking
- Sound & Animations
- Settings
- Themes
- Time pressure mode

## Known Issues

- Leaderboard feature is implemented but still has several bugs
