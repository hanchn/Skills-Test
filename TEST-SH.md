```
# 1. 启动测试环境（后台运行，端口 3001）
bash skills/frontend/scripts/ssr-serve.sh

# 2. 导出路由表
node skills/frontend/scripts/ssr-routes-export.js

# 3. 运行冒烟测试
bash skills/frontend/scripts/ssr-api-check.sh

# 4. 运行 SSR 渲染测试
bash skills/frontend/scripts/ssr-test-render.sh

# 5. 运行 E2E 交互测试
BASE_URL=http://localhost:3001 npx playwright test skills/frontend/tests/e2e.spec.ts
```