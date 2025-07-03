export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  // Handle plain objects
  const clonedObj = {} as Record<string, any>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone((obj as Record<string, any>)[key]);
    }
  }

  return clonedObj as T;
}
