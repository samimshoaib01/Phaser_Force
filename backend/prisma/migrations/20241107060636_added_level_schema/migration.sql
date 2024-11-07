-- CreateEnum
CREATE TYPE "LevelName" AS ENUM ('Level1', 'Level2', 'Level3', 'Level4', 'Level5');

-- CreateTable
CREATE TABLE "Level" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "levelName" "LevelName" NOT NULL,
    "SPI" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isComp" BOOLEAN NOT NULL DEFAULT false,
    "x" INTEGER NOT NULL DEFAULT 800,
    "y" INTEGER NOT NULL DEFAULT 1550,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bestSPI" DOUBLE PRECISION NOT NULL DEFAULT 7.5,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Level_userId_levelName_key" ON "Level"("userId", "levelName");

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
