const express = require('express');
const router = express.Router();
const Pet = require('../models/pet');

// Get all pets (for testing/admin purposes, might need authentication later)
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.findAll();
    res.json(pets.rows);
  } catch (err) {
    console.error('Error fetching pets:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get a pet by ID
router.get('/:petId', async (req, res) => {
    const { petId } = req.params;
    try {
      const pet = await Pet.findById(petId); 
      if (pet) {
        res.json(pet);
      } else {
        res.status(404).json({ error: 'Pet not found' });
      }
    } catch (error) {
      console.error('Error finding pet:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
// Create a new pet
router.post('/', async (req, res) => {
  const { owner_id, name, species, color, gender } = req.body;
  try {
    const newPet = await Pet.create({ owner_id, name, species, color, gender });
    res.status(201).json(newPet);
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(400).json({ error: error.message });
  }
});


// Update a pet
router.put('/:petId', async (req, res) => {
  const { petId } = req.params;
  const updates = req.body;
  try {
    const updatedPet = await Pet.update(petId, updates);
    res.json(updatedPet);
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a pet
router.delete('/:petId', async (req, res) => {
  const { petId } = req.params;
  try {
    const success = await Pet.delete(petId);
    if (success) {
      res.json({ message: 'Pet deleted successfully' });
    } else {
      res.status(404).json({ error: 'Pet not found' });
    }
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// // Feed a pet
// router.post('/:petId/feed', async (req, res) => {
//   const { petId } = req.params;
//   try {
//     const pet = await Pet.findById(petId);
//     if (!pet) {
//       return res.status(404).json({ error: 'Pet not found' });
//     }
//     await pet.feed(); // Call the feed instance method
//     res.json({ message: 'Pet fed successfully' });
//   } catch (error) {
//     console.error('Error feeding pet:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Play with a pet
// router.post('/:petId/play', async (req, res) => {
//   const { petId } = req.params;
//   try {
//     const pet = await Pet.findById(petId);
//     if (!pet) {
//       return res.status(404).json({ error: 'Pet not found' });
//     }
//     await pet.play(); // Call the play instance method
//     res.json({ message: 'Played with pet successfully' });
//   } catch (error) {
//     console.error('Error playing with pet:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

module.exports = router;