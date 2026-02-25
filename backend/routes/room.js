import {Router} from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import {createRoom, joinRoom, getRoom, deleteRoom, leaveRoom, updateCode, getMyRooms} from '../controllers/room.js'

const router = Router()

router.post('/create', verifyToken, createRoom)
router.post('/join', verifyToken, joinRoom)
router.get('/my-rooms', verifyToken, getMyRooms)
router.get('/:roomId', verifyToken, getRoom)
router.delete('/:roomId', verifyToken, deleteRoom)
router.post('/leave/:roomId', verifyToken, leaveRoom)
router.put('/:roomId/code', verifyToken, updateCode)

export default router;