// Simple in-memory data store for demo purposes
// In production, this would be replaced with a proper database

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
}

interface Student {
  id: number;
  name: string;
  email: string;
  assigned_classes: string;
  registration_date: string;
}

// Users store
export const users: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@saikalpataru.com',
    password: 'admin@sai123',
    role: 'admin'
  }
];

// Students store  
export const students: Student[] = [];

// User ID counter
export let userIdCounter = 2;

// Functions to manage users
export function addUser(user: User) {
  users.push(user);
}

export function getUserById(id: number) {
  return users.find(u => u.id === id);
}

export function getUserByEmail(email: string) {
  return users.find(u => u.email === email);
}

// Functions to manage students
export function addStudent(user: User) {
  const student: Student = {
    id: user.id,
    name: user.name,
    email: user.email,
    assigned_classes: '', // Empty by default
    registration_date: new Date().toISOString().split('T')[0]
  };
  students.push(student);
  return student;
}

export function getAllStudents() {
  return students;
}

export function getStudentById(id: number) {
  return students.find(s => s.id === id);
}

export function updateStudentAssignments(id: number, assignments: string) {
  const student = students.find(s => s.id === id);
  if (student) {
    student.assigned_classes = assignments;
    return student;
  }
  return null;
}

export function getNextUserId() {
  return userIdCounter++;
}
