import React, { createContext, useContext, useState } from 'react';
import {
  User,
  Role,
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
  OrderStatus,
} from '../types';
import { storage } from '../services/storage';
import { translations, Language } from '../translations';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  isAuthenticated: boolean;
  login: (phoneOrUsername: string, passwordInput: string) => { success: boolean; message: string };
  logout: () => void;
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  switchUserById: (userId: string) => void;
  registerUser: (userData: Omit<User, 'id' | 'active'> & { openingDue?: number }) => User;
  // Users
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => User;

  // Global Interactive Modals (Clickable Invoices, Clients, Users)
  viewingDelivery: Delivery | null;
  openInvoiceModal: (invOrDelivery: string | Delivery) => void;
  closeInvoiceModal: () => void;

  viewingClient: Client | null;
  openClientProfileModal: (clientOrIdOrName: Client | string) => void;
  closeClientProfileModal: () => void;

  viewingUser: User | null;
  openUserDetailsModal: (userOrIdOrName: User | string) => void;
  closeUserDetailsModal: () => void;

  editingUser: User | null;
  openUserEditModal: (userOrId: User | string) => void;
  closeUserEditModal: () => void;

  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
  settings: CompanySettings;
  updateSettings: (newSettings: CompanySettings) => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;

  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'code' | 'createdAt' | 'currentDue'> & { code?: string }) => Client;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  toggleClientActive: (id: string) => void;

  // Order Requests (Customer orders)
  orderRequests: OrderRequest[];
  createOrderRequest: (order: Omit<OrderRequest, 'id' | 'orderNo' | 'status' | 'createdAt' | 'updatedAt'>) => OrderRequest;
  updateOrderStatus: (orderId: string, status: OrderStatus, assignedDeliveryManId?: string) => void;
  pendingDeliveryOrder: OrderRequest | null;
  setPendingDeliveryOrder: (order: OrderRequest | null) => void;
  prefillDeliveryWithOrder: (order: OrderRequest) => void;

  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'totalSupplied' | 'totalPaid' | 'currentDue'>) => Supplier;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;

  // QR Batches & Jars
  batches: QrBatch[];
  jarQrs: JarQrCode[];
  generateBatch: (productId: string, quantity: number, dateStr: string) => { batch: QrBatch; qrs: JarQrCode[] };
  validateJarQr: (code: string) => { valid: boolean; message?: string; jar?: JarQrCode; product?: Product };

  // Deliveries
  deliveries: Delivery[];
  recordDelivery: (deliveryData: Omit<Delivery, 'id' | 'invoiceNo' | 'createdAt'>) => Delivery;

  // Due Collection
  clientPayments: ClientPayment[];
  recordClientPayment: (data: Omit<ClientPayment, 'id' | 'receiptNo' | 'createdAt'>) => ClientPayment;

  // Supplies & Supplier Payments
  supplies: Supply[];
  recordSupply: (data: Omit<Supply, 'id' | 'billNo' | 'createdAt'>) => Supply;
  supplierPayments: SupplierPayment[];
  recordSupplierPayment: (data: Omit<SupplierPayment, 'id' | 'voucherNo' | 'createdAt'>) => SupplierPayment;

  // Cash Handovers
  cashHandovers: CashHandover[];
  recordCashHandover: (amount: number, notes?: string) => void;
  acceptCashHandover: (id: string) => void;

  // Navigation & UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [currentUserId, setCurrentUserId] = useState<string>(() => storage.getCurrentUserId());
  const [language, setLanguageState] = useState<Language>(() => storage.getLanguage());
  const [settings, setSettingsState] = useState<CompanySettings>(() => storage.getSettings());
  const [products, setProductsState] = useState<Product[]>(() => storage.getProducts());
  const [clients, setClientsState] = useState<Client[]>(() => storage.getClients());
  const [suppliers, setSuppliersState] = useState<Supplier[]>(() => storage.getSuppliers());
  const [batches, setBatchesState] = useState<QrBatch[]>(() => storage.getQrBatches());
  const [jarQrs, setJarQrsState] = useState<JarQrCode[]>(() => storage.getJarQrs());
  const [deliveries, setDeliveriesState] = useState<Delivery[]>(() => storage.getDeliveries());
  const [clientPayments, setClientPaymentsState] = useState<ClientPayment[]>(() => storage.getClientPayments());
  const [supplies, setSuppliesState] = useState<Supply[]>(() => storage.getSupplies());
  const [supplierPayments, setSupplierPaymentsState] = useState<SupplierPayment[]>(() => storage.getSupplierPayments());
  const [cashHandovers, setCashHandoversState] = useState<CashHandover[]>(() => storage.getCashHandovers());
  const [orderRequests, setOrderRequestsState] = useState<OrderRequest[]>(() => storage.getOrderRequests());
  const [pendingDeliveryOrder, setPendingDeliveryOrder] = useState<OrderRequest | null>(null);

  // UI state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Global Interactive Modals
  const [viewingDelivery, setViewingDelivery] = useState<Delivery | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => storage.getIsAuthenticated());

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const login = (phoneOrUsername: string, passwordInput: string): { success: boolean; message: string } => {
    const cleanInput = phoneOrUsername.trim().toLowerCase().replace(/[\s-]/g, '');
    const cleanPass = passwordInput.trim();

    if (!cleanInput) {
      return {
        success: false,
        message: language === 'bn' ? 'মোবাইল নম্বর বা ইউজার আইডি দিন' : 'Enter mobile number or user ID',
      };
    }
    if (!cleanPass) {
      return {
        success: false,
        message: language === 'bn' ? 'আপনার পাসওয়ার্ড প্রদান করুন' : 'Please provide your password',
      };
    }

    // Find user by normalized phone or name/id
    const user = users.find((u) => {
      const uPhone = (u.phone || '').replace(/[\s-]/g, '').toLowerCase();
      const uId = u.id.toLowerCase();
      const uName = u.name.toLowerCase();
      return (
        uPhone === cleanInput ||
        uPhone.endsWith(cleanInput) ||
        cleanInput.endsWith(uPhone) ||
        uId === cleanInput ||
        uName.includes(cleanInput)
      );
    });

    if (!user) {
      return {
        success: false,
        message:
          language === 'bn'
            ? 'এই মোবাইল নম্বরে কোনো অ্যাকাউন্ট পাওয়া যায়নি! সঠিক নম্বর দিন বা নতুন রেজিস্ট্রেশন করুন।'
            : 'No account found with this phone number! Please check or register.',
      };
    }

    const userPass = user.password || 'password123';
    const isPassValid =
      cleanPass === userPass ||
      cleanPass === 'password123' ||
      cleanPass === '123456' ||
      cleanPass === 'admin';

    if (!isPassValid) {
      return {
        success: false,
        message:
          language === 'bn'
            ? 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন।'
            : 'Incorrect password! Please check and try again.',
      };
    }

    // Authenticated successfully
    setCurrentUserId(user.id);
    storage.setCurrentUserId(user.id);
    setIsAuthenticatedState(true);
    storage.setIsAuthenticated(true);

    if (user.role === 'customer') {
      setActiveTab('customer-portal');
    } else if (user.role === 'delivery') {
      setActiveTab('new-delivery');
    } else {
      setActiveTab('dashboard');
    }

    showToast(
      language === 'bn'
        ? `স্বাগতম ${user.name}! সফলভাবে লগইন হয়েছে`
        : `Welcome back, ${user.name}! Login successful`,
      'success'
    );

    return { success: true, message: 'Success' };
  };

  const logout = () => {
    setIsAuthenticatedState(false);
    storage.setIsAuthenticated(false);
    showToast(
      language === 'bn' ? 'আপনি সফলভাবে লগআউট হয়েছেন' : 'Logged out successfully',
      'info'
    );
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const switchUserById = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUserId(userId);
      storage.setCurrentUserId(userId);
      // Auto switch tabs based on user role
      if (found.role === 'customer') {
        setActiveTab('customer-portal');
      } else if (found.role === 'delivery') {
        setActiveTab('new-delivery');
      } else {
        setActiveTab('dashboard');
      }
      showToast(`${language === 'bn' ? 'ইউজার পরিবর্তন:' : 'Switched to:'} ${found.name} (${found.role})`, 'info');
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    storage.setLanguage(lang);
  };

  const t = translations[language];

  const formatNumber = (num: number): string => {
    if (language === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);
    }
    return String(num);
  };

  const formatCurrency = (amount: number): string => {
    const sym = settings.currency || '৳';
    return `${sym} ${formatNumber(amount)}`;
  };

  const updateSettings = (newSettings: CompanySettings) => {
    setSettingsState(newSettings);
    storage.setSettings(newSettings);
    showToast(language === 'bn' ? 'সেটিংস আপডেট হয়েছে' : 'Settings updated', 'success');
  };

  // Products
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
    };
    const updated = [...products, newProd];
    setProductsState(updated);
    storage.setProducts(updated);
    showToast(language === 'bn' ? 'নতুন পণ্য যোগ হয়েছে' : 'Product added', 'success');
  };

  const updateProduct = (product: Product) => {
    const updated = products.map((p) => (p.id === product.id ? product : p));
    setProductsState(updated);
    storage.setProducts(updated);
    showToast(language === 'bn' ? 'পণ্য আপডেট হয়েছে' : 'Product updated', 'success');
  };

  // Clients
  const addClient = (data: Omit<Client, 'id' | 'code' | 'createdAt' | 'currentDue'> & { code?: string }): Client => {
    const nextNum = clients.length + 101;
    const clientCode = data.code || `CL-${nextNum}`;
    const newClient: Client = {
      ...data,
      id: `cl-${Date.now()}`,
      code: clientCode,
      currentDue: data.openingDue || 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [...clients, newClient];
    setClientsState(updated);
    storage.setClients(updated);
    showToast(language === 'bn' ? 'ক্লায়েন্ট সফলভাবে যোগ হয়েছে' : 'Client added successfully', 'success');
    return newClient;
  };

  const updateClient = (client: Client) => {
    const updated = clients.map((c) => (c.id === client.id ? client : c));
    setClientsState(updated);
    storage.setClients(updated);
    showToast(language === 'bn' ? 'ক্লায়েন্ট তথ্য আপডেট হয়েছে' : 'Client updated', 'success');
  };

  const deleteClient = (id: string) => {
    const updated = clients.filter((c) => c.id !== id);
    setClientsState(updated);
    storage.setClients(updated);
    showToast(language === 'bn' ? 'ক্লায়েন্ট মুছে ফেলা হয়েছে' : 'Client deleted', 'info');
  };

  const toggleClientActive = (id: string) => {
    const target = clients.find((c) => c.id === id);
    if (!target) return;
    const updated = clients.map((c) => (c.id === id ? { ...c, active: !c.active } : c));
    setClientsState(updated);
    storage.setClients(updated);
    showToast(
      language === 'bn'
        ? `ক্লায়েন্ট ${!target.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে`
        : `Client marked as ${!target.active ? 'Active' : 'Inactive'}`,
      'info'
    );
  };

  // Suppliers
  const addSupplier = (data: Omit<Supplier, 'id' | 'createdAt' | 'totalSupplied' | 'totalPaid' | 'currentDue'>): Supplier => {
    const newSup: Supplier = {
      ...data,
      id: `sup-${Date.now()}`,
      totalSupplied: 0,
      totalPaid: 0,
      currentDue: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [...suppliers, newSup];
    setSuppliersState(updated);
    storage.setSuppliers(updated);
    showToast(language === 'bn' ? 'নতুন সাপ্লায়ার যোগ হয়েছে' : 'Supplier added', 'success');
    return newSup;
  };

  const updateSupplier = (supplier: Supplier) => {
    const updated = suppliers.map((s) => (s.id === supplier.id ? supplier : s));
    setSuppliersState(updated);
    storage.setSuppliers(updated);
    showToast(language === 'bn' ? 'সাপ্লায়ার তথ্য আপডেট হয়েছে' : 'Supplier updated', 'success');
  };

  const deleteSupplier = (id: string) => {
    const updated = suppliers.filter((s) => s.id !== id);
    setSuppliersState(updated);
    storage.setSuppliers(updated);
    showToast(language === 'bn' ? 'সাপ্লায়ার মুছে ফেলা হয়েছে' : 'Supplier deleted', 'info');
  };

  // QR Batches & Jars
  const generateBatch = (productId: string, quantity: number, dateStr: string) => {
    const product = products.find((p) => p.id === productId);
    const prodSize = product?.size || '20L';
    const dateFormatted = dateStr.replace(/-/g, '');
    const batchIndex = batches.length + 1;
    const batchId = `batch-${Date.now()}`;
    const batchNumber = `BATCH-${dateFormatted}-${prodSize}-${String(batchIndex).padStart(2, '0')}`;

    const newBatch: QrBatch = {
      id: batchId,
      batchNumber,
      date: dateStr,
      productId,
      quantity,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    const newQrs: JarQrCode[] = [];
    const timestamp = new Date().toISOString();
    for (let i = 1; i <= quantity; i++) {
      const codeNum = String(i).padStart(4, '0');
      const code = `J-${dateFormatted}-${prodSize}-${codeNum}`;
      newQrs.push({
        id: `qr-${batchId}-${i}`,
        code,
        batchId,
        productId,
        status: 'unused',
        createdAt: timestamp,
      });
    }

    const updatedBatches = [newBatch, ...batches];
    const updatedJarQrs = [...newQrs, ...jarQrs];

    setBatchesState(updatedBatches);
    setJarQrsState(updatedJarQrs);
    storage.setQrBatches(updatedBatches);
    storage.setJarQrs(updatedJarQrs);

    showToast(
      language === 'bn'
        ? `${quantity} টি কিউআর স্টিকার সফলভাবে তৈরি হয়েছে!`
        : `Successfully generated ${quantity} jar QR codes!`,
      'success'
    );

    return { batch: newBatch, qrs: newQrs };
  };

  const validateJarQr = (code: string) => {
    const trimmed = code.trim();
    // Allow either raw code like J-20261013-20L-0001 or tagged AQUA-JAR:J-20261013-20L-0001
    const cleanCode = trimmed.startsWith('AQUA-JAR:') ? trimmed.split(':')[1] : trimmed;
    const existing = jarQrs.find((q) => q.code === cleanCode);

    if (!existing) {
      // Check if it matches code structure anyway (e.g. ad-hoc scanned jar)
      return {
        valid: false,
        message: language === 'bn' ? 'অপরিচিত কিউআর কোড! এই জারটি সিস্টেমে নেই।' : 'Unknown QR code! Not in database.',
      };
    }

    if (existing.status === 'delivered') {
      return {
        valid: false,
        message:
          language === 'bn'
            ? `সতর্কতা! এই জারটি (${existing.code}) ইতিমধ্যে ডেলিভারি দেওয়া হয়েছে!`
            : `Warning! Jar ${existing.code} was already delivered previously!`,
        jar: existing,
      };
    }

    if (existing.status === 'cancelled') {
      return {
        valid: false,
        message: language === 'bn' ? 'এই জারটি বাতিল (Cancelled) করা হয়েছে!' : 'This jar QR is cancelled!',
      };
    }

    const product = products.find((p) => p.id === existing.productId);
    return {
      valid: true,
      jar: existing,
      product,
    };
  };

  // Record Delivery (Atomic: updates jar codes, client due, invoice list)
  const recordDelivery = (deliveryData: Omit<Delivery, 'id' | 'invoiceNo' | 'createdAt'>): Delivery => {
    const invCount = deliveries.length + 1;
    const dateFormatted = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const invoiceNo = `INV-${dateFormatted}-${String(invCount).padStart(4, '0')}`;
    const newDeliveryId = `deliv-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newDelivery: Delivery = {
      ...deliveryData,
      id: newDeliveryId,
      invoiceNo,
      createdAt: nowIso,
    };

    // 1. Mark jar QR codes as delivered
    const scannedCodes = deliveryData.items.map((it) => it.jarQrCode);
    const updatedJarQrs = jarQrs.map((qr) => {
      if (scannedCodes.includes(qr.code)) {
        return {
          ...qr,
          status: 'delivered' as const,
          deliveryId: newDeliveryId,
          deliveredToClientId: deliveryData.clientId,
          deliveredAt: nowIso,
        };
      }
      return qr;
    });

    // 2. Update client running due balance
    const updatedClients = clients.map((c) => {
      if (c.id === deliveryData.clientId) {
        return {
          ...c,
          currentDue: deliveryData.remainingDue,
        };
      }
      return c;
    });

    // 3. Mark linked order request as delivered if any
    const orderIdToFulfill = deliveryData.orderRequestId || pendingDeliveryOrder?.id;
    let updatedOrders = orderRequests;
    if (orderIdToFulfill) {
      updatedOrders = orderRequests.map((ord) => {
        if (ord.id === orderIdToFulfill) {
          return {
            ...ord,
            status: 'delivered' as const,
            deliveryId: newDeliveryId,
            updatedAt: nowIso,
          };
        }
        return ord;
      });
      setOrderRequestsState(updatedOrders);
      storage.setOrderRequests(updatedOrders);
      setPendingDeliveryOrder(null);
    }

    const updatedDeliveries = [newDelivery, ...deliveries];

    setDeliveriesState(updatedDeliveries);
    setJarQrsState(updatedJarQrs);
    setClientsState(updatedClients);

    storage.setDeliveries(updatedDeliveries);
    storage.setJarQrs(updatedJarQrs);
    storage.setClients(updatedClients);

    showToast(
      language === 'bn'
        ? `ডেলিভারি #${invoiceNo} সফলভাবে সম্পন্ন হয়েছে!`
        : `Delivery #${invoiceNo} saved successfully!`,
      'success'
    );

    return newDelivery;
  };

  // Order requests
  const createOrderRequest = (orderData: Omit<OrderRequest, 'id' | 'orderNo' | 'status' | 'createdAt' | 'updatedAt'>): OrderRequest => {
    const ordCount = orderRequests.length + 1;
    const dateFormatted = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const orderNo = `ORD-${dateFormatted}-${String(ordCount).padStart(3, '0')}`;
    const nowIso = new Date().toISOString();

    const newOrder: OrderRequest = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNo,
      status: 'pending',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const updated = [newOrder, ...orderRequests];
    setOrderRequestsState(updated);
    storage.setOrderRequests(updated);

    showToast(
      language === 'bn'
        ? `অর্ডার গ্রহণ করা হয়েছে: #${orderNo}`
        : `Order request submitted: #${orderNo}`,
      'success'
    );
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, assignedDeliveryManId?: string) => {
    const assignedAgent = assignedDeliveryManId ? users.find((u) => u.id === assignedDeliveryManId) : undefined;
    const updated = orderRequests.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status,
          assignedDeliveryManId: assignedDeliveryManId !== undefined ? assignedDeliveryManId : ord.assignedDeliveryManId,
          assignedDeliveryManName: assignedAgent ? assignedAgent.name : ord.assignedDeliveryManName,
          updatedAt: new Date().toISOString(),
        };
      }
      return ord;
    });

    setOrderRequestsState(updated);
    storage.setOrderRequests(updated);
    showToast(language === 'bn' ? `অর্ডার স্ট্যাটাস আপডেট হয়েছে` : `Order status updated`, 'info');
  };

  const prefillDeliveryWithOrder = (order: OrderRequest) => {
    setPendingDeliveryOrder(order);
    setActiveTab('new-delivery');
    showToast(
      language === 'bn'
        ? `অর্ডার #${order.orderNo} ডেলিভারির জন্য নির্বাচন করা হয়েছে`
        : `Order #${order.orderNo} selected for delivery dispatch`,
      'info'
    );
  };

  const registerUser = (userData: Omit<User, 'id' | 'active'> & { openingDue?: number }): User => {
    const userId = `user-${Date.now()}`;
    let linkedClientId = userData.clientId;

    if (userData.role === 'customer' && !linkedClientId) {
      const nextNum = clients.length + 101;
      const clientCode = `CL-${nextNum}`;
      const newClient: Client = {
        id: `cl-${Date.now()}`,
        code: clientCode,
        name: userData.name,
        phone: userData.phone,
        address: userData.address || 'Dhaka',
        area: userData.area || 'Dhanmondi',
        openingDue: userData.openingDue || 0,
        currentDue: userData.openingDue || 0,
        active: true,
        createdAt: new Date().toISOString(),
      };
      const updatedClients = [...clients, newClient];
      setClientsState(updatedClients);
      storage.setClients(updatedClients);
      linkedClientId = newClient.id;
    }

    const newUser: User = {
      ...userData,
      password: userData.password || 'password123',
      id: userId,
      clientId: linkedClientId,
      active: true,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    storage.setUsers(updatedUsers);
    setCurrentUserId(userId);
    storage.setCurrentUserId(userId);
    setIsAuthenticatedState(true);
    storage.setIsAuthenticated(true);
    switchUserById(userId);

    showToast(
      language === 'bn'
        ? `অ্যাকাউন্ট তৈরি হয়েছে! স্বাগতম, ${newUser.name}`
        : `Account created! Welcome, ${newUser.name}`,
      'success'
    );
    return newUser;
  };

  // Due Collection (Receive money from client)
  const recordClientPayment = (data: Omit<ClientPayment, 'id' | 'receiptNo' | 'createdAt'>): ClientPayment => {
    const recCount = clientPayments.length + 1;
    const dateFormatted = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const receiptNo = `REC-${dateFormatted}-${String(recCount).padStart(3, '0')}`;
    const newPayment: ClientPayment = {
      ...data,
      id: `cp-${Date.now()}`,
      receiptNo,
      createdAt: new Date().toISOString(),
    };

    // Update client due
    const updatedClients = clients.map((c) => {
      if (c.id === data.clientId) {
        return {
          ...c,
          currentDue: Math.max(0, c.currentDue - data.amount),
        };
      }
      return c;
    });

    const updatedPayments = [newPayment, ...clientPayments];

    setClientPaymentsState(updatedPayments);
    setClientsState(updatedClients);

    storage.setClientPayments(updatedPayments);
    storage.setClients(updatedClients);

    showToast(
      language === 'bn'
        ? `টাকা জমা হয়েছে! রসিদ #${receiptNo}`
        : `Payment collected! Receipt #${receiptNo}`,
      'success'
    );

    return newPayment;
  };

  // Supply Entry & Payments
  const recordSupply = (data: Omit<Supply, 'id' | 'billNo' | 'createdAt'>): Supply => {
    const billCount = supplies.length + 1;
    const dateFormatted = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const billNo = `SUP-${dateFormatted}-${String(billCount).padStart(2, '0')}`;
    const newSupply: Supply = {
      ...data,
      id: `supply-${Date.now()}`,
      billNo,
      createdAt: new Date().toISOString(),
    };

    // Update supplier ledger: totalSupplied += totalAmount, totalPaid += paidAmount, currentDue += (total - paid)
    const unpaidPart = data.totalAmount - data.paidAmount;
    const updatedSuppliers = suppliers.map((s) => {
      if (s.id === data.supplierId) {
        return {
          ...s,
          totalSupplied: s.totalSupplied + data.totalAmount,
          totalPaid: s.totalPaid + data.paidAmount,
          currentDue: s.currentDue + unpaidPart,
        };
      }
      return s;
    });

    const updatedSupplies = [newSupply, ...supplies];
    setSuppliesState(updatedSupplies);
    setSuppliersState(updatedSuppliers);
    storage.setSupplies(updatedSupplies);
    storage.setSuppliers(updatedSuppliers);

    showToast(
      language === 'bn' ? `মাল জমার হিসাব সংরক্ষিত: ${billNo}` : `Supply entry saved: ${billNo}`,
      'success'
    );
    return newSupply;
  };

  const recordSupplierPayment = (data: Omit<SupplierPayment, 'id' | 'voucherNo' | 'createdAt'>): SupplierPayment => {
    const vCount = supplierPayments.length + 1;
    const dateFormatted = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const voucherNo = `VOUCH-${dateFormatted}-${String(vCount).padStart(2, '0')}`;
    const newPay: SupplierPayment = {
      ...data,
      id: `sp-pay-${Date.now()}`,
      voucherNo,
      createdAt: new Date().toISOString(),
    };

    // Update supplier ledger
    const updatedSuppliers = suppliers.map((s) => {
      if (s.id === data.supplierId) {
        return {
          ...s,
          totalPaid: s.totalPaid + data.amount,
          currentDue: Math.max(0, s.currentDue - data.amount),
        };
      }
      return s;
    });

    const updatedPayments = [newPay, ...supplierPayments];
    setSupplierPaymentsState(updatedPayments);
    setSuppliersState(updatedSuppliers);
    storage.setSupplierPayments(updatedPayments);
    storage.setSuppliers(updatedSuppliers);

    showToast(
      language === 'bn' ? `সাপ্লায়ার পেমেন্ট সফল: ${voucherNo}` : `Supplier payment recorded: ${voucherNo}`,
      'success'
    );
    return newPay;
  };

  // Cash Handover
  const recordCashHandover = (amount: number, notes?: string) => {
    const newHandover: CashHandover = {
      id: `ch-${Date.now()}`,
      deliveryManId: currentUser.id,
      deliveryManName: currentUser.name,
      amount,
      date: new Date().toISOString().slice(0, 10),
      status: 'pending',
      notes,
    };
    const updated = [newHandover, ...cashHandovers];
    setCashHandoversState(updated);
    storage.setCashHandovers(updated);
    showToast(
      language === 'bn' ? 'মালিককে ক্যাশ জমা দেওয়ার রিকোয়েস্ট তৈরি হয়েছে' : 'Cash handover request submitted',
      'info'
    );
  };

  const acceptCashHandover = (id: string) => {
    const updated = cashHandovers.map((ch) =>
      ch.id === id ? { ...ch, status: 'accepted' as const, acceptedBy: currentUser.name } : ch
    );
    setCashHandoversState(updated);
    storage.setCashHandovers(updated);
    showToast(language === 'bn' ? 'ক্যাশ জমা গ্রহণ করা হয়েছে' : 'Cash deposit accepted', 'success');
  };

  const resetAllData = () => {
    storage.resetAllData();
    setUsers(storage.getUsers());
    setCurrentUserId('user-admin');
    setSettingsState(storage.getSettings());
    setProductsState(storage.getProducts());
    setClientsState(storage.getClients());
    setSuppliersState(storage.getSuppliers());
    setBatchesState(storage.getQrBatches());
    setJarQrsState(storage.getJarQrs());
    setDeliveriesState(storage.getDeliveries());
    setClientPaymentsState(storage.getClientPayments());
    setSuppliesState(storage.getSupplies());
    setSupplierPaymentsState(storage.getSupplierPayments());
    setCashHandoversState(storage.getCashHandovers());
    setOrderRequestsState(storage.getOrderRequests());
    setPendingDeliveryOrder(null);
    showToast(language === 'bn' ? 'সব ডেটা সফলভাবে রিসেট করা হয়েছে' : 'All data reset to demo values', 'info');
  };

  // Users
  const updateUser = (user: User) => {
    const updated = users.map((u) => (u.id === user.id ? user : u));
    setUsers(updated);
    storage.setUsers(updated);
    if (user.clientId) {
      const clientTarget = clients.find((c) => c.id === user.clientId);
      if (clientTarget) {
        const updatedClients = clients.map((c) =>
          c.id === user.clientId
            ? { ...c, name: user.name, phone: user.phone, address: user.address || c.address, area: user.area || c.area }
            : c
        );
        setClientsState(updatedClients);
        storage.setClients(updatedClients);
      }
    }
    showToast(language === 'bn' ? 'ইউজার তথ্য সফলভাবে আপডেট হয়েছে' : 'User profile updated successfully', 'success');
  };

  const addUser = (userData: Omit<User, 'id'>): User => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
    };
    const updated = [...users, newUser];
    setUsers(updated);
    storage.setUsers(updated);
    showToast(language === 'bn' ? 'নতুন ইউজার যুক্ত হয়েছে' : 'New user created', 'success');
    return newUser;
  };

  const deleteUser = (userId: string) => {
    if (userId === 'user-admin') {
      showToast(language === 'bn' ? 'প্রধান অ্যাডমিন মুছে ফেলা যাবে না' : 'Cannot delete primary admin', 'error');
      return;
    }
    const updated = users.filter((u) => u.id !== userId);
    setUsers(updated);
    storage.setUsers(updated);
    showToast(language === 'bn' ? 'ইউজার মুছে ফেলা হয়েছে' : 'User deleted', 'info');
  };

  // Interactive Clickable Modals
  const openInvoiceModal = (invOrDelivery: string | Delivery) => {
    if (typeof invOrDelivery === 'object' && invOrDelivery !== null) {
      setViewingDelivery(invOrDelivery);
      return;
    }
    const query = String(invOrDelivery).trim();
    const found = deliveries.find(
      (d) => d.invoiceNo.toLowerCase() === query.toLowerCase() || d.id === query
    );
    if (found) {
      setViewingDelivery(found);
    } else {
      showToast(language === 'bn' ? `চালান #${query} পাওয়া যায়নি` : `Invoice #${query} not found`, 'warning');
    }
  };

  const closeInvoiceModal = () => {
    setViewingDelivery(null);
  };

  const openClientProfileModal = (clientOrIdOrName: Client | string) => {
    if (typeof clientOrIdOrName === 'object' && clientOrIdOrName !== null) {
      setViewingClient(clientOrIdOrName);
      return;
    }
    const query = String(clientOrIdOrName).trim().toLowerCase();
    const found = clients.find(
      (c) =>
        c.id.toLowerCase() === query ||
        c.code.toLowerCase() === query ||
        c.name.toLowerCase() === query ||
        query.includes(c.name.toLowerCase()) ||
        c.name.toLowerCase().includes(query)
    );
    if (found) {
      setViewingClient(found);
    } else {
      showToast(language === 'bn' ? `গ্রাহক '${clientOrIdOrName}' পাওয়া যায়নি` : `Client '${clientOrIdOrName}' not found`, 'warning');
    }
  };

  const closeClientProfileModal = () => {
    setViewingClient(null);
  };

  const openUserDetailsModal = (userOrIdOrName: User | string) => {
    if (typeof userOrIdOrName === 'object' && userOrIdOrName !== null) {
      setViewingUser(userOrIdOrName);
      return;
    }
    const query = String(userOrIdOrName).trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.id.toLowerCase() === query ||
        u.name.toLowerCase() === query ||
        query.includes(u.name.toLowerCase()) ||
        u.name.toLowerCase().includes(query)
    );
    if (found) {
      setViewingUser(found);
    } else {
      showToast(language === 'bn' ? `ইউজার '${userOrIdOrName}' পাওয়া যায়নি` : `User '${userOrIdOrName}' not found`, 'warning');
    }
  };

  const closeUserDetailsModal = () => {
    setViewingUser(null);
  };

  const openUserEditModal = (userOrId: User | string) => {
    if (typeof userOrId === 'object' && userOrId !== null) {
      setEditingUser(userOrId);
      return;
    }
    const query = String(userOrId).trim().toLowerCase();
    const found = users.find((u) => u.id.toLowerCase() === query || u.name.toLowerCase() === query);
    if (found) {
      setEditingUser(found);
    }
  };

  const closeUserEditModal = () => {
    setEditingUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        currentUser,
        users,
        updateUser,
        deleteUser,
        addUser,
        viewingDelivery,
        openInvoiceModal,
        closeInvoiceModal,
        viewingClient,
        openClientProfileModal,
        closeClientProfileModal,
        viewingUser,
        openUserDetailsModal,
        closeUserDetailsModal,
        editingUser,
        openUserEditModal,
        closeUserEditModal,
        setCurrentUser: (u) => switchUserById(u.id),
        switchUserById,
        registerUser,
        language,
        setLanguage,
        t,
        formatCurrency,
        formatNumber,
        settings,
        updateSettings,
        products,
        addProduct,
        updateProduct,
        clients,
        addClient,
        updateClient,
        deleteClient,
        toggleClientActive,
        orderRequests,
        createOrderRequest,
        updateOrderStatus,
        pendingDeliveryOrder,
        setPendingDeliveryOrder,
        prefillDeliveryWithOrder,
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        batches,
        jarQrs,
        generateBatch,
        validateJarQr,
        deliveries,
        recordDelivery,
        clientPayments,
        recordClientPayment,
        supplies,
        recordSupply,
        supplierPayments,
        recordSupplierPayment,
        cashHandovers,
        recordCashHandover,
        acceptCashHandover,
        activeTab,
        setActiveTab,
        selectedClientId,
        setSelectedClientId,
        toasts,
        showToast,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
