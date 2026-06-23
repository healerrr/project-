CREATE TABLE "Project" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "websiteUrl" TEXT NOT NULL,
  "repositoryUrl" TEXT NOT NULL,
  "owner" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "accent" TEXT NOT NULL,
  "tags" TEXT NOT NULL DEFAULT '[]',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ProjectRuntime" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "environment" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "healthCheckType" TEXT NOT NULL,
  "healthCheckUrl" TEXT,
  "serverHost" TEXT NOT NULL,
  "serverOs" TEXT NOT NULL,
  "startMethod" TEXT NOT NULL,
  "startCommand" TEXT,
  "responseTime" INTEGER,
  "lastCheckedAt" DATETIME,
  "lastDeployAt" DATETIME,
  "remark" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectRuntime_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE UNIQUE INDEX "ProjectRuntime_projectId_environment_key" ON "ProjectRuntime"("projectId", "environment");
CREATE INDEX "ProjectRuntime_status_idx" ON "ProjectRuntime"("status");
CREATE INDEX "ProjectRuntime_environment_idx" ON "ProjectRuntime"("environment");
