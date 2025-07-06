const prisma = require('../prismaClient');

const addItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, price, imageUrl, link, roomId } = req.body;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { members: true }
    });

    if (!room) return res.status(404).json({ message: 'Room not found' });

    const isMember = room.members.some(member => member.id === userId);
    if (!isMember) return res.status(403).json({ message: 'You are not a member of this room' });

    const duplicate = await prisma.cartItem.findFirst({
      where: {
        roomId,
        addedById: userId,
        name: { equals: name, mode: 'insensitive' }
      }
    });

    if (duplicate) {
      return res.status(400).json({ message: 'Item with this name already added by you in this room' });
    }

    // Add the item
    const item = await prisma.cartItem.create({
      data: {
        name,
        price,
        imageUrl,
        link,
        room: { connect: { id: roomId } },
        addedBy: { connect: { id: userId } },
        status: 'pending'
      }
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add item' });
  }
};


const getItemsForRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.roomId);

    // Get all items for that room, ordered by most recent
    const items = await prisma.cartItem.findMany({
      where: { roomId },
      include: {
        addedBy: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { id: 'desc' }
    });

    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateItemStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const itemId = parseInt(req.params.itemId);
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { room: true }
    });

    if (!item) return res.status(404).json({ message: "Item not found" });

    // Only creator of the room can update item status
    if (item.room.createdBy !== userId) {
      return res.status(403).json({ message: "Not authorized to update item" });
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { status }
    });

    res.json(updated);
  } catch (err) {
    console.error("Error updating item status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const itemId = parseInt(req.params.itemId);

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId }
    });

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.addedById !== userId) {
      return res.status(403).json({ message: "You can only delete your own items" });
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { addItem, getItemsForRoom, updateItemStatus, deleteItem };
