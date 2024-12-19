export const AppStrings = {
  INVALID_QUERY: "Invalid query, kindly check your query",
  UNSUPPORTED_ACTION: " Unsupported action ",
  FIELD_NOT_EXIST: (field: string) => `Invalid query, ${field} doesn't exist`,
  WRONG_DATA_FOR_FIELD: (field: string) =>
    `Invalid query, ${field} entry in query is wrong`,
  RESOURCE_NOT_FOUND: (name: string) => `${name} does not exist`,
  EXISTING_RESOURCE: (name: string) => `${name} already exist`,
  USER_CREATED: "Welcome aboard! Your registration was successful.",
  INVALID_EMAIL_OR_PASSWORD: "Invalid credentials",
  WRONG_REFRESH_TOKEN: 'Refresh Token is Wrong',
  EVENT_CREATED: 'Event created successfully',
  JOIN_EVENT_REQUEST: 'Request sent successfully',
  REQUEST_EXIST: 'You already have a Request for this Event',
  FORBIDDEN_RESOURCE: 'Forbidden Resource',
  REQUEST_ACTION: (action: string) => `Event request ${action}`,
};
