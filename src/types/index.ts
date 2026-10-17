export type Role = 'admin' | 'delivery' | 'manager' | 'customer';

export interface User {
  id: string;
  name: string;
  phone: string;
  password?: string;
  role: Role;
  avatar?: string;
  active: boolean;
  clientId?: string; // If role === 'customer', points to their Client profile
  address?: string;
  area?: string;
}

export interface CompanySettings {
  name: string;
  nameBn: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  tagline: string;
  currency: string;
  receiptFooter: string;
  enableBkash: boolean;
  enableNagad: boolean;
  enableBank: boolean;
  enableCash: boolean;
}

export interface Product {
  id: string;
  name: string;
  size: string; // '10L' | '20L' | '30L' | string
  volumeLiters: number;
  defaultPrice: number;
  active: boolean;
}

export interface Client {
  id: string;
  code: string; // e.g., 'CL-101'
  name: string;
  phone: string;
  address: string;
  area: string; // e.g., 'Dhanmondi', 'Gulshan'
  photoUrl?: string;
  openingDue: number;
  currentDue: number;
  emptyJarsHolding?: number; // How many empty jars customer currently holds
  active: boolean;
  notes?: string;
  customPrices?: Record<string, number>; // productId -> custom price
  createdAt: string;
  deletedAt?: string | null;
}

export interface QrBatch {
  id: string;
  batchNumber: string; // e.g., 'BATCH-20261013-20L-01'
  date: string;
  productId: string;
  quantity: number;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface JarQrCode {
  id: string;
  code: string; // e.g. 'J-20261013-20L-0001'
  batchId: string;
  productId: string;
  status: 'unused' | 'delivered' | 'cancelled';
  deliveryId?: string;
  deliveredToClientId?: string;
  deliveredAt?: string;
  createdAt: string;
}

export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'bank' | 'due';
export type PaymentStatus = 'paid' | 'partial' | 'due';

export interface DeliveryItem {
  id: string;
  jarQrCode: string;
  productId: string;
  productName: string;
  unitPrice: number;
  volumeLiters: number;
}

export interface Delivery {
  id: string;
  invoiceNo: string; // e.g., 'INV-20261013-0042'
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  deliveryManId: string;
  deliveryManName: string;
  items: DeliveryItem[];
  itemCount: number;
  totalLiters: number;
  billAmount: number;
  previousDue: number;
  totalPayable: number;
  paidAmount: number;
  remainingDue: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  trxId?: string;
  emptyJarsReturned?: number;
  orderRequestId?: string; // Linked order if fulfilled from request
  notes?: string;
  createdAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderRequestItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderRequest {
  id: string;
  orderNo: string; // e.g. ORD-20261013-001
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  clientArea: string;
  items: OrderRequestItem[];
  totalQuantity: number;
  estimatedAmount: number;
  status: OrderStatus;
  assignedDeliveryManId?: string;
  assignedDeliveryManName?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  urgent?: boolean;
  notes?: string;
  deliveryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientPayment {
  id: string;
  receiptNo: string;
  clientId: string;
  clientName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  trxId?: string;
  receivedById: string;
  receivedByName: string;
  notes?: string;
  date: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  itemsSupplied: string[];
  photoUrl?: string;
  totalSupplied: number;
  totalPaid: number;
  currentDue: number;
  active: boolean;
  createdAt: string;
  deletedAt?: string | null;
}

export interface SupplyItem {
  id: string;
  itemName: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Supply {
  id: string;
  billNo: string;
  supplierId: string;
  supplierName: string;
  date: string;
  items: SupplyItem[];
  totalAmount: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface SupplierPayment {
  id: string;
  voucherNo: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  date: string;
  createdAt: string;
}

export interface CashHandover {
  id: string;
  deliveryManId: string;
  deliveryManName: string;
  amount: number;
  date: string;
  status: 'pending' | 'accepted';
  acceptedBy?: string;
  notes?: string;
}
