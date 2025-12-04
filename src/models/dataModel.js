const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// 数据文件路径
const DATA_FILE = path.join(__dirname, '../../iit_data.json');

// 确保数据文件存在
const ensureDataFileExists = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
};

// 获取所有数据
const getAllData = () => {
  ensureDataFileExists();
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
};

// 保存所有数据
const saveAllData = (data) => {
  ensureDataFileExists();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
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
