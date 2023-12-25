import { Request, Response } from 'express';
import Tile from '../models/tile.model';

export const bulkUpdateTiles = async (req: Request, res: Response) => {
  try {
    const bulkOps = req.body.map((op: { insertOne: { document: any; }; updateOne: { filter: any; update: any; }; deleteOne: { filter: any; }; }) => {
      if (op.insertOne) {
        const { document } = op.insertOne;
        return { insertOne: { document } };
      } else if (op.updateOne) {
        const { filter, update } = op.updateOne;
        return { updateOne: { filter, update } };
      } else if (op.deleteOne) {
        const { filter } = op.deleteOne;
        return { deleteOne: { filter } };
      } else {
        throw new Error('Invalid bulk operation');
      }
    });

    if (bulkOps.length === 0) {
      return res.status(400).json({ message: 'No operations to perform' });
    }

    const result = await Tile.bulkWrite(bulkOps);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error performing bulk operation', error });
  }
};

export const getTiles = async (req: Request, res: Response) => {
    try {
      const tiles = await Tile.find();
      res.json(tiles);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tiles', error });
    }
  };

  export const updateTileColor = async (req: Request, res: Response) => {
    try {
      const _id = req.params._id;
      console.log(_id)
      const { color } = req.body;
      const tile = await Tile.findByIdAndUpdate(_id, { color }, { new: true });
      if (!tile) {
        return res.status(404).json({ message: 'Tile not found' });
      }
      res.json(tile);
    } catch (error) {
      res.status(500).json({ message: 'Error updating tile', error });
    }
  };
  
  export const deleteTile = async (req: Request, res: Response) => {
    try {
      const _id = req.params._id;
      const tile = await Tile.findByIdAndDelete(_id);
      if (!tile) {
        return res.status(404).json({ message: 'Tile not found' });
      }
      res.status(200).json({ message: 'Tile deleted', tile });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting tile', error });
    }
  };

  export const createTile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { color } = req.body;
      const newTile = new Tile({ color });
      await newTile.save();
      res.status(201).json(newTile); 
    } catch (error) {
      res.status(400).json({ message: 'Error creating new tile', error });
    }
  };
  