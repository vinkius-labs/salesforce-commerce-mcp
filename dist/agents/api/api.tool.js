import { f } from '../../mcpfusion.js';
import { SFPresenter } from '../../views/index.js';
import { searchProducts, getProductsByFamily, updateProduct, searchOrders, getOrdersByStatus, getOrderItems, listPricebooks, getPricebookEntries } from '../../engine/sf-commerce-engine.js';
export const searchProductsTool = f.query('sf_search_products')
    .describe('Search the Salesforce product catalog by name or product code to find items with family, description, and active status.')
    .instructions('Queries Product2 sObjects via SOSL. Returns product name, product code (SKU), product family, description, and whether the product is active. Products define what can be sold — they are linked to price books for pricing. Use when the user asks about product catalog, wants to find a specific product, or needs product IDs for orders.')
    .withString('query', 'Product name or product code').withOptionalNumber('limit', 'Maximum results (default: 20)')
    .egress(1024 * 1024).returns(SFPresenter)
    .handle(async (i) => await searchProducts(i.query, i.limit));
export const getProductsByFamilyTool = f.query('sf_products_by_family')
    .describe('Get all active products within a specific product family for category-level catalog browsing.')
    .instructions('Filters active Product2 records by the Family field. Returns products within a category (e.g., "Hardware", "Software", "Services"). Use when the user asks about products in a specific category, wants a category-level view, or needs to browse the catalog by family.')
    .withString('family', 'Product family name (e.g., Hardware, Software, Services)')
    .withOptionalNumber('limit', 'Maximum results (default: 20)')
    .egress(1024 * 1024).returns(SFPresenter)
    .handle(async (i) => await getProductsByFamily(i.family, i.limit));
export const updateProductTool = f.mutation('sf_update_product')
    .describe('Update a product in the Salesforce catalog — change name, description, active status, product code, or family.')
    .instructions('Patches a Product2 sObject. Common operations: set IsActive to false to discontinue a product, change Family to reclassify, update Description, or rename. Only specified fields change.')
    .withString('id', 'Product ID (18-char Salesforce ID)').withOptionalString('Name', 'New name')
    .withOptionalString('Description', 'New description').withOptionalBoolean('IsActive', 'Active/inactive status')
    .withOptionalString('Family', 'Product family')
    .returns(SFPresenter)
    .handle(async (i) => { const { id, ...data } = i; return await updateProduct(id, data); });
export const searchOrdersTool = f.query('sf_search_orders')
    .describe('Search Salesforce orders by order number or account name to find transactions with status, total, and dates.')
    .instructions('Queries Order sObjects. Returns order number, account name, status (Draft/Activated), total amount, effective date, and order owner. Orders represent confirmed customer transactions. Use when the user asks about customer orders, wants to look up a specific order number, or needs to review order history.')
    .withString('query', 'Order number or account name').withOptionalNumber('limit', 'Maximum results (default: 20)')
    .egress(1024 * 1024).returns(SFPresenter)
    .handle(async (i) => await searchOrders(i.query, i.limit));
export const getOrdersByStatusTool = f.query('sf_orders_by_status')
    .describe('Get Salesforce orders filtered by status (Draft or Activated) for order management and fulfillment tracking.')
    .instructions('Filters Order records by Status field, sorted by total amount descending. Use for order management: "how many draft orders need activation?", "show all activated orders", or for revenue analysis by order status.')
    .withString('status', 'Order status: Draft or Activated').withOptionalNumber('limit', 'Maximum results (default: 20)')
    .egress(1024 * 1024).returns(SFPresenter)
    .handle(async (i) => await getOrdersByStatus(i.status, i.limit));
export const getOrderItemsTool = f.query('sf_order_items')
    .describe('Get all line items of a specific Salesforce order — products, quantities, unit prices, and total prices per item.')
    .instructions('Retrieves OrderItem records for a specific order. Returns product name, quantity, unit price, total price, and description per line item. Use when the user asks "what is in this order?", needs to review order composition, or wants to verify pricing before activation.')
    .withString('orderId', 'Order ID (18-char Salesforce ID)')
    .egress(1024 * 1024).returns(SFPresenter)
    .handle(async (i) => await getOrderItems(i.orderId));
export const listPricebooksTool = f.query('sf_list_pricebooks')
    .describe('List all price books in Salesforce with name, description, active status, and whether it is the standard price book.')
    .instructions('Retrieves Pricebook2 records. Returns price book name, description, active status, and IsStandard flag. Every Salesforce org has a Standard Price Book. Additional price books allow different pricing for channels, regions, or customer tiers (e.g., "Partner Pricing", "Enterprise Discount"). Use to find price book IDs before viewing entries.')
    .withOptionalNumber('limit', 'Maximum results (default: 20)')
    .egress(1024 * 1024).returns(SFPresenter)
    .handle(async (i) => await listPricebooks(i.limit));
export const getPricebookEntriesTool = f.query('sf_pricebook_entries')
    .describe('Get all product price entries within a specific price book — products with their unit prices and active status.')
    .instructions('Retrieves PricebookEntry records for a specific price book. Returns product name, product code, unit price, currency, and active status. Price book entries define the actual price of a product in a specific context (channel, region, tier). Use to check pricing, compare across price books, or verify product availability in a specific price book.')
    .withString('pricebookId', 'Price Book ID (18-char — get from sf_list_pricebooks)')
    .withOptionalNumber('limit', 'Maximum results (default: 20)')
    .egress(1024 * 1024).returns(SFPresenter)
    .handle(async (i) => await getPricebookEntries(i.pricebookId, i.limit));
