-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TermModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "isStarred" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TermModel_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "ModuleModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TermModel" ("createdAt", "definition", "id", "imageUrl", "isStarred", "moduleId", "status", "term", "updatedAt") SELECT "createdAt", "definition", "id", "imageUrl", "isStarred", "moduleId", "status", "term", "updatedAt" FROM "TermModel";
DROP TABLE "TermModel";
ALTER TABLE "new_TermModel" RENAME TO "TermModel";
CREATE UNIQUE INDEX "TermModel_id_key" ON "TermModel"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
