export interface PgDataSource<TEntity> {
	create(createDto: any): Promise<TEntity>;
	delete(id: number): Promise<void>;
	getById(id: number): Promise<TEntity | null>;
	getAll(getAllDto: any): Promise<{ data: TEntity[]; total: number }>;
	edit(editDto: any): Promise<TEntity>;
}
