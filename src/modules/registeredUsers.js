// UserService.js
 
const STORAGE_KEY = "users";
 
// Helper: Get all users from localStorage

function getAllUsers() {

  const users = localStorage.getItem(STORAGE_KEY);

  return users ? JSON.parse(users) : [];

}
 
// Add a new user

export function addUser(newUser) {

  const users = getAllUsers();
 
  // Check if user already exists by phone

  const exists = users.find((user) => user.phone === newUser.phone);

  if (exists) {

    return { success: false, message: "رقم الهاتف مسجل بالفعل." };

  }
 
  users.push(newUser);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
 
  return { success: true, message: "تم التسجيل بنجاح." };

}
 
// Get a user by phone and password

export function getUser(phone, password) {

  const users = getAllUsers();

  return users.find(

    (user) => user.phone === phone && user.password === password

  );

}

 