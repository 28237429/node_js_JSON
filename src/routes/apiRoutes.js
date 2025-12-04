const express = require('express');
const router = express.Router();
const dataModel = require('../models/dataModel');

// 获取所有数据
router.get('/', (req, res) => {
  try {
    const data = dataModel.getAllData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get data', details: error.message });
  }
});

// 根据ID获取单个数据
router.get('/:id', (req, res) => {
  try {
    const data = dataModel.getDataById(req.params.id);
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get data', details: error.message });
  }
});

// 创建新数据
router.post('/', (req, res) => {
  try {
    const newItem = dataModel.createData(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create data', details: error.message });
  }
});

// 更新数据
router.put('/:id', (req, res) => {
  try {
    const updatedItem = dataModel.updateData(req.params.id, req.body);
    if (updatedItem) {
      res.json(updatedItem);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update data', details: error.message });
  }
});

// 删除数据
router.delete('/:id', (req, res) => {
  try {
    const deletedItem = dataModel.deleteData(req.params.id);
    if (deletedItem) {
      res.json({ message: 'Item deleted successfully', item: deletedItem });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete data', details: error.message });
  }
});

// 批量更新数据（替换所有数据）
router.put('/', (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      // 删除所有现有数据
      dataModel.deleteAllData();
      
      // 批量创建新数据
      const createdItems = [];
      for (const item of req.body) {
        const createdItem = dataModel.createData(item);
        createdItems.push(createdItem);
      }
      
      res.json(createdItems);
    } else {
      res.status(400).json({ error: 'Request body must be an array' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to batch update data', details: error.message });
  }
});

// 删除所有数据
router.delete('/', (req, res) => {
  try {
    dataModel.deleteAllData();
    res.json({ message: 'All data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete all data', details: error.message });
  }
});

module.exports = router;
