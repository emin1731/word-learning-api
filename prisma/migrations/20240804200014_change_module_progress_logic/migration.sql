/*
  Warnings:

  - You are about to alter the column `progress` on the `Module` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Module" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "progress" REAL NOT NULL DEFAULT 0,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Module_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Module" ("authorId", "createdAt", "description", "id", "isPrivate", "name", "progress", "updatedAt") SELECT "authorId", "createdAt", "description", "id", "isPrivate", "name", "progress", "updatedAt" FROM "Module";
DROP TABLE "Module";
ALTER TABLE "new_Module" RENAME TO "Module";
CREATE UNIQUE INDEX "Module_id_key" ON "Module"("id");
CREATE UNIQUE INDEX "Module_authorId_key" ON "Module"("authorId");
CREATE TABLE "new_Term" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "isStarred" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Term_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Term" ("createdAt", "definition", "id", "imageUrl", "isStarred", "moduleId", "term", "updatedAt") SELECT "createdAt", "definition", "id", "imageUrl", "isStarred", "moduleId", "term", "updatedAt" FROM "Term";
DROP TABLE "Term";
ALTER TABLE "new_Term" RENAME TO "Term";
CREATE UNIQUE INDEX "Term_id_key" ON "Term"("id");
CREATE UNIQUE INDEX "Term_moduleId_key" ON "Term"("moduleId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
