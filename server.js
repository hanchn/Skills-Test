const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 设置 EJS 为模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 解析请求体
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.get('/', (req, res) => {
  res.render('index', { title: '首页 - 自动化测试示例' });
});

app.get('/carousel', (req, res) => {
  res.render('carousel', { title: '轮播图 (Swiper.js) - 自动化测试示例' });
});

app.get('/form', (req, res) => {
  res.render('form', { title: '表单交互 - 自动化测试示例' });
});

app.get('/dynamic', (req, res) => {
  res.render('dynamic', { title: '动态内容 - 自动化测试示例' });
});

// 健康检查 API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// 模拟表单提交 API
app.post('/api/submit', (req, res) => {
  const { username, email } = req.body;
  // 模拟处理延迟
  setTimeout(() => {
    if (username && email) {
      res.json({ success: true, message: `用户 ${username} 提交成功！`, data: { username, email } });
    } else {
      res.status(400).json({ success: false, message: '请填写所有必填字段' });
    }
  }, 1000);
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
