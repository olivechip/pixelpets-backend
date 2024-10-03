# Pixelpets - Backend

This repository contains the backend code for Pixelpets, a web application inspired by the beloved 90s game, Neopets. It provides the API endpoints for creating, adopting, and interacting with virtual pets.

**Disclaimer:**  I do not own or claim any rights to the Neopets images used in this project. As of October 2024, all Neopets images are the property of World of Neopia, Inc.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installation

1. Clone the repository: `git clone <backend-repository-url>`
2. Install dependencies: `npm install`
3. Set up the database:
   * Create a PostgreSQL database (e.g., `pixelpets_db`).
   * Update the database connection details in the `.env` file.
4. Start the development server: `node app.js`

## API Endpoints

* `/users`: Endpoints for user authentication and management.
* `/pets`:  Endpoints for creating, retrieving, updating, and deleting Pixelpets.
* `/pound`: Endpoints for managing the Pixel Pound (adoption and releasing pets).

## Future Development

*   Searchable pets and users.
*   Inventory system with different food and toy items.
*   In-game currency that can be earned from activity.
*   Implement a battle system for Pixelpets.
*   Add more customization options (More colors, backgrounds, custom bios, etc.).
*   Develop a social system for users to interact and share their Pixelpets.

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Custom-built web scraper for Neopets images 
  ([link]https://github.com/olivechip/neopets_scraping_tool)

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for new features, please open an issue or submit a pull request.

## Contact

* Oliver C - [linked](https://www.linkedin.com/in/ochang89/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.