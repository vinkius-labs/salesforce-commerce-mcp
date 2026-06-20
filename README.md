# 🛍️ Salesforce Commerce Cloud Agentic MCP

[![Vinkius Edge Deployment](https://img.shields.io/badge/Deploy%20on-Vinkius%20Edge-blue?style=for-the-badge)](https://vinkius.com/mcp/salesforce-commerce-cloud)
[![Docker Pulls](https://img.shields.io/docker/pulls/vinkius/salesforce-commerce-mcp?style=for-the-badge&logo=docker&color=2496ed)](https://hub.docker.com/r/vinkius/salesforce-commerce-mcp)

The official Model Context Protocol adapter for Salesforce Commerce Cloud (B2C). Empower your AI agents to seamlessly navigate headless storefronts, manage e-commerce orders, and interact with complex SCAPI/OCAPI endpoints natively.

## Headless E-Commerce meets Autonomous AI

Modern storefronts are incredibly complex. This MCP server abstract away the intricacies of Commerce Cloud authentication and rate-limiting. By exposing semantically rich tools, your AI agents can perform real-time inventory checks, orchestrate cart operations, and provide deeply personalized customer insights based on historical order data.

### Enterprise Edge Hosting by Vinkius

This server is highly optimized for the **Vinkius Edge** ecosystem. Hosting your AI tools on Vinkius offers distinct competitive advantages for e-commerce operations:
- **Unmatched Speed**: E-commerce AI demands fast catalog responses. Vinkius Edge isolates ensure your MCP runs globally, right next to your users, delivering sub-millisecond execution.
- **Vinkius Marketplace Integration**: Easily share or monetize your custom storefront agents through the Vinkius ecosystem.
- **Battle-tested Security**: E-commerce data is highly sensitive. The Vinkius runtime isolates your API tokens away from the LLM context window.

## Core Toolkit

Agents equipped with this MCP gain the following abilities:
- **`query_catalog`**: Deep semantic searches across your Commerce Cloud product catalog. Filters by category, availability, and pricing in real-time.
- **`manage_orders`**: Allows the agent to fetch order statuses, trace shipments, and process cancellations or modifications safely.
- **`customer_insights`**: Retrieves comprehensive buyer profiles and transaction histories, enabling the AI to offer bespoke shopping support.

## ⚡ 1-Click Vinkius Deployment

Forget about provisioning servers or managing Docker containers. Vinkius provides free, serverless edge hosting for MCP projects.

Simply run:
```bash
npx mcpfusion deploy
```

Your storefront agent bridge is now live.

👉 **[View the Salesforce Commerce Cloud MCP on the Vinkius Marketplace](https://vinkius.com/mcp/salesforce-commerce-cloud)**

## Developer Setup
If you are extending the capabilities locally via `mcpfusion`:
```bash
npm install
npm run dev
```
