BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Cliente] (
    [id_cliente] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    [telefono] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [direccion] NVARCHAR(1000),
    CONSTRAINT [Cliente_pkey] PRIMARY KEY CLUSTERED ([id_cliente]),
    CONSTRAINT [Cliente_telefono_key] UNIQUE NONCLUSTERED ([telefono]),
    CONSTRAINT [Cliente_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Vehiculo] (
    [id_vehiculo] INT NOT NULL IDENTITY(1,1),
    [id_cliente] INT NOT NULL,
    [marca] NVARCHAR(1000) NOT NULL,
    [modelo] NVARCHAR(1000) NOT NULL,
    [anio] INT NOT NULL,
    [patente] NVARCHAR(1000) NOT NULL,
    [descripcion] NVARCHAR(1000),
    CONSTRAINT [Vehiculo_pkey] PRIMARY KEY CLUSTERED ([id_vehiculo])
);

-- CreateTable
CREATE TABLE [dbo].[Tarea] (
    [id_tarea] INT NOT NULL IDENTITY(1,1),
    [id_cliente] INT NOT NULL,
    [id_empleado] INT NOT NULL,
    [id_vehiculo] INT NOT NULL,
    [id_tipo_tarea] INT NOT NULL,
    [fecha_hora] DATETIME2 NOT NULL,
    [estado] NVARCHAR(1000) NOT NULL,
    [descripcion] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Tarea_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Tarea_pkey] PRIMARY KEY CLUSTERED ([id_tarea])
);

-- CreateTable
CREATE TABLE [dbo].[TipoTarea] (
    [id_tipo_tarea] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [TipoTarea_pkey] PRIMARY KEY CLUSTERED ([id_tipo_tarea])
);

-- CreateTable
CREATE TABLE [dbo].[HistorialServicio] (
    [id_historial] INT NOT NULL IDENTITY(1,1),
    [id_tarea] INT NOT NULL,
    [id_cliente] INT NOT NULL,
    [costo] FLOAT(53) NOT NULL,
    [fecha] DATETIME2 NOT NULL,
    [detalle] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [HistorialServicio_pkey] PRIMARY KEY CLUSTERED ([id_historial])
);

-- CreateTable
CREATE TABLE [dbo].[Empleado] (
    [id_empleado] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    [rol] NVARCHAR(1000) NOT NULL,
    [telefono] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Empleado_pkey] PRIMARY KEY CLUSTERED ([id_empleado]),
    CONSTRAINT [Empleado_email_key] UNIQUE NONCLUSTERED ([email])
);

-- AddForeignKey
ALTER TABLE [dbo].[Vehiculo] ADD CONSTRAINT [Vehiculo_id_cliente_fkey] FOREIGN KEY ([id_cliente]) REFERENCES [dbo].[Cliente]([id_cliente]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Tarea] ADD CONSTRAINT [Tarea_id_cliente_fkey] FOREIGN KEY ([id_cliente]) REFERENCES [dbo].[Cliente]([id_cliente]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Tarea] ADD CONSTRAINT [Tarea_id_empleado_fkey] FOREIGN KEY ([id_empleado]) REFERENCES [dbo].[Empleado]([id_empleado]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tarea] ADD CONSTRAINT [Tarea_id_vehiculo_fkey] FOREIGN KEY ([id_vehiculo]) REFERENCES [dbo].[Vehiculo]([id_vehiculo]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tarea] ADD CONSTRAINT [Tarea_id_tipo_tarea_fkey] FOREIGN KEY ([id_tipo_tarea]) REFERENCES [dbo].[TipoTarea]([id_tipo_tarea]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HistorialServicio] ADD CONSTRAINT [HistorialServicio_id_tarea_fkey] FOREIGN KEY ([id_tarea]) REFERENCES [dbo].[Tarea]([id_tarea]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HistorialServicio] ADD CONSTRAINT [HistorialServicio_id_cliente_fkey] FOREIGN KEY ([id_cliente]) REFERENCES [dbo].[Cliente]([id_cliente]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
