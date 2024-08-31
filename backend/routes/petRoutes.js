const express = require('express');
const router = express.Router();
const Pet = require('../models/pet');

// Get all pets (for testing/admin purposes, might need authentication later)
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.findAll();
    res.json(pets.rows);
  } catch (error) {
    console.error('Error fetching pets:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get all pets in adoption center
router.get('/adoption', async (req, res) => {
  try {
    const pets = await Pet.findPetsforAdoption();
    res.json(pets);
  } catch (error) {
    console.error('Error fetching adoption center pets:', error);
    res.status(500).json({ error: 'Server error' });
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
  const { name, species, color, gender } = req.body;
  const owner_id = req.user.userId;
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
    if (req.user.userId !== pet.owner_id) {
      return res.status(403).json({ error: 'Forbidden - You can only update your own pets' });
    }
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
    if (req.user.userId !== pet.owner_id) {
      return res.status(403).json({ error: 'Forbidden - You can only delete your own pets' });
    }

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


// Add a pet to the adoption center
router.post('/:petId/adoption', async (req, res) => {
  const { petId } = req.params;
  try {
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    if (req.user.userId !== pet.owner_id) {
      return res.status(403).json({ error: 'Forbidden - You can only post your own pets for adoption' });
    }    
    await Pet.addToAdoption(petId);
    res.json({ message: 'Pet added to adoption center' });
  } catch (error) {
    console.error('Error adding pet to adoption center:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Adopt a pet from the adoption center
router.post('/:petId/adopt', async (req, res) => {
  const { petId } = req.params;
  const { newOwnerId } = req.user.userId;
  try {
    await Pet.removeFromAdoption(petId, newOwnerId);
    res.json({ message: 'Pet adopted successfully' });
  } catch (error) {
    console.error('Error adopting pet:', error);
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