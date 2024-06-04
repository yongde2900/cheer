import { validateInstance } from '../../../../utils/validateInstance';

export abstract class CoreDto<T> {
	validate(dto: T): void {
		validateInstance(dto);
	}
}
