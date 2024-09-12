const express = require('express');
const router = express.Router();
const Pound = require('../models/pound');
const Pet = require('../models/pet');

// Get all pets in adoption center
router.get('/', async (req, res) => {
  try {
    const pets = await Pound.findAll();
    if (pets.length === 0){
      res.json('There are no pets up for adoption at the moment');
    } else {
      res.json(pets);
    }
  } catch (error) {
    console.error('Error fetching pound pets:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Abandon pet (add to adoption center)
router.post('/abandon/:petId', async (req, res) => {
    const petId = req.params.petId;
    const userId = req.user.userId;
    try {
        const pet = await Pet.findById(petId);
        if (!pet || pet.owner_id !== userId) {
          return res.status(403).json({ error: 'You can only abandon your own pets' });
        }
        await Pound.abandon(petId);
        res.json({ message: 'Pet abandoned successfully' });
    } catch (error) {
        console.error('Error abandoning pet:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Adopt pet (remove from adoption center)
router.post('/adopt/:petId', async (req, res) => {
    const petId = req.params.petId;
    const newOwnerId = req.user.userId;
    try {
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        if (pet.owner_id !== null) {
            return res.status(400).json({ error: 'This pet is not available for adoption' });
        }
        await Pound.adopt(petId, newOwnerId);
        res.json({ message: 'Pet adopted successfully' });
    } catch (error) {
        console.error('Error adopting pet:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;