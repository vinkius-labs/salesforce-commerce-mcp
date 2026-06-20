import { defineModel } from '@mcpfusion/core';
export const SFListModel = defineModel('SFList', (m) => {
    m.casts({
        type: m.string('Resource type'),
        items: m.text('JSON array')
    });
});
