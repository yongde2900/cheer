import { validateInstance } from "../../../../utils/validateInstance";

export  class CoreDto<T> {
	validate(dto: T): void {
    validateInstance(dto);
  }
}
