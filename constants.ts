import { Department, TaskTemplate, User, Role } from './types';

export const DEPARTMENTS: Department[] = [
  // Retail
  { id: 'dept_craft', name: 'Craft Beer', type: 'Retail', sop: '# Craft Beer SOP\n\n1. **Rotation**: Always FIFO (First In First Out).\n2. **Cold Chain**: IPAs must stay cold. Do not leave pallets out > 30 mins.\n3. **Faces**: Pull all cans to the front lip of the shelf.' },
  { id: 'dept_dom', name: 'Domestic Beer', type: 'Retail', sop: '# Domestic Beer SOP\n\nHigh volume area. Ensure 30-packs are stacked safely. Check date codes on light beers weekly.' },
  { id: 'dept_soda', name: 'Soda', type: 'Retail', sop: '# Soda SOP\n\nClean stickiness immediately. Rotate sugary sodas as they expire faster than expected.' },
  { id: 'dept_wwine', name: 'White Wine', type: 'Retail', sop: '# White Wine SOP\n\nKeep Chardonnays chilled. Pinot Grigio moves fast, check backstock daily.' },
  { id: 'dept_rwine', name: 'Red Wine', type: 'Retail', sop: '# Red Wine SOP\n\nDust bottles weekly. Store high-end Cabs horizontally if possible.' },
  { id: 'dept_spirits', name: 'Spirits', type: 'Retail', sop: '# Spirits SOP\n\nSecurity caps on all bottles > $50. Wipe down shelves daily due to dust accumulation.' },
  { id: 'dept_small', name: 'Small Sizes', type: 'Retail', sop: '# Nips/Pints SOP\n\nThis is a high theft area. Keep fully stocked to make gaps obvious.' },
  { id: 'dept_snacks', name: 'Snacks', type: 'Retail', sop: '# Snacks SOP\n\nCheck expiration dates on chips weekly. Clip strips must be full.' },
  { id: 'dept_cigar', name: 'Cigar', type: 'Retail', sop: '# Humidor SOP\n\nHumidity must be 70%. Temp 70F. Refill distilled water reservoir weekly.' },
  { id: 'dept_lotto', name: 'Lotto', type: 'Retail', sop: '# Lotto SOP\n\nCount tickets at shift change. Empty scratch-off bin daily.' },
  // Backend
  { id: 'dept_del', name: 'Delivery', type: 'Backend', sop: '# Delivery SOP\n\nCheck ID for every delivery. No exceptions. Log mileage.' },
  { id: 'dept_ship', name: 'Shipping', type: 'Backend', sop: '# Shipping SOP\n\nPack wine with inserts. Tape bottom of box 3 times.' },
  { id: 'dept_clean', name: 'Cleaning', type: 'Backend', sop: '# Cleaning SOP\n\nBathrooms hourly check. Mop floors at close.' },
  { id: 'dept_rec', name: 'Receiving', type: 'Backend', sop: '# Receiving SOP\n\nCount pieces before signing invoice. Circle missing items on invoice.' },
  { id: 'dept_maint', name: 'Maintenance', type: 'Backend', sop: '# Maintenance SOP\n\nSafety first. Lockout/Tagout for electrical work.' },
  { id: 'dept_inv', name: 'Inventory Prep', type: 'Backend', sop: '# Inventory SOP\n\nPre-count storage rooms 2 days prior. Use tag system.' },
];

export const USERS: User[] = [
  { id: 'u1', name: 'Owner Boss', role: Role.OWNER, departmentId: 'dept_spirits', email: 'owner@store.com', color: '#FF5733' },
  { id: 'u2', name: 'Mike Manager', role: Role.MANAGER, departmentId: 'dept_spirits', secondaryDepartmentIds: ['dept_wwine', 'dept_rwine'], email: 'mike@store.com', color: '#3357FF' },
  { id: 'u3', name: 'John Beer', role: Role.EMPLOYEE, departmentId: 'dept_craft', secondaryDepartmentIds: ['dept_dom', 'dept_soda'], email: 'john@store.com', color: '#33FF57' },
  { id: 'u4', name: 'Sarah Wine', role: Role.EMPLOYEE, departmentId: 'dept_wwine', email: 'sarah@store.com', color: '#F333FF' },
  { id: 'u5', name: 'Dave Driver', role: Role.EMPLOYEE, departmentId: 'dept_del', email: 'dave@store.com', color: '#FF8C33' },
];

export const TASK_TEMPLATES: TaskTemplate[] = [
  // Beer/Soda
  { title: 'Stock new orders', frequency: 'Daily', departmentId: 'dept_craft' },
  { title: 'Front face products', frequency: 'Daily', departmentId: 'dept_craft' },
  { title: 'Stock products', frequency: 'Daily', departmentId: 'dept_craft' },
  { title: 'Organize back stock', frequency: 'Daily', departmentId: 'dept_craft' },
  { title: 'Clean products', frequency: 'Weekly', departmentId: 'dept_craft' },
  { title: 'Check expiration dates', frequency: 'Weekly', departmentId: 'dept_craft' },
  { title: 'Clean glass fridges', frequency: 'Monthly', departmentId: 'dept_craft' },
  
  // Wine
  { title: 'Stock new orders', frequency: 'Daily', departmentId: 'dept_wwine' },
  { title: 'Stock wine', frequency: 'Daily', departmentId: 'dept_wwine' },
  { title: 'Clean wine bottles', frequency: 'Daily', departmentId: 'dept_wwine' },
  { title: 'Replenish from Backstock', frequency: 'Weekly', departmentId: 'dept_wwine' },

  // Spirits
  { title: 'Stock new orders', frequency: 'Daily', departmentId: 'dept_spirits' },
  { title: 'Stock spirits', frequency: 'Daily', departmentId: 'dept_spirits' },
  { title: 'Clean shelves', frequency: 'Daily', departmentId: 'dept_spirits' },
  { title: 'Check backstock', frequency: 'Weekly', departmentId: 'dept_spirits' },
  { title: 'Organize storage room', frequency: 'Weekly', departmentId: 'dept_spirits' },
  { title: 'Reverse stock full aisle', frequency: 'Monthly', departmentId: 'dept_spirits' },

  // Snacks
  { title: 'Stock snacks', frequency: 'Daily', departmentId: 'dept_snacks' },
  { title: 'Check expiration dates', frequency: 'Weekly', departmentId: 'dept_snacks' },

  // Cigar
  { title: 'Organize/stock cigars', frequency: 'Daily', departmentId: 'dept_cigar' },

  // Delivery
  { title: 'Manage delivery apps', frequency: 'Daily', departmentId: 'dept_del' },

  // Shipping
  { title: 'Move boxes & arrange table', frequency: 'Daily', departmentId: 'dept_ship' },

  // Maintenance
  { title: 'Clean Cooler Fans', frequency: 'Monthly', departmentId: 'dept_maint' },
  { title: 'Change Cigar Humidor Filter', frequency: 'Monthly', departmentId: 'dept_maint' },
  { title: 'Change AC Filters', frequency: 'Monthly', departmentId: 'dept_maint' },
];

export const PRODUCT_CATALOG = [
  { name: 'Lagunitas IPA', category: 'Craft Beer', price: '$$', notes: 'Hoppy, classic West Coast style.' },
  { name: 'Titos Vodka', category: 'Spirits', price: '$$', notes: 'Gluten-free, corn based, very popular.' },
  { name: 'Casamigos Blanco', category: 'Spirits', price: '$$$', notes: 'Smooth vanilla notes, celebrity brand.' },
  { name: 'Kim Crawford Sauvignon Blanc', category: 'White Wine', price: '$$', notes: 'Zesty, grassy, grapefruit notes.' },
  { name: 'Josh Cabernet', category: 'Red Wine', price: '$$', notes: 'Approachable, fruity, smooth tannins.' },
];