#!/usr/bin/env node
import { startServer } from '@mcpfusion/core';
import { f } from './mcpfusion.js';
import { credentials } from './credentials.js';
import * as tools from './agents/api/api.tool.js';

export const mcpfusion = f;
export const registry = f.registry();

for (const tool of Object.values(tools)) {
    if (tool && typeof (tool as any).getName === 'function') {
        registry.register(tool as any);
    }
}

async function main() {
    await startServer({
        name: 'salesforce-commerce-mcp',
        version: '1.0.0',
        registry,
        credentials
    });
}

main().catch(console.error);
