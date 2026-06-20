import { createPresenter, ui } from '@mcpfusion/core';
import { SFListModel } from '../models/index.js';

interface SFData { type?: string; items_raw?: Record<string, any>[]; items?: Record<string, any>[]; data?: any; }

export const SFPresenter = createPresenter('Salesforce')
    .schema(SFListModel as any)
    .ui((data: unknown) => {
        const d = data as SFData;
        let t = `☁️ **Salesforce Record**\n\n`;
        const items = d.items_raw || d.items || d.data || Object.values(d);
        const mapped = Array.isArray(items) ? items : [items];
        if (!mapped || mapped.length === 0 || !mapped[0]) return [ui.markdown('> No records.')];
        for (const i of mapped) {
            if (typeof i !== 'object') continue;
            t += `- **${i.Name || i.Subject || i.Title || i.Id || 'Record'}**\n`;
        }
        return [ui.markdown(t)];
    });
