import { supabase } from "./lib/supabase";
import type {
  User,
  Order,
  Complaint,
  OrderStatus,
  ComplaintStatus,
} from "./types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Re-export supabase instance
export { supabase };

// Types for inputs
export interface OrderInput extends Omit<
  Order,
  "id" | "createdAt" | "updatedAt"
> {
  status?: OrderStatus;
}

export interface ComplaintInput extends Omit<
  Complaint,
  "id" | "createdAt" | "updatedAt"
> {
  status?: ComplaintStatus;
}

// Auth functions
export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function registerWithEmail(
  email: string,
  password: string,
  fullName: string,
  extra: Record<string, any> = {},
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
  if (error) throw new Error(error.message);

  // Save profile to users table
  if (data.user) {
    await supabase.from("users").upsert({
      id: data.user.id,
      full_name: fullName,
      email,
      role: "student",
      is_verified: false,
      ...extra,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  return data;
}

export async function logOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

// Alias
export { logOut as signOut };

// Auth state listener
export function onAuthChange(callback: (user: SupabaseUser | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => subscription.unsubscribe();
}

// User profile functions
export async function fetchUserProfile(uid: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", uid)
    .single();

  if (error || !data) {
    // Auto-create profile row if missing (e.g., registered before table existed)
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user && authData.user.id === uid) {
      const meta = authData.user.user_metadata || {};
      const newProfile = {
        id: uid,
        full_name: meta.full_name || authData.user.email?.split("@")[0] || "",
        email: authData.user.email || "",
        role: "student",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await supabase.from("users").upsert(newProfile, { onConflict: "id" });
      return {
        uid,
        fullName: newProfile.full_name,
        email: newProfile.email,
        role: "student",
        phone: "",
        faculty: "",
        department: "",
        level: "",
        photoURL: null,
        isVerified: false,
        isActive: true,
        createdAt: newProfile.created_at,
        updatedAt: newProfile.updated_at,
      } as User;
    }
    return null;
  }

  return {
    uid: data.id,
    fullName: data.full_name || "",
    email: data.email || "",
    role: data.role || "student",
    phone: data.phone || "",
    faculty: data.faculty || "",
    department: data.department || "",
    level: data.level || "",
    photoURL: data.photo_url || null,
    isVerified: data.is_verified || false,
    isActive: data.is_active ?? true,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as User;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<User>,
): Promise<void> {
  const mapped: Record<string, any> = { updated_at: new Date().toISOString() };
  if (data.fullName !== undefined) mapped.full_name = data.fullName;
  if (data.phone !== undefined) mapped.phone = data.phone;
  if (data.faculty !== undefined) mapped.faculty = data.faculty;
  if (data.department !== undefined) mapped.department = data.department;
  if (data.level !== undefined) mapped.level = data.level;
  if (data.photoURL !== undefined) mapped.photo_url = data.photoURL;
  if (data.role !== undefined) mapped.role = data.role;

  const { error } = await supabase.from("users").update(mapped).eq("id", uid);
  if (error) throw new Error(error.message);
}

// Aliases for backward compatibility
export { fetchUserProfile as getUserFromFirestore };
export { updateUserProfile as saveUserProfile };

// Cart cloud sync
export async function saveCartToCloud(uid: string, cartItems: any[]) {
  const { error } = await supabase
    .from("users")
    .update({ cart: cartItems })
    .eq("id", uid);
  if (error) console.error("Cart save failed:", error.message);
}

export async function loadCartFromCloud(uid: string): Promise<any[] | null> {
  const { data, error } = await supabase
    .from("users")
    .select("cart")
    .eq("id", uid)
    .single();
  if (error || !data) return null;
  return data.cart || null;
}

// Orders
export async function createOrder(orderData: OrderInput): Promise<string> {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: orderData.userId,
      items: orderData.items,
      total_amount: orderData.totalAmount,
      status: orderData.status || "pending",
      shipping_address: orderData.shippingAddress,
      payment_method: orderData.paymentMethod,
      payment_reference: orderData.paymentReference || null,
      receipt_id: orderData.receiptId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

export async function getUserOrders(uid: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    items: row.items || [],
    totalAmount: row.total_amount,
    status: row.status,
    shippingAddress: row.shipping_address,
    paymentMethod: row.payment_method,
    paymentReference: row.payment_reference,
    receiptId: row.receipt_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    items: data.items || [],
    totalAmount: data.total_amount,
    status: data.status,
    shippingAddress: data.shipping_address,
    paymentMethod: data.payment_method,
    paymentReference: data.payment_reference,
    receiptId: data.receipt_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Complaints
export async function createComplaint(data: ComplaintInput): Promise<string> {
  const { data: result, error } = await supabase
    .from("complaints")
    .insert({
      user_id: data.userId,
      user_email: data.userEmail,
      user_name: data.userName,
      subject: data.subject,
      description: data.description,
      category: data.category,
      priority: data.priority || null,
      status: data.status || "open",
      responses: data.responses || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return result.id;
}

export async function getUserComplaints(uid: string): Promise<Complaint[]> {
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    userEmail: row.user_email,
    userName: row.user_name,
    subject: row.subject,
    description: row.description,
    category: row.category,
    priority: row.priority,
    status: row.status,
    responses: row.responses || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getComplaintById(
  complaintId: string,
): Promise<Complaint | null> {
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .eq("id", complaintId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    userEmail: data.user_email,
    userName: data.user_name,
    subject: data.subject,
    description: data.description,
    category: data.category,
    priority: data.priority,
    status: data.status,
    responses: data.responses || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
