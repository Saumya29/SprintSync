import {generateTaskDescription} from './service.js';

export const getTaskDescription = async (req, res) => {
  try {
    const {title} = req.body;

    if (!title) {
      return res.status(422).json({message: 'Title is required'});
    }

    const description = await generateTaskDescription(title);
    return res.json({description});
  } catch (error) {
    return res.status(500).json({message: 'Failed to generate description', error: error.message});
  }
};
