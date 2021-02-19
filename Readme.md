<h1 style="text-align: center"> Fludoku </h1>

<p align="center">
<img src="assets/Fludoku.gif" alt="Fludoku Animation" >
</p>
 
## Table of Contents

* [Introduction](#introduction)
  * [Scoring](#scoring)
* [Running the App](#running-the-app)
* [Entity Relationship Diagram](#entity-relationship-diagram)
* [Contributing](#contributing)
  * [Known Issues](#known-issues)
  * [Contributors](#contributors)

 

### Introduction 
Fludoku was written as a phase 3 project in the Flatiron School Software Engineering program as a Single-page Web-app with a Ruby on Rails API backend. The backend API can be found at [Fludoku-back-end](https://github.com/josh-frank/fludoku-back-end/) on GitHub.

Fludoku uses a backtracking algorithm to generate randomized Sudoku games of a difficulty specified by the user. Information about how this algorithm functions can be found in this blog post: ["Generating & Solving Sudoku using Backtracking"](https://dev.to/dsasse07/generating-solving-sudoku-in-js-ruby-with-backtracking-4hm)

Within the app, a user can sign in using their name. There is no current Auth implemented. If a username mathcing the entered text has been saved to the database previously, their games will be loaded. If the username does not exist, a new user will be created.

Once logged in, a user can start new Sudoku games, save their progress, get hints, and solve their boards. If a user had previously started games, they will be able to load them from the initial menu as well.

### Scoring
A scoring system has been implemented:
- For each correctly answered value, 1 point is earned. 
- For each hint used, or incorrect value, 1 point is lost.
- If a board is successfully completed, bonus points equal to the number of holes originally in the starting board will be earned.

As a user earns points, the will rank up:

- Black Belt = 5000+ points
- Brown Belt = 3000+ points
- Green Belt = 2000+ points
- Purple Belt = 1000+ points
- Blue Belt = 500+ points
- Red Belt = 200+ points
- White Belt = under 200 points

[Top](#table-of-contents)

## Running the App
- Fork and clone this repo
- Fork and clone the [back-end repo](https://github.com/josh-frank/fludoku-back-end/tree/dev)
  - Follow the instructions in the backend Readme to start the necessary API
- Once the server has been started and is running on http://localhost:3000, `cd` into the cloned front-end directory.
- Open `index.html` by running `open index.html` in the terminal, or other preferred method.

## Contributing
Pull requests are welcome. Please make sure that your PR is <a href="https://www.netlify.com/blog/2020/03/31/how-to-scope-down-prs/">well-scoped</a>. For major changes, please open an issue first to discuss what you would like to change.

### Known issues
* <a href="https://github.com/josh-frank/fludoku-front-end/issues">Visit Issues Section</a>

[Top](#table-of-contents)

### Contributors
<table>
  <tr>
    <td align="center"><a href="https://github.com/dsasse07"><img src="https://avatars1.githubusercontent.com/u/72173601?s=400&u=57e4654c70d63d16bc5b84e2878d97f770672715&v=4" width="200px;" alt="Daniel Sasse"/><br /><sub><b>Daniel Sasse</b></sub></a><br />
    <td></td>
    <td align="center"><a href="https://github.com/josh-frank"><img src="https://avatars.githubusercontent.com/u/72422394?s=460&u=3b8dbdcda36d483426a2e794107f1f704b1592e8&v=4" width="200px;" alt="Josh Frank"/><br /><sub><b>Josh Frank</b></sub></a><br />
    </tr>