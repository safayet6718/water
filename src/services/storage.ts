import {
  User,
  CompanySettings,
  Product,
  Client,
  Supplier,
  QrBatch,
  JarQrCode,
  Delivery,
  ClientPayment,
  Supply,
  SupplierPayment,
  CashHandover,
  OrderRequest,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'aquatrack_users',
  CURRENT_USER_ID: 'aquatrack_current_user_id',
  SETTINGS: 'aquatrack_company_settings',
  PRODUCTS: 'aquatrack_products',
  CLIENTS: 'aquatrack_clients',
  SUPPLIERS: 'aquatrack_suppliers',
  QR_BATCHES: 'aquatrack_qr_batches',
  JAR_QRS: 'aquatrack_jar_qrs',
  DELIVERIES: 'aquatrack_deliveries',
  CLIENT_PAYMENTS: 'aquatrack_client_payments',
  SUPPLIES: 'aquatrack_supplies',
  SUPPLIER_PAYMENTS: 'aquatrack_supplier_payments',
  CASH_HANDOVERS: 'aquatrack_cash_handovers',
  ORDER_REQUESTS: 'aquatrack_order_requests',
  LANG: 'aquatrack_language',
  IS_AUTHENTICATED: 'aquatrack_is_authenticated',
};

export const defaultUsers: User[] = [
  {
    id: 'user-admin',
    name: 'Safayet Hossain (Malik)',
    phone: '01521311748',
    password: 'password123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    active: true,
    address: 'Plot 24, Road 7, Dhanmondi R/A, Dhaka',
    area: 'Dhanmondi',
  },
  {
    id: 'user-deliv-1',
    name: 'Rahim Mia (Rider 1)',
    phone: '01764996718',
    password: 'password123',
    role: 'delivery',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    active: true,
    address: 'Staff Quarter, Dhanmondi, Dhaka',
    area: 'Dhanmondi / Mohammadpur',
  },
  {
    id: 'user-deliv-2',
    name: 'Kamal Uddin (Rider 2)',
    phone: '01764996718',
    password: 'password123',
    role: 'delivery',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    active: true,
    address: 'Tejgaon, Dhaka',
    area: 'Gulshan / Banani',
  },
  {
    id: 'user-manager',
    name: 'Tanvir Ahmed (Accountant)',
    phone: '01521311748',
    password: 'password123',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    active: true,
    address: 'Mirpur DOHS, Dhaka',
    area: 'Accounts Dept.',
  },
  {
    id: 'user-cust-1',
    name: 'Dr. Mahbubur Rahman (Customer)',
    phone: '01712-334455',
    password: 'password123',
    role: 'customer',
    clientId: 'cl-1',
    address: 'House 42, Road 5, Dhanmondi',
    area: 'Dhanmondi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    active: true,
  },
  {
    id: 'user-cust-2',
    name: 'Green Valley IT Solutions (Customer)',
    phone: '01819-445566',
    password: 'password123',
    role: 'customer',
    clientId: 'cl-2',
    address: 'Level 4, Navana Tower, Gulshan 1',
    area: 'Gulshan 1',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    active: true,
  },
];

export const defaultSettings: CompanySettings = {
  name: 'AquaPure Mineral Water Ltd.',
  nameBn: 'আকুয়াপিউর মিনারেল ওয়াটার লিঃ',
  address: 'Plot 24, Road 7, Dhanmondi R/A, Dhaka-1205',
  phone: '01521311748, 01764996718',
  email: 'service@aquapurebd.com',
  logoUrl: '',
  tagline: 'বিশুদ্ধ পানির নিশ্চয়তা — 100% Tested Pure Water',
  currency: '৳',
  receiptFooter: 'বিল পরিশোধের জন্য ধন্যবাদ! যেকোনো অভিযোগ বা জরুরি অর্ডারে কল করুন: 01521311748, 01764996718',
  enableBkash: true,
  enableNagad: true,
  enableBank: true,
  enableCash: true,
};

export const defaultProducts: Product[] = [
  {
    id: 'prod-10L',
    name: '10 Liter Mineral Jar',
    size: '10L',
    volumeLiters: 10,
    defaultPrice: 50,
    active: true,
  },
  {
    id: 'prod-20L',
    name: '20 Liter Standard Jar',
    size: '20L',
    volumeLiters: 20,
    defaultPrice: 80,
    active: true,
  },
  {
    id: 'prod-30L',
    name: '30 Liter Commercial Jar',
    size: '30L',
    volumeLiters: 30,
    defaultPrice: 110,
    active: true,
  },
];

export const defaultClients: Client[] = [
  {
    id: 'cl-1',
    code: 'CL-101',
    name: 'Dr. Mahbubur Rahman',
    phone: '01712-334455',
    address: 'House 42, Road 5, Dhanmondi',
    area: 'Dhanmondi',
    openingDue: 0,
    currentDue: 160,
    active: true,
    notes: 'Takes two 20L jars every alternate day. Gate code 4321.',
    createdAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'cl-2',
    code: 'CL-102',
    name: 'Green Valley IT Solutions',
    phone: '01819-445566',
    address: 'Level 4, Navana Tower, Gulshan 1',
    area: 'Gulshan 1',
    openingDue: 0,
    currentDue: 0,
    active: true,
    notes: 'Corporate office. Special agreed price: 20L @ ৳70.',
    customPrices: {
      'prod-20L': 70,
    },
    createdAt: '2026-09-05T11:30:00.000Z',
  },
  {
    id: 'cl-3',
    code: 'CL-103',
    name: 'Farhana Yasmin',
    phone: '01912-778899',
    address: 'Flat 3B, Plot 12, Block D, Lalmatia',
    area: 'Lalmatia',
    openingDue: 80,
    currentDue: 240,
    active: true,
    notes: 'Pays monthly via bKash.',
    createdAt: '2026-09-10T14:15:00.000Z',
  },
  {
    id: 'cl-4',
    code: 'CL-104',
    name: 'Apex Trading & Logistics',
    phone: '01611-889900',
    address: 'Suit 702, Concord Tower, Panthapath',
    area: 'Panthapath',
    openingDue: 0,
    currentDue: 0,
    active: true,
    notes: 'Weekly 6x 20L Jars delivery.',
    createdAt: '2026-09-15T09:00:00.000Z',
  },
  {
    id: 'cl-5',
    code: 'CL-105',
    name: 'Kazi Shafikul Islam',
    phone: '01715-112233',
    address: 'House 18, Road 2, Block B, Mirpur 10',
    area: 'Mirpur 10',
    openingDue: 350,
    currentDue: 350,
    active: false, // Testing deactivated client block / warning!
    notes: 'Temporarily inactive / shifted flat.',
    createdAt: '2026-09-20T16:00:00.000Z',
  },
  {
    id: 'cl-6',
    code: 'CL-106',
    name: 'Cafe Bistro Express',
    phone: '01822-445566',
    address: 'Road 11, Banani, Dhaka',
    area: 'Banani',
    openingDue: 0,
    currentDue: 220,
    active: true,
    notes: 'Requires 30L commercial jars for espresso machine.',
    createdAt: '2026-10-01T12:00:00.000Z',
  },
];

export const defaultSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Padma Plastics & Polymers Ltd.',
    phone: '01711-998877',
    address: 'BSCIC Industrial Estate, Tongi, Gazipur',
    itemsSupplied: ['20L Polycarbonate Jars', '10L Dispensers', 'Dispenser Taps'],
    totalSupplied: 58000,
    totalPaid: 45000,
    currentDue: 13000,
    active: true,
    createdAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'sup-2',
    name: 'Bengal Caps & Seals Industries',
    phone: '01812-332211',
    address: 'Plot 55, Hazaribagh Tannery Area, Dhaka',
    itemsSupplied: ['55mm Non-Spill Caps', 'Heat Shrink Sleeves', 'Hygiene Seals'],
    totalSupplied: 24500,
    totalPaid: 24500,
    currentDue: 0,
    active: true,
    createdAt: '2026-08-20T11:00:00.000Z',
  },
  {
    id: 'sup-3',
    name: 'PureFilter Tech Bangladesh',
    phone: '01913-665544',
    address: '112/A Tejgaon Industrial Area, Dhaka',
    itemsSupplied: ['RO Membrane 4040', 'Sediment Cartridges', 'Carbon Blocks', 'UV Lamps'],
    totalSupplied: 76000,
    totalPaid: 60000,
    currentDue: 16000,
    active: true,
    createdAt: '2026-09-01T09:30:00.000Z',
  },
];

// Seed sample batches and QRs
const todayStr = '2026-10-13';
const batch1Id = 'batch-20261013-20L-1';
const batch2Id = 'batch-20261013-10L-1';

export const defaultBatches: QrBatch[] = [
  {
    id: batch1Id,
    batchNumber: 'BATCH-20261013-20L-01',
    date: todayStr,
    productId: 'prod-20L',
    quantity: 24,
    createdBy: 'user-admin',
    createdByName: 'Safayet Hossain (Malik)',
    createdAt: '2026-10-13T06:00:00.000Z',
  },
  {
    id: batch2Id,
    batchNumber: 'BATCH-20261013-10L-01',
    date: todayStr,
    productId: 'prod-10L',
    quantity: 12,
    createdBy: 'user-admin',
    createdByName: 'Safayet Hossain (Malik)',
    createdAt: '2026-10-13T06:30:00.000Z',
  },
];

// Generate Jar QR items
export const defaultJarQrs: JarQrCode[] = [];

// Batch 1 (20L)
for (let i = 1; i <= 24; i++) {
  const codeNum = String(i).padStart(4, '0');
  const code = `J-20261013-20L-${codeNum}`;
  // Let first 4 be delivered already for realistic history
  const isDelivered = i <= 4;
  defaultJarQrs.push({
    id: `qr-20L-${i}`,
    code,
    batchId: batch1Id,
    productId: 'prod-20L',
    status: isDelivered ? 'delivered' : 'unused',
    deliveryId: isDelivered ? (i <= 2 ? 'deliv-seed-1' : 'deliv-seed-2') : undefined,
    deliveredToClientId: isDelivered ? (i <= 2 ? 'cl-1' : 'cl-2') : undefined,
    deliveredAt: isDelivered ? '2026-10-13T09:30:00.000Z' : undefined,
    createdAt: '2026-10-13T06:00:00.000Z',
  });
}

// Batch 2 (10L)
for (let i = 1; i <= 12; i++) {
  const codeNum = String(i).padStart(4, '0');
  const code = `J-20261013-10L-${codeNum}`;
  defaultJarQrs.push({
    id: `qr-10L-${i}`,
    code,
    batchId: batch2Id,
    productId: 'prod-10L',
    status: 'unused',
    createdAt: '2026-10-13T06:30:00.000Z',
  });
}

export const defaultDeliveries: Delivery[] = [
  {
    id: 'deliv-seed-1',
    invoiceNo: 'INV-20261013-0001',
    clientId: 'cl-1',
    clientName: 'Dr. Mahbubur Rahman',
    clientPhone: '01712-334455',
    clientAddress: 'House 42, Road 5, Dhanmondi',
    deliveryManId: 'user-deliv-1',
    deliveryManName: 'Rahim Mia (Rider 1)',
    items: [
      {
        id: 'item-1',
        jarQrCode: 'J-20261013-20L-0001',
        productId: 'prod-20L',
        productName: '20 Liter Standard Jar',
        unitPrice: 80,
        volumeLiters: 20,
      },
      {
        id: 'item-2',
        jarQrCode: 'J-20261013-20L-0002',
        productId: 'prod-20L',
        productName: '20 Liter Standard Jar',
        unitPrice: 80,
        volumeLiters: 20,
      },
    ],
    itemCount: 2,
    totalLiters: 40,
    billAmount: 160,
    previousDue: 0,
    totalPayable: 160,
    paidAmount: 0,
    remainingDue: 160,
    paymentMethod: 'due',
    paymentStatus: 'due',
    emptyJarsReturned: 2,
    notes: 'Left at reception, bill kept pending',
    createdAt: '2026-10-13T09:15:00.000Z',
  },
  {
    id: 'deliv-seed-2',
    invoiceNo: 'INV-20261013-0002',
    clientId: 'cl-2',
    clientName: 'Green Valley IT Solutions',
    clientPhone: '01819-445566',
    clientAddress: 'Level 4, Navana Tower, Gulshan 1',
    deliveryManId: 'user-deliv-1',
    deliveryManName: 'Rahim Mia (Rider 1)',
    items: [
      {
        id: 'item-3',
        jarQrCode: 'J-20261013-20L-0003',
        productId: 'prod-20L',
        productName: '20 Liter Standard Jar',
        unitPrice: 70, // Custom corporate price
        volumeLiters: 20,
      },
      {
        id: 'item-4',
        jarQrCode: 'J-20261013-20L-0004',
        productId: 'prod-20L',
        productName: '20 Liter Standard Jar',
        unitPrice: 70,
        volumeLiters: 20,
      },
    ],
    itemCount: 2,
    totalLiters: 40,
    billAmount: 140,
    previousDue: 0,
    totalPayable: 140,
    paidAmount: 140,
    remainingDue: 0,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    trxId: 'BK9X245199A',
    emptyJarsReturned: 2,
    notes: 'Paid via bKash merchant QR',
    createdAt: '2026-10-13T10:45:00.000Z',
  },
  {
    id: 'deliv-seed-3',
    invoiceNo: 'INV-20261013-0003',
    clientId: 'cl-3',
    clientName: 'Farhana Yasmin',
    clientPhone: '01912-778899',
    clientAddress: 'Flat 3B, Plot 12, Block D, Lalmatia',
    deliveryManId: 'user-deliv-1',
    deliveryManName: 'Rahim Mia (Rider 1)',
    items: [
      {
        id: 'item-5',
        jarQrCode: 'J-20261013-20L-0005',
        productId: 'prod-20L',
        productName: '20 Liter Standard Jar',
        unitPrice: 80,
        volumeLiters: 20,
      },
      {
        id: 'item-6',
        jarQrCode: 'J-20261013-20L-0006',
        productId: 'prod-20L',
        productName: '20 Liter Standard Jar',
        unitPrice: 80,
        volumeLiters: 20,
      },
    ],
    itemCount: 2,
    totalLiters: 40,
    billAmount: 160,
    previousDue: 80,
    totalPayable: 240,
    paidAmount: 160,
    remainingDue: 80,
    paymentMethod: 'cash',
    paymentStatus: 'partial',
    emptyJarsReturned: 2,
    notes: 'Partial cash payment made at gate',
    createdAt: '2026-10-13T11:15:00.000Z',
  },
  {
    id: 'deliv-seed-4',
    invoiceNo: 'INV-20261013-0004',
    clientId: 'cl-4',
    clientName: 'Apex Trading & Logistics',
    clientPhone: '01611-889900',
    clientAddress: 'Suit 702, Concord Tower, Panthapath',
    deliveryManId: 'user-deliv-2',
    deliveryManName: 'Kamal Uddin (Rider 2)',
    items: [
      {
        id: 'item-7',
        jarQrCode: 'J-20261013-20L-0007',
        productId: 'prod-20L',
        productName: '20 Liter Standard Jar',
        unitPrice: 80,
        volumeLiters: 20,
      },
      {
        id: 'item-8',
        jarQrCode: 'J-20261013-20L-0008',
        productId: 'prod-20L',
        productName: '20 Liter Standard Jar',
        unitPrice: 80,
        volumeLiters: 20,
      },
    ],
    itemCount: 2,
    totalLiters: 40,
    billAmount: 160,
    previousDue: 0,
    totalPayable: 160,
    paidAmount: 160,
    remainingDue: 0,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    emptyJarsReturned: 2,
    notes: 'Cash received by security desk',
    createdAt: '2026-10-13T11:50:00.000Z',
  },
  {
    id: 'deliv-seed-5',
    invoiceNo: 'INV-20261013-0005',
    clientId: 'cl-6',
    clientName: 'Cafe Bistro Express',
    clientPhone: '01822-445566',
    clientAddress: 'Road 11, Banani, Dhaka',
    deliveryManId: 'user-deliv-1',
    deliveryManName: 'Rahim Mia (Rider 1)',
    items: [
      {
        id: 'item-9',
        jarQrCode: 'J-20261013-30L-0001',
        productId: 'prod-30L',
        productName: '30 Liter Commercial Jar',
        unitPrice: 110,
        volumeLiters: 30,
      },
      {
        id: 'item-10',
        jarQrCode: 'J-20261013-30L-0002',
        productId: 'prod-30L',
        productName: '30 Liter Commercial Jar',
        unitPrice: 110,
        volumeLiters: 30,
      },
    ],
    itemCount: 2,
    totalLiters: 60,
    billAmount: 220,
    previousDue: 0,
    totalPayable: 220,
    paidAmount: 220,
    remainingDue: 0,
    paymentMethod: 'nagad',
    paymentStatus: 'paid',
    trxId: 'NG8891024K',
    emptyJarsReturned: 2,
    notes: 'Commercial jar delivery for espresso machine',
    createdAt: '2026-10-13T12:30:00.000Z',
  },
];

export const defaultClientPayments: ClientPayment[] = [
  {
    id: 'cp-1',
    receiptNo: 'REC-20261012-001',
    clientId: 'cl-3',
    clientName: 'Farhana Yasmin',
    amount: 160,
    paymentMethod: 'bkash',
    trxId: 'BK8821990M',
    receivedById: 'user-deliv-1',
    receivedByName: 'Rahim Mia (Rider 1)',
    notes: 'Collected past month balance',
    date: '2026-10-12',
    createdAt: '2026-10-12T15:30:00.000Z',
  },
];

export const defaultSupplies: Supply[] = [
  {
    id: 'sup-bill-1',
    billNo: 'SUP-20261010-01',
    supplierId: 'sup-1',
    supplierName: 'Padma Plastics & Polymers Ltd.',
    date: '2026-10-10',
    items: [
      {
        id: 's-item-1',
        itemName: '20L Polycarbonate Jars (Virgin Grade)',
        quantity: 100,
        rate: 320,
        amount: 32000,
      },
    ],
    totalAmount: 32000,
    paidAmount: 20000,
    paymentMethod: 'bank',
    notes: 'Cheque No: 994821 City Bank',
    createdAt: '2026-10-10T11:00:00.000Z',
  },
];

export const defaultSupplierPayments: SupplierPayment[] = [
  {
    id: 'sp-pay-1',
    voucherNo: 'VOUCH-20261011-01',
    supplierId: 'sup-1',
    supplierName: 'Padma Plastics & Polymers Ltd.',
    amount: 15000,
    paymentMethod: 'bank',
    notes: 'Paid against previous month dues',
    date: '2026-10-11',
    createdAt: '2026-10-11T16:00:00.000Z',
  },
];

export const defaultCashHandovers: CashHandover[] = [
  {
    id: 'ch-1',
    deliveryManId: 'user-deliv-1',
    deliveryManName: 'Rahim Mia (Rider 1)',
    amount: 1200,
    date: '2026-10-12',
    status: 'accepted',
    acceptedBy: 'Safayet Hossain (Malik)',
    notes: 'End of day cash deposition',
  },
];

export const defaultOrderRequests: OrderRequest[] = [
  {
    id: 'ord-1',
    orderNo: 'ORD-20261013-001',
    clientId: 'cl-1',
    clientName: 'Dr. Mahbubur Rahman',
    clientPhone: '01712-334455',
    clientAddress: 'House 42, Road 5, Dhanmondi',
    clientArea: 'Dhanmondi',
    items: [
      {
        productId: 'prod-20L',
        productName: '20 Liter Standard Jar',
        quantity: 2,
        unitPrice: 80,
      },
    ],
    totalQuantity: 2,
    estimatedAmount: 160,
    status: 'pending',
    preferredDate: '2026-10-14',
    preferredTimeSlot: 'Morning (9 AM - 12 PM)',
    urgent: true,
    notes: 'Need urgently tomorrow morning. 2 empty jars ready.',
    createdAt: '2026-10-13T12:30:00.000Z',
    updatedAt: '2026-10-13T12:30:00.000Z',
  },
  {
    id: 'ord-2',
    orderNo: 'ORD-20261013-002',
    clientId: 'cl-2',
    clientName: 'Green Valley IT Solutions',
    clientPhone: '01819-445566',
    clientAddress: 'Level 4, Navana Tower, Gulshan 1',
    clientArea: 'Gulshan 1',
    items: [
      {
        productId: 'prod-20L',
        productName: '20 Liter Standard Jar',
        quantity: 4,
        unitPrice: 70,
      },
    ],
    totalQuantity: 4,
    estimatedAmount: 280,
    status: 'assigned',
    assignedDeliveryManId: 'user-deliv-1',
    assignedDeliveryManName: 'Rahim Mia (Rider 1)',
    preferredDate: '2026-10-14',
    preferredTimeSlot: 'Afternoon (2 PM - 5 PM)',
    urgent: false,
    notes: 'Deliver to office 4th floor reception.',
    createdAt: '2026-10-13T11:00:00.000Z',
    updatedAt: '2026-10-13T11:30:00.000Z',
  },
];

// Helper to safely read and write JSON to localStorage
class AppStorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }

  // Current user & authentication
  getUsers(): User[] {
    const list = this.getItem(STORAGE_KEYS.USERS, defaultUsers);
    let updated = false;
    const migrated = list.map((u) => {
      let changed = false;
      let user = { ...u };
      if (!user.password) {
        user.password = 'password123';
        changed = true;
      }
      if (user.id === 'user-admin' && user.phone !== '01521311748') {
        user.phone = '01521311748';
        changed = true;
      }
      if (user.id === 'user-deliv-1' && user.phone !== '01764996718') {
        user.phone = '01764996718';
        changed = true;
      }
      if (changed) updated = true;
      return user;
    });
    if (updated) {
      this.setItem(STORAGE_KEYS.USERS, migrated);
      return migrated;
    }
    return list;
  }
  setUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  getIsAuthenticated(): boolean {
    return this.getItem(STORAGE_KEYS.IS_AUTHENTICATED, false);
  }
  setIsAuthenticated(isAuth: boolean): void {
    this.setItem(STORAGE_KEYS.IS_AUTHENTICATED, isAuth);
  }

  getCurrentUserId(): string {
    return this.getItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-admin');
  }
  setCurrentUserId(id: string): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
  }

  // Language
  getLanguage(): 'en' | 'bn' {
    return this.getItem(STORAGE_KEYS.LANG, 'bn'); // default to Bangla for high local appeal
  }
  setLanguage(lang: 'en' | 'bn'): void {
    this.setItem(STORAGE_KEYS.LANG, lang);
  }

  // Settings
  getSettings(): CompanySettings {
    const s = this.getItem(STORAGE_KEYS.SETTINGS, defaultSettings);
    if (!s.phone || !s.phone.includes('01521311748') || !s.phone.includes('01764996718')) {
      const updated: CompanySettings = {
        ...s,
        phone: '01521311748, 01764996718',
        receiptFooter: 'বিল পরিশোধের জন্য ধন্যবাদ! যেকোনো অভিযোগ বা জরুরি অর্ডারে কল করুন: 01521311748, 01764996718',
      };
      this.setItem(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    }
    return s;
  }
  setSettings(settings: CompanySettings): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  // Products
  getProducts(): Product[] {
    return this.getItem(STORAGE_KEYS.PRODUCTS, defaultProducts);
  }
  setProducts(products: Product[]): void {
    this.setItem(STORAGE_KEYS.PRODUCTS, products);
  }

  // Clients
  getClients(): Client[] {
    return this.getItem(STORAGE_KEYS.CLIENTS, defaultClients);
  }
  setClients(clients: Client[]): void {
    this.setItem(STORAGE_KEYS.CLIENTS, clients);
  }

  // Suppliers
  getSuppliers(): Supplier[] {
    return this.getItem(STORAGE_KEYS.SUPPLIERS, defaultSuppliers);
  }
  setSuppliers(suppliers: Supplier[]): void {
    this.setItem(STORAGE_KEYS.SUPPLIERS, suppliers);
  }

  // QR Batches
  getQrBatches(): QrBatch[] {
    return this.getItem(STORAGE_KEYS.QR_BATCHES, defaultBatches);
  }
  setQrBatches(batches: QrBatch[]): void {
    this.setItem(STORAGE_KEYS.QR_BATCHES, batches);
  }

  // Jar QR codes
  getJarQrs(): JarQrCode[] {
    return this.getItem(STORAGE_KEYS.JAR_QRS, defaultJarQrs);
  }
  setJarQrs(qrs: JarQrCode[]): void {
    this.setItem(STORAGE_KEYS.JAR_QRS, qrs);
  }

  // Deliveries
  getDeliveries(): Delivery[] {
    const list = this.getItem(STORAGE_KEYS.DELIVERIES, defaultDeliveries);
    if (!list.some((d) => d.invoiceNo === 'INV-20261013-0005')) {
      const missing = defaultDeliveries.filter((d) => !list.some((existing) => existing.invoiceNo === d.invoiceNo));
      const combined = [...list, ...missing];
      this.setItem(STORAGE_KEYS.DELIVERIES, combined);
      return combined;
    }
    return list;
  }
  setDeliveries(deliveries: Delivery[]): void {
    this.setItem(STORAGE_KEYS.DELIVERIES, deliveries);
  }

  // Client Payments (Due collections)
  getClientPayments(): ClientPayment[] {
    return this.getItem(STORAGE_KEYS.CLIENT_PAYMENTS, defaultClientPayments);
  }
  setClientPayments(payments: ClientPayment[]): void {
    this.setItem(STORAGE_KEYS.CLIENT_PAYMENTS, payments);
  }

  // Supplies & Supplier Payments
  getSupplies(): Supply[] {
    return this.getItem(STORAGE_KEYS.SUPPLIES, defaultSupplies);
  }
  setSupplies(supplies: Supply[]): void {
    this.setItem(STORAGE_KEYS.SUPPLIES, supplies);
  }

  getSupplierPayments(): SupplierPayment[] {
    return this.getItem(STORAGE_KEYS.SUPPLIER_PAYMENTS, defaultSupplierPayments);
  }
  setSupplierPayments(payments: SupplierPayment[]): void {
    this.setItem(STORAGE_KEYS.SUPPLIER_PAYMENTS, payments);
  }

  // Cash Handovers
  getCashHandovers(): CashHandover[] {
    return this.getItem(STORAGE_KEYS.CASH_HANDOVERS, defaultCashHandovers);
  }
  setCashHandovers(handovers: CashHandover[]): void {
    this.setItem(STORAGE_KEYS.CASH_HANDOVERS, handovers);
  }

  // Order Requests
  getOrderRequests(): OrderRequest[] {
    return this.getItem(STORAGE_KEYS.ORDER_REQUESTS, defaultOrderRequests);
  }
  setOrderRequests(orders: OrderRequest[]): void {
    this.setItem(STORAGE_KEYS.ORDER_REQUESTS, orders);
  }

  // Reset to default seed
  resetAllData(): void {
    localStorage.clear();
    this.setItem(STORAGE_KEYS.USERS, defaultUsers);
    this.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-admin');
    this.setItem(STORAGE_KEYS.SETTINGS, defaultSettings);
    this.setItem(STORAGE_KEYS.PRODUCTS, defaultProducts);
    this.setItem(STORAGE_KEYS.CLIENTS, defaultClients);
    this.setItem(STORAGE_KEYS.SUPPLIERS, defaultSuppliers);
    this.setItem(STORAGE_KEYS.QR_BATCHES, defaultBatches);
    this.setItem(STORAGE_KEYS.JAR_QRS, defaultJarQrs);
    this.setItem(STORAGE_KEYS.DELIVERIES, defaultDeliveries);
    this.setItem(STORAGE_KEYS.CLIENT_PAYMENTS, defaultClientPayments);
    this.setItem(STORAGE_KEYS.SUPPLIES, defaultSupplies);
    this.setItem(STORAGE_KEYS.SUPPLIER_PAYMENTS, defaultSupplierPayments);
    this.setItem(STORAGE_KEYS.CASH_HANDOVERS, defaultCashHandovers);
    this.setItem(STORAGE_KEYS.ORDER_REQUESTS, defaultOrderRequests);
    this.setItem(STORAGE_KEYS.LANG, 'bn');
  }
}

export const storage = new AppStorageService();
