# 🎬 Movie Discovery App

A modern React application for discovering movies based on your mood, searching for films, and managing your watchlist. Built with React, Redux, and Material-UI, powered by TMDB API.

## ✨ Features

- **Mood-based Movie Discovery**: Find movies based on different moods
  - Feel Good: Light-hearted and family-friendly movies
  - Action Fix: Action-packed and adventurous movies
  - Mind Benders: Mystery and thriller movies

- **Search Functionality**
  - Search for movies by title
  - Real-time search results
  - Pagination for large result sets

- **Movie Details**
  - Comprehensive movie information
  - Watch trailers directly on the detail page
  - Add/Remove movies from your watchlist

- **Personal Watchlist**
  - Save movies for later viewing
  - Persistent storage using localStorage
  - Easy management of saved movies

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-discovery
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. The app is already configured with a TMDB API key (aaeed47574ca7855f61da350f63d9c86). If you want to use your own key:
   - Get an API key from [TMDB](https://www.themoviedb.org/settings/api)
   - Replace the key in `src/services/tmdbApi.js`

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 🛠️ Built With

- [React](https://reactjs.org/) - Frontend library
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Material-UI](https://mui.com/) - UI components and styling
- [React Router](https://reactrouter.com/) - Navigation and routing
- [TMDB API](https://www.themoviedb.org/documentation/api) - Movie data source

## 📱 Features in Detail

### Home Page
- Browse popular movies
- Select mood categories
- Search functionality
- Quick access to watchlist

### Movie Details Page
- View comprehensive movie information
- Watch movie trailers
- Add/Remove from watchlist
- Navigate back to previous page

### Watchlist Page
- View all saved movies
- Remove movies from watchlist
- Navigate to movie details
- Persistent storage using localStorage

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie database API
- [Material-UI](https://mui.com/) for the beautiful UI components
- All the contributors who have helped with the project