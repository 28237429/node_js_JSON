const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务（Vercel环境中可能需要）
app.use(express.static(path.join(__dirname, '../')));

// API路由
app.use('/api/data', apiRoutes);

// 根路由 - 在Vercel环境中，根路径将由vercel.json配置处理
app.get('/', (req, res) => {
  res.json({
    message: 'IIT VisionSpec Dashboard API',
    version: '1.0.0',
    endpoints: {
      getAll: 'GET /api/data',
      getOne: 'GET /api/data/:id',
      create: 'POST /api/data',
      update: 'PUT /api/data/:id',
      delete: 'DELETE /api/data/:id',
      batchUpdate: 'PUT /api/data',
      deleteAll: 'DELETE /api/data'
    }
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource was not found' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// 导出应用供Vercel使用
module.exports = app;

// 仅在本地开发环境中启动服务器
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀 IIT VisionSpec Dashboard API Server running on http://localhost:${PORT}`);
    console.log(`📡 API Endpoints:`);
    console.log(`   GET    http://localhost:${PORT}/api/data          - Get all data`);
    console.log(`   GET    http://localhost:${PORT}/api/data/:id      - Get single item`);
    console.log(`   POST   http://localhost:${PORT}/api/data          - Create new item`);
    console.log(`   PUT    http://localhost:${PORT}/api/data/:id      - Update item`);
    console.log(`   DELETE http://localhost:${PORT}/api/data/:id      - Delete item`);
    console.log(`   PUT    http://localhost:${PORT}/api/data          - Batch update (replace all)`);
    console.log(`   DELETE http://localhost:${PORT}/api/data          - Delete all data`);
    console.log(`\n📁 Data file: iit_data.json`);
    console.log(`\nPress Ctrl+C to stop the server\n`);
  });
}
