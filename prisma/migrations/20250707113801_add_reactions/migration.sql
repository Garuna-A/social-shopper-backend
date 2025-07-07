-- CreateTable
CREATE TABLE "Reaction" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_itemId_key" ON "Reaction"("userId", "itemId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CartItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
