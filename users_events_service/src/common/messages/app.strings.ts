export const AppStrings = {
  USER_DISABLED: "Account disabled. Please contact support",
  INVALID_QUERY: "Invalid query, kindly check your query",
  UNSUPPORTED_ACTION: " Unsupported action ",
  FIELD_NOT_EXIST: (field) => `Invalid query, ${field} doesn't exist`,
  WRONG_DATA_FOR_FIELD: (field) =>
    `Invalid query, ${field} entry in query is wrong`,
  RESOURCE_NOT_FOUND: (name: string) => `${name} does not exist`,
  EXISTING_RESOURCE: (name: string) => `${name} already exist`,
  USER_CREATED: "Welcome aboard! Your registration was successful.",
  INVALID_EMAIL_OR_PASSWORD: "Invalid credentials",
  WRONG_REFRESH_TOKEN: 'Refresh Token is Wrong',
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Your task has been deleted',
};
