import ApiError from "./error.js";


export const validateOnboardingData = (data) => {
  const errors = [];

  console.log("Validating onboarding data:", JSON.stringify(data, null, 2));

  if (
    !data.firstName ||
    typeof data.firstName !== "string" ||
    data.firstName.trim().length < 2
  ) {
    errors.push("First name must be at least 2 characters long");
  }

  if (
    !data.lastName ||
    typeof data.lastName !== "string" ||
    data.lastName.trim().length < 2
  ) {
    errors.push("Last name must be at least 2 characters long");
  }

  if (
    !data.username ||
    typeof data.username !== "string" ||
    data.username.trim().length < 3
  ) {
    errors.push("Username must be at least 3 characters long");
  }

  if (
    data.username &&
    typeof data.username === "string" &&
    !/^[a-zA-Z0-9_]+$/.test(data.username)
  ) {
    errors.push("Username can only contain letters, numbers, and underscores");
  }


  const arrayFields = [
    "travelStyle",
    "budgetRange",
    "groupSize",
    "tripDuration",
    "travelFrequency",
    "accommodationType",
    "transportationPreference",
  ];

  arrayFields.forEach((field) => {
    if (
      data[field] !== undefined &&
      data[field] !== null &&
      !Array.isArray(data[field])
    ) {
      errors.push(`${field} must be an array`);
    }
  });

  const textFields = {
    hometown: 100,
  };

  Object.entries(textFields).forEach(([field, maxLength]) => {
    if (
      data[field] &&
      typeof data[field] === "string" &&
      data[field].length > maxLength
    ) {
      errors.push(`${field} must be ${maxLength} characters or less`);
    }
  });

  if (errors.length > 0) {
    console.log("Validation errors:", errors);
    throw new ApiError(400, "Validation failed", errors);
  }

  return true;
};


export const sanitizeOnboardingData = (data) => {
  console.log("Sanitizing raw data:", JSON.stringify(data, null, 2));

  const sanitized = { ...data };

  const stringFields = [
    "firstName",
    "lastName",
    "username",
    "hometown",
  ];

  stringFields.forEach((field) => {
    if (sanitized[field] && typeof sanitized[field] === "string") {
      sanitized[field] = sanitized[field].trim();
    } else if (sanitized[field] === undefined || sanitized[field] === null) {
      sanitized[field] = "";
    }
  });

  const arrayFields = [
    "travelStyle",
    "budgetRange",
    "groupSize",
    "tripDuration",
    "travelFrequency",
    "accommodationType",
    "transportationPreference",
  ];

  arrayFields.forEach((field) => {
    if (sanitized[field]) {
      if (Array.isArray(sanitized[field])) {
        sanitized[field] = sanitized[field].filter(
          (item) => item && typeof item === "string" && item.trim().length > 0
        );
      } else {
        sanitized[field] = [];
      }
    } else {
      sanitized[field] = [];
    }
  });

  console.log("Sanitized data:", JSON.stringify(sanitized, null, 2));
  return sanitized;
};
