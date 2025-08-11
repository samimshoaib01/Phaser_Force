# Phaser Force

[![Phaser Force Demo](https://img.youtube.com/vi/2PNlwfT6KVg/0.jpg)](https://www.youtube.com/watch?v=2PNlwfT6KVg)

*Phaser Force* is an interactive scavenger hunt game that allows players to virtually explore a college campus, learn about its history, and compete with others in a fun and engaging way. The game is inspired by the "She Knows" concept, encouraging exploration and learning in a competitive environment.

## 🚀 Gameplay

The core of *Phaser Force* is a scavenger hunt. Players are given hints that lead them to different locations on the campus map. Upon reaching the correct location, they are presented with questions. Answering correctly allows them to advance to the next level and boosts their score on the leaderboard. The game also features a dynamic SPI (a scoring metric) calculation based on the correctness and time taken to answer questions. For ease of navigation, a mini-map is provided. If a player leaves the game, their progress, including their last location and time played, is saved, allowing them to resume their adventure at any time.

## ✨ Features

* **User Authentication:** Secure sign-in and sign-up with options for both email/password (with OTP verification) and Google Sign-In.
* **Explore Mode:** A "free-roam" mode where users can navigate the campus map, explore buildings, and learn interesting facts about them. You can even drive a car around the campus!
* **Adventure Game:** The main scavenger hunt mode where players solve hints and answer questions to progress.
* **Leaderboard (Hall of Fame):** A global leaderboard that displays all players and their SPIs, fostering a competitive spirit.
* **Completed Levels Tracker:** Players can view their progress, including completed levels and their total SPI.
* **Dynamic SPI Calculation:** The game dynamically calculates the player's score based on the correctness and the time taken to answer questions.
* **Resume Game:** Players can pick up where they left off, with their previous playing time and coordinates restored.

---

## 🗺️ Tiled Map Screenshot

*<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/97f00bd2-97aa-41ee-9644-fd5f9e351a19" />
*

---

## 🎯 Problem Solved

*Phaser Force* addresses the following:

* **Virtual Campus Exploration:** Provides a way for students, alumni, and prospective students to virtually explore the campus and its surroundings.
* **Interactive Learning:** Helps users learn about the campus history and important locations in an engaging and fun way, rather than through traditional, static methods.
* **Community Building:** The competitive nature of the game, with its leaderboard, encourages a sense of community and friendly competition among players.

---

## 🛠️ Challenges We Ran Into

During the development of *Phaser Force*, we encountered and overcame several technical challenges:

* **Pixel Bleeding:** Preventing textures from bleeding into one another in our game maps.
* **Live Location Tracking:** Continuously sending the user's live location to our backend, even when the game is not the active window.
* **Seamless Map Transitions:** Ensuring smooth transitions for the player as they move between different maps and areas of the campus.
* **Dynamic SPI Calculation:** Implementing a fair and balanced scoring system that dynamically adjusts based on player performance.
* **State Restoration:** Saving and restoring the player's state (time, coordinates) to allow for a seamless "resume game" feature.

---

## 🎬 Demo

Click the image below to watch a video demonstration of the project:

[![Phaser Force Demo](https://img.youtube.com/vi/2PNlwfT6KVg/0.jpg)](https://www.youtube.com/watch?v=2PNlwfT6KVg)
