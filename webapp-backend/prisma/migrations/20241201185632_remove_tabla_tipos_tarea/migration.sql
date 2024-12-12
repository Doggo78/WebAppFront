/*
  Warnings:

  - You are about to drop the column `id_tipo_tarea` on the `Tarea` table. All the data in the column will be lost.
  - You are about to drop the `TipoTarea` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Tarea] DROP CONSTRAINT [Tarea_id_tipo_tarea_fkey];

-- AlterTable
ALTER TABLE [dbo].[Tarea] DROP COLUMN [id_tipo_tarea];

-- DropTable
DROP TABLE [dbo].[TipoTarea];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
