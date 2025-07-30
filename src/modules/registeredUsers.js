// UserService.js

const STORAGE_KEY = "users";

// Helper: Get all users from localStorage
export function getAllUsers() {
  const users = localStorage.getItem(STORAGE_KEY);
  return users ? JSON.parse(users) : [];
}

// Update or add a user
export function addUser(newUser) {
  const users = getAllUsers();

  // Check if user already exists by phone and national_id
  const userIndex = users.findIndex(
    (user) => user.phone === newUser.phone && user.national_id === newUser.national_id
  );

  if (userIndex !== -1) {
    // Update existing user
    users[userIndex] = { ...users[userIndex], ...newUser };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return { success: true, message: "تم تحديث البيانات بنجاح." };
  } else {
    // Add new user if not found
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return { success: true, message: "تم التسجيل بنجاح." };
  }
}

// Get a user by phone and password
export function getUser(phone, password) {
  const users = getAllUsers();
  return users.find(
    (user) => user.phone === phone && user.password === password
  );
}