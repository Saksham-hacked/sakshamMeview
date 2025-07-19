// controllers/topListController.js
import TopFive from '../model/topfive.model.js';

// @desc    Create a new top movie list
// @route   POST /api/toplist/create
// @access  Private
export const createTopList = async (req, res) => {
  const { userId, title, movies } = req.body;

  if (!userId || !title || !movies || !Array.isArray(movies) || movies.length === 0) {
    return res.status(400).json({ success: false, message: 'Please provide a userId, title, and a non-empty movies array.' });
  }

  try {
    const newList = await TopFive.create({ userId, title, movies });
    res.status(201).json({ success: true, data: newList, message: 'Top list created successfully.' });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You already have a list with this title.' });
    }
    console.error('Error creating top list:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all top lists for a specific user
// @route   GET /api/toplist/user/:userId
// @access  Private
export const getUsersTopLists = async (req, res) => {
  try {
    const topLists = await TopFive.find({ userId: req.params.userId });
    if (topLists.length === 0) {
      return res.status(404).json({ success: false, message: 'No top lists found for this user.' });
    }
    res.status(200).json({ success: true, data: topLists });

  } catch (error) {
    console.error('Error fetching user\'s top lists:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get a specific top list by its ID
// @route   GET /api/toplist/:listId
// @access  Public (or Private depending on your app's logic)
export const getTopListById = async (req, res) => {
  try {
    const topList = await TopFive.findById(req.params.listId);
    if (!topList) {
      return res.status(404).json({ success: false, message: 'Top list not found.' });
    }
    res.status(200).json({ success: true, data: topList });

  } catch (error) {
    console.error('Error fetching specific top list:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update a specific top list
// @route   PUT /api/toplist/:listId
// @access  Private
export const updateTopList = async (req, res) => {
  const { title, movies } = req.body;

  try {
    const topList = await TopFive.findByIdAndUpdate(
      req.params.listId,
      { title, movies },
      { new: true, runValidators: true }
    );

    if (!topList) {
      return res.status(404).json({ success: false, message: 'Top list not found.' });
    }
    res.status(200).json({ success: true, data: topList, message: 'Top list updated successfully.' });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You already have a list with this title.' });
    }
    console.error('Error updating top list:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete a specific top list
// @route   DELETE /api/toplist/:listId
// @access  Private
export const deleteTopList = async (req, res) => {
  try {
    const topList = await TopFive.findByIdAndDelete(req.params.listId);

    if (!topList) {
      return res.status(404).json({ success: false, message: 'Top list not found.' });
    }
    res.status(200).json({ success: true, message: 'Top list deleted successfully.' });

  } catch (error) {
    console.error('Error deleting top list:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};