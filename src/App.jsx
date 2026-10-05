import React, { useState, useEffect } from 'react';
import './index.css';

// ⚠️ Thay đường link Render của cậu vào đây khi deploy online nhé!
const API_URL = 'https://quanlyghichu-backend.onrender.com/api/items'; 

export default function App() {
  const [items, setItems] = useState([]);
  const [inputText, setInputText] = useState('');
  const [tab, setTab] = useState('user'); // 'user' hoặc 'admin'

  // Load danh sách từ Backend khi vừa mở web
  const fetchItems = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Lỗi lấy dữ liệu:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 1. Khách bấm gửi dữ liệu mới
  const handleAddItem = async () => {
    if (!inputText.trim()) return;
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: inputText })
    });
    setInputText('');
    fetchItems(); // Cập nhật lại danh sách
  };

  // 2. Admin đổi trạng thái
  const handleToggleStatus = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'PUT' });
    fetchItems();
  };

  // 3. Admin xóa mục
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  return (
    <div className="container">
      <h2>✨ Web Mẫu Tập Tành Fullstack</h2>

      {/* Nút chuyển đổi giữa Trang Người Dùng và Trang Quản Lý */}
      <div className="tab-buttons">
        <button 
          className={tab === 'user' ? 'active' : ''} 
          onClick={() => setTab('user')}
        >
          👤 Màn Hình Người Dùng
        </button>
        <button 
          className={tab === 'admin' ? 'active' : ''} 
          onClick={() => setTab('admin')}
        >
          👑 Màn Hình Quản Lý (Admin)
        </button>
      </div>

      <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

      {/* --- MÀN HÌNH 1: NGƯỜI DÙNG --- */}
      {tab === 'user' && (
        <div>
          <h3>Gửi thông tin / Yêu cầu mới</h3>
          <div className="form-box">
            <input 
              type="text" 
              placeholder="Nhập nội dung vào đây..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button className="btn-add" onClick={handleAddItem}>Gửi Đi 🚀</button>
          </div>

          <h4>📋 Danh sách đã gửi:</h4>
          {items.map((item) => (
            <div key={item.id} className="card">
              <div>
                <strong>{item.title}</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#777' }}>
                  Trạng thái: {item.status} | {item.createdAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MÀN HÌNH 2: ADMIN QUẢN LÝ --- */}
      {tab === 'admin' && (
        <div>
          <h3>👑 Trang Quản Lý (Dành Cho Chủ Web)</h3>
          {items.length === 0 ? <p>Chưa có dữ liệu nào...</p> : items.map((item) => (
            <div key={item.id} className="card" style={{ borderColor: '#e67e22' }}>
              <div>
                <strong>{item.title}</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#777' }}>
                  Trạng thái: {item.status}
                </p>
              </div>
              <div>
                <button 
                  className="btn-action btn-toggle" 
                  onClick={() => handleToggleStatus(item.id)}
                >
                  Đổi Trạng Thái
                </button>
                <button 
                  className="btn-action btn-del" 
                  onClick={() => handleDelete(item.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}