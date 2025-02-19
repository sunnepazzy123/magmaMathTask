import { IsOptional } from 'class-validator';

// Define the generic type constraint to ensure we only work with classes
export const PartialDto = <T extends { new (...args: any[]): object }>(
  classType: T,
) => {
  // Create a new class that extends the original class and overrides the prototype
  class PartialClass extends classType {
    constructor(...args: any[]) {
      super(...args);
      Object.keys(classType.prototype).forEach((key) => {
        // Apply the @IsOptional() decorator to each property dynamically
        IsOptional()(this, key);
      });
    }
  }
  return PartialClass;
};
