import express from 'express';
import { getTiles, updateTileColor, deleteTile, createTile, bulkUpdateTiles } from '../controllers/tiles.controller';


const router = express.Router();

router.get('/', getTiles);
router.patch('/:_id', updateTileColor); 
router.delete('/:_id', deleteTile);
router.post('/', createTile);
router.post('/bulk', bulkUpdateTiles); 

export default router;