export default {
	createMockRepository: () => ({
		create: jest.fn(),
		delete: jest.fn(),
		getById: jest.fn(),
		getAll: jest.fn(),
		getByEmail: jest.fn(),
		edit: jest.fn()
	})
};
