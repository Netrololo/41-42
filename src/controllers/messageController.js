import * as messageService from '../services/messageService.js';

export async function getMessages(req, res, next) {
  try {
    const messages = await messageService.getMessages(req.params.id);
    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
}