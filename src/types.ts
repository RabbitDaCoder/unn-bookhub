export type UserRole = "student" | "admin" | "librarian";
export type BookType =
  | "TEXTBOOK"
  | "WORKBOOK"
  | "NOVEL"
  | "JOURNAL"
  | "REFERENCE";
export type OrderStatus = "pending" | "completed" | "cancelled";
export type ComplaintStatus = "open" | "in_progress" | "resolved" | "closed";
export type Faculty =
  | "Sciences"
  | "Arts"
  | "Business"
  | "Engineering"
  | "Law"
  | "Medicine"
  | "Education"
  | "Social Sciences";

export interface User {
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  faculty?: string;
  department?: string;
  level?: string;
  photoURL?: string;
  isVerified?: boolean;
  borrowedBooks?: string[]; // Array of book IDs
  wishlist?: string[]; // Array of book IDs
  createdAt: any;
  updatedAt?: any;
  isActive?: boolean;
  cart?: CartItem[];
}

export interface Book {
  id: string;
  title: string;
  courseCode: string;
  department: string;
  faculty: Faculty | string;
  author: string;
  price: number;
  coverColor: string;
  description: string;
  edition: string;
  pages: number;
  inStock: boolean;
  featured: boolean;
  category: string;
  coverImage?: string;
  isbn?: string;
  type?: BookType;
  isELibraryAvailable?: boolean;
}

export interface CartItem extends Book {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
  paymentReference?: string;
  receiptId?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Complaint {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  description: string;
  category: string;
  priority?: string;
  status: ComplaintStatus;
  responses?: ComplaintResponse[];
  createdAt: any;
  updatedAt: any;
}

export interface ComplaintResponse {
  id: string;
  complaintId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  message: string;
  createdAt: any;
}

export type BorrowStatus = "active" | "expired" | "returned";

export interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  startDate: any;
  endDate: any;
  status: BorrowStatus;
  accessToken?: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface CartItem extends Book {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
  paymentReference?: string;
  receiptId?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Complaint {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  description: string;
  category: string;
  priority?: string;
  status: ComplaintStatus;
  responses?: ComplaintResponse[];
  createdAt: any;
  updatedAt: any;
}

export interface ComplaintResponse {
  id: string;
  complaintId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  message: string;
  createdAt: any;
}

export type BorrowStatus = "ACTIVE" | "EXPIRED" | "RETURNED";

export interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  startDate: any;
  endDate: any;
  status: BorrowStatus;
  accessToken?: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}
