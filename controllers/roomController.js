const prisma = require('../prismaClient');
const { nanoid } = require('nanoid');

const createRoom = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name } = req.body;

    const room = await prisma.room.create({
      data: {
        name,
        code: nanoid(8), // generates unique code
        createdBy: userId,
        members: {
          connect: { id: userId }
        }
      }
    });

    res.status(201).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create room' });
  }
};

const getUserRooms = async (req, res) => {
  try {
    const userId = req.user.userId;

    const rooms = await prisma.room.findMany({
      where: {
        members: {
          some: {
            id: userId
          }
        }
      }
    });

    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
};

const joinRoom = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { code } = req.body;

    const room = await prisma.room.findUnique({
      where: { code },
      include: { members: true }
    });

    if (!room) return res.status(404).json({ message: 'Room not found' });

    const alreadyJoined = room.members.some(member => member.id === userId);
    if (alreadyJoined) return res.status(400).json({ message: 'Already a member' });

    await prisma.room.update({
      where: { id: room.id },
      data: {
        members: {
          connect: { id: userId }
        }
      }
    });

    res.json({ message: 'Joined room', room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to join room' });
  }
};

const getRoomById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const roomId = parseInt(req.params.id);

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        members: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            addedBy: { select: { id: true, name: true, email: true } }
          },
          orderBy: { id: 'desc' }
        }
      }
    });

    if (!room) return res.status(404).json({ message: 'Room not found' });


    const isMember = room.members.some(member => member.id === userId);
    if (!isMember) return res.status(403).json({ message: 'Not a member of this room' });

    res.json(room);
  } catch (err) {
    console.error('Error fetching room dashboard:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { createRoom, getUserRooms, joinRoom, getRoomById };
