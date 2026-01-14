/**
 * 自动导出路由表
 * 用法: node skills/frontend/scripts/ssr-routes-export.js
 */
const fs = require('fs');
const path = require('path');

// 手动定义核心路径
const staticRoutes = [
  '/', 
  '/carousel', 
  '/form', 
  '/dynamic'
];

const allRoutes = [...staticRoutes];
const outputPath = path.join(__dirname, '../outputs/routes.json');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(allRoutes, null, 2));

console.log(`Exported ${allRoutes.length} routes to ${outputPath}`);
