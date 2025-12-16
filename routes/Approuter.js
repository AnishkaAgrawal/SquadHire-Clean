const express = require("express");
const Approuter = express.Router();

// Fake video data
async function fetchPlaceholderVideos() {
  const staticVideoData = [
    { id: 'fAGJHxZDBUk', title: 'Graphic Design Trends 2025 Ft. Ashlee Harrell', saves: 42, likes: 105 },
    { id: 'UI-ZL_J6La0', title: 'Digital Marketing Explained in 30 Seconds', saves: 88, likes: 212 },
    { id: 'i2wiMhMcO4M', title: 'Graphic Design Idea for You', saves: 21, likes: 55 },
    { id: '_wN0DUYYLHU', title: '3 Basics of Digital Marketing You Must Know!', saves: 65, likes: 180 },
    { id: 'uNmLVaIO_Wo', title: 'DIGITAL MARKETING Explained In 60 SECONDS | Ishan Sharma', saves: 99, likes: 301 }
  ];

  return staticVideoData.map(item => ({
    _id: item.id,
    title: item.title,
    clientName: 'Demo Client',
    squadName: 'GenZ Squad ' + item.id.substring(0, 3),
    skillsUsed: ['Video Editing', 'Design', 'Strategy'],
    mediaURL: `https://www.youtube.com/embed/${item.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${item.id}`,
    saves: item.saves,
    likes: item.likes
  }));
}

// GET reels page
Approuter.get('/', async (req, res) => {
  try {
    const placeholderVideos = await fetchPlaceholderVideos();

    res.render("Reel", {
      projects: placeholderVideos,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });

  } catch (err) {
    console.error('Error fetching feed:', err);
    res.status(500).send('Server Error loading the Discovery Feed.');
  }
});

// Simulated save
Approuter.post('/save/:id', (req, res) => {
  res.json({
    success: true,
    saves: Math.floor(Math.random() * 100) + 1
  });
});

// Simulated like
Approuter.post('/like/:id', (req, res) => {
  res.json({
    success: true,
    likes: Math.floor(Math.random() * 300) + 1
  });
});

module.exports = Approuter;
