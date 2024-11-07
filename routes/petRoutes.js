const express = require('express');
const router = express.Router();
const Pet = require('../models/pet');

// Get all pets (for testing/admin purposes, might need authentication later)
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.findAll();
    res.json(pets.rows);
  } catch (error) {
    console.error('Error getting all pets:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// moved to unprotected
// Search for pets by keyword
// router.post('/search', async (req, res) => {
//   try {
//     const { keyword } = req.body; 
//     const pets = await Pet.search(keyword);
//     res.json(pets); 
//   } catch (error) {
//     console.error('Error searching for pets:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// Get a pet by ID
router.get('/:petId', async (req, res) => {
  const { petId } = req.params;
  try {
    const petIdInt = parseInt(petId, 10);
    const petData = await Pet.find({ id: petIdInt });
    if (!petData) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    res.json(petData);
  } catch (error) {
    console.error('Error finding pet by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get pets by owner ID
router.get('/owner/:ownerId', async (req, res) => {
  const { ownerId } = req.params;
  try {
    const pets = await Pet.findByOwnerId(ownerId);
    res.json(pets);
  } catch (error) {
    console.error('Error getting pet(s) by owner ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new pet
router.post('/', async (req, res) => {
  try {
    const newPetData = await Pet.create(req.body);
    res.status(201).json(newPetData);
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a pet
router.put('/:petId', async (req, res) => {
  const { petId } = req.params;
  try {
    const petIdInt = parseInt(petId, 10);
    const petData = await Pet.find({ id: petIdInt });
    if (!petData) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Check if the user is the owner
    if (petData.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own pet' });
    }

    const updatedPet = await Pet.update(petId, req.body);
    res.json(updatedPet);
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a pet
router.delete('/:petId', async (req, res) => {
  const { petId } = req.params;
  try {
    const petIdInt = parseInt(petId, 10);
    const petData = await Pet.find({ id: petIdInt });
    if (!petData) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Check if the user is the owner
    if (petData.owner_id !== req.user.userId) {
      return res.status(403).json({ error: 'You can only delete your own pet' });
    }

    const deleted = await Pet.delete(petId);
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Play with a pet
router.post('/:petId/play', async (req, res) => {
  const { petId } = req.params;
  const { userId } = req.user;
  try {
    const petIdInt = parseInt(petId, 10);
    const petData = await Pet.find({ id: petIdInt });
    if (!petData) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    const pet = new Pet(petData);

    // Check if the user is the owner
    if (pet.owner_id !== userId) {
      return res.status(403).json({ error: 'You can only play with your own pet' });
    }

    await pet.play();

    res.json({ message: `Played with ${pet.name} successfully` });
  } catch (error) {
    console.error('Error playing with pet:', error);

    if (error.message.startsWith('HungerTooLow:')) {
      return res.status(400).json({ error: error.message.replace('HungerTooLow:', '') });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:petId/feed', async (req, res) => {
  const { petId } = req.params;
  const { userId } = req.user;
  try {
    const petIdInt = parseInt(petId, 10);
    const petData = await Pet.find({ id: petIdInt });
    if (!petData) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    const pet = new Pet(petData);

    // Check if the user is the owner
    if (pet.owner_id !== userId) {
      return res.status(403).json({ error: 'You can only feed your own pet' });
    }

    await pet.feed();

    res.json({ message: `Fed ${pet.name} successfully` });
  } catch (error) {
    console.error('Error feeding pet:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Pet another pet
router.post('/:petId/pet', async (req, res) => {
  const { petId } = req.params;
  const { userId } = req.user;
  try {
    const petIdInt = parseInt(petId, 10);
    const petData = await Pet.find({ id: petIdInt });
    if (!petData) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Check if the user is NOT the owner
    if (petData.owner_id === userId) {
      return res.status(403).json({ error: 'Sorry, you cannot pet your own pet' });
    }
    const pet = new Pet(petData);

    await pet.pet(userId);

    res.json({
      message: `Petted ${pet.name} successfully`,
      petId: pet.id
    });
  } catch (error) {
    console.error('Error petting pet:', error);

    // Handle the specific "once per day" error
    if (error.message.startsWith('PettingLimitReached:')) {
      return res.status(400).json({ error: error.message.replace('PettingLimitReached: ', '') });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;