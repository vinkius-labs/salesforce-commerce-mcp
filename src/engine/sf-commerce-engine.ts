import { requireCredential } from '@mcpfusion/core';

let cachedToken: { token: string; instanceUrl: string; exp: number } | null = null;

async function getToken(): Promise<{ token: string; instanceUrl: string }> {
    if (cachedToken && Date.now() < cachedToken.exp) return { token: cachedToken.token, instanceUrl: cachedToken.instanceUrl };
    const instanceUrl = requireCredential('SF_INSTANCE_URL').replace(/\/+$/, '');
    const res = await fetch(`${instanceUrl}/services/oauth2/token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=client_credentials&client_id=${encodeURIComponent(requireCredential('SF_CONSUMER_KEY'))}&client_secret=${encodeURIComponent(requireCredential('SF_CONSUMER_SECRET'))}` });
    if (!res.ok) throw new Error(`Salesforce Auth [${res.status}]: ${await res.text()}`);
    const d = await res.json() as any;
    cachedToken = { token: d.access_token, instanceUrl: d.instance_url || instanceUrl, exp: Date.now() + 3500000 };
    return { token: cachedToken.token, instanceUrl: cachedToken.instanceUrl };
}

async function sfRequest(path: string, options: RequestInit = {}): Promise<any> {
    const { token, instanceUrl } = await getToken();
    const res = await fetch(`${instanceUrl}${path}`, { ...options, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers } });
    if (!res.ok) throw new Error(`Salesforce [${res.status}]: ${await res.text().catch(() => '')}`);
    if (res.status === 204) return { success: true };
    return res.json();
}

async function sfQuery(soql: string): Promise<any[]> {
    return (await sfRequest(`/services/data/v62.0/query?q=${encodeURIComponent(soql)}`)).records || [];
}

function fmt(records: any[], type: string) {
    if (!records.length) return [{ id: '', name: `No ${type} found`, detail: '', status: '', quantity: '', price: '', date: '', extra: '' }];
    return records.map((r: any) => ({
        id: r.Id || '', name: r.Name || r.OrderNumber || r.Product2?.Name || '',
        detail: r.Description || r.Family || r.Type || r.Account?.Name || '',
        status: r.Status || r.IsActive?.toString() || '',
        quantity: r.Quantity?.toString() || r.QuantityUnitOfMeasure || '',
        price: r.UnitPrice?.toString() || r.TotalAmount?.toString() || r.ListPrice?.toString() || '',
        date: r.EffectiveDate || r.CreatedDate || '', extra: r.ProductCode || r.Product2?.ProductCode || ''
    }));
}

// ═══════ PRODUCTS ═══════
export async function searchProducts(query: string, limit: number = 20) {
    return fmt(await sfQuery(`SELECT Id,Name,ProductCode,Description,Family,IsActive,CreatedDate FROM Product2 WHERE Name LIKE '%${query}%' OR ProductCode LIKE '%${query}%' ORDER BY Name ASC LIMIT ${limit}`), 'products');
}

export async function getProductsByFamily(family: string, limit: number = 20) {
    return fmt(await sfQuery(`SELECT Id,Name,ProductCode,Description,Family,IsActive FROM Product2 WHERE Family = '${family}' AND IsActive = true ORDER BY Name ASC LIMIT ${limit}`), 'products');
}

export async function updateProduct(id: string, data: Record<string, any>) {
    await sfRequest(`/services/data/v62.0/sobjects/Product2/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    return [{ id, name: 'Product updated', detail: JSON.stringify(data).slice(0, 200), status: 'updated', quantity: '', price: '', date: new Date().toISOString(), extra: '' }];
}

// ═══════ ORDERS ═══════
export async function searchOrders(query: string, limit: number = 20) {
    return fmt(await sfQuery(`SELECT Id,OrderNumber,Status,TotalAmount,EffectiveDate,Account.Name,Type,CreatedDate FROM Order WHERE OrderNumber LIKE '%${query}%' OR Account.Name LIKE '%${query}%' ORDER BY CreatedDate DESC LIMIT ${limit}`), 'orders');
}

export async function getOrdersByStatus(status: string, limit: number = 20) {
    return fmt(await sfQuery(`SELECT Id,OrderNumber,Status,TotalAmount,EffectiveDate,Account.Name,Type FROM Order WHERE Status = '${status}' ORDER BY TotalAmount DESC LIMIT ${limit}`), 'orders');
}

export async function getOrderItems(orderId: string) {
    return fmt(await sfQuery(`SELECT Id,Product2.Name,Product2.ProductCode,Quantity,UnitPrice,TotalPrice,Description FROM OrderItem WHERE OrderId = '${orderId}'`), 'order items');
}

// ═══════ PRICEBOOKS ═══════
export async function listPricebooks(limit: number = 20) {
    return fmt(await sfQuery(`SELECT Id,Name,Description,IsActive,IsStandard,CreatedDate FROM Pricebook2 ORDER BY Name ASC LIMIT ${limit}`), 'pricebooks');
}

export async function getPricebookEntries(pricebookId: string, limit: number = 50) {
    return fmt(await sfQuery(`SELECT Id,Product2.Name,Product2.ProductCode,UnitPrice,IsActive,UseStandardPrice FROM PricebookEntry WHERE Pricebook2Id = '${pricebookId}' AND IsActive = true ORDER BY Product2.Name ASC LIMIT ${limit}`), 'entries');
}
