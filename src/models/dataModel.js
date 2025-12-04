const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// 数据文件路径
const DATA_FILE = path.join(__dirname, '../../iit_data.json');

// 内存存储（用于无服务器环境）
let memoryStore = [];
let isReadOnly = false;

// 检查环境是否为只读
const checkReadOnly = () => {
  try {
    // 尝试写入一个临时文件来检查是否有写入权限
    const tempFile = path.join(__dirname, '../../.temp_test');
    fs.writeFileSync(tempFile, 'test');
    fs.unlinkSync(tempFile);
    return false;
  } catch (error) {
    console.log('Running in read-only mode (e.g., Vercel or similar serverless environment)');
    return true;
  }
};

// 初始化检查
isReadOnly = checkReadOnly();

// 从文件加载初始数据到内存
const loadInitialData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      memoryStore = JSON.parse(data);
      console.log(`Loaded ${memoryStore.length} items from initial data file`);
    } else {
      console.log('No initial data file found, starting with empty store');
      memoryStore = [];
    }
  } catch (error) {
    console.error('Error loading initial data:', error);
    memoryStore = [];
  }
};

// 初始化数据
loadInitialData();

// 获取所有数据
const getAllData = () => {
  return memoryStore;
};

// 保存所有数据 - 在只读环境中仅更新内存
const saveAllData = (data) => {
  // 更新内存存储
  memoryStore = data;
  
  // 如果不是只读环境，尝试写入文件
  if (!isReadOnly) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      console.log(`Saved ${data.length} items to file`);
    } catch (error) {
      console.error('Error saving data to file:', error);
      // 即使写入失败，内存存储已经更新，API仍能正常工作
    }
  } else {
    console.log(`Updated ${data.length} items in memory (read-only mode)`);
  }
};

// 根据ID获取单个数据
const getDataById = (id) => {
  const data = getAllData();
  return data.find(item => item.id === id) || null;
};

// 创建新数据
const createData = (newItem) => {
  const data = getAllData();
  const itemWithId = {
    id: newItem.id || uuidv4(),
    ...newItem
  };
  data.push(itemWithId);
  saveAllData(data);
  return itemWithId;
};

// 更新数据
const updateData = (id, updatedItem) => {
  const data = getAllData();
  const index = data.findIndex(item => item.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updated = {
    ...data[index],
    ...updatedItem,
    id
  };
  
  data[index] = updated;
  saveAllData(data);
  return updated;
};

// 删除数据
const deleteData = (id) => {
  const data = getAllData();
  const index = data.findIndex(item => item.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const deleted = data.splice(index, 1)[0];
  saveAllData(data);
  return deleted;
};

// 删除所有数据
const deleteAllData = () => {
  saveAllData([]);
  return true;
};

module.exports = {
  getAllData,
  getDataById,
  createData,
  updateData,
  deleteData,
  deleteAllData
};
