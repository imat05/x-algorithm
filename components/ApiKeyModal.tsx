import React, { useState, useEffect } from 'react';
import { Key, X, ExternalLink, AlertCircle, Plus, Trash2, Check, Edit2 } from 'lucide-react';
import { Language, ApiKeyItem } from '../types';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeysChange: () => void; // Notify parent that keys have changed
  apiKeys: ApiKeyItem[];
  lang: Language;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeysChange, apiKeys, lang }) => {
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const t = {
    title: lang === 'tr' ? 'API Key Yönetimi' : 'API Key Management',
    subtitle: lang === 'tr' 
      ? 'Gemini API key\'lerinizi ekleyin ve yönetin. Key\'ler sadece tarayıcınızda saklanır.' 
      : 'Add and manage your Gemini API keys. Keys are stored only in your browser.',
    addNew: lang === 'tr' ? 'Yeni API Key Ekle' : 'Add New API Key',
    keyName: lang === 'tr' ? 'Key İsmi' : 'Key Name',
    keyNamePlaceholder: lang === 'tr' ? 'Örn: İş, Kişisel, Yedek' : 'e.g., Work, Personal, Backup',
    apiKey: lang === 'tr' ? 'API Key' : 'API Key',
    placeholder: 'AIzaSy...',
    add: lang === 'tr' ? 'Ekle' : 'Add',
    cancel: lang === 'tr' ? 'İptal' : 'Cancel',
    close: lang === 'tr' ? 'Kapat' : 'Close',
    active: lang === 'tr' ? 'Aktif' : 'Active',
    setActive: lang === 'tr' ? 'Aktif Yap' : 'Set Active',
    delete: lang === 'tr' ? 'Sil' : 'Delete',
    edit: lang === 'tr' ? 'Düzenle' : 'Edit',
    save: lang === 'tr' ? 'Kaydet' : 'Save',
    noKeys: lang === 'tr' ? 'Henüz API key eklenmedi' : 'No API keys added yet',
    getKey: lang === 'tr' ? 'Ücretsiz API Key Al' : 'Get Free API Key',
    howTo: lang === 'tr' ? 'Nasıl Alınır?' : 'How to Get?',
    instructions: lang === 'tr' ? [
      '1. Google AI Studio\'ya gidin',
      '2. Google hesabınızla giriş yapın',
      '3. "Create API Key" butonuna tıklayın',
      '4. API key\'i kopyalayıp buraya yapıştırın'
    ] : [
      '1. Go to Google AI Studio',
      '2. Sign in with your Google account',
      '3. Click "Create API Key" button',
      '4. Copy and paste the API key here'
    ],
    security: lang === 'tr' 
      ? '🔒 API key\'leriniz sadece bu cihazda saklanır ve hiçbir sunucuya gönderilmez.' 
      : '🔒 Your API keys are stored only on this device and never sent to any server.',
    errorRequired: lang === 'tr' ? 'İsim ve API key gereklidir' : 'Name and API key are required',
    errorInvalid: lang === 'tr' ? 'Geçersiz API key formatı (AIza ile başlamalı)' : 'Invalid API key format (should start with AIza)',
    errorExists: lang === 'tr' ? 'Bu API key zaten mevcut' : 'This API key already exists',
    created: lang === 'tr' ? 'Eklendi' : 'Created',
    lastUsed: lang === 'tr' ? 'Son kullanım' : 'Last used',
    never: lang === 'tr' ? 'Hiç kullanılmadı' : 'Never used',
  };

  const handleAdd = async () => {
    const trimmedName = newKeyName.trim();
    const trimmedKey = newKeyValue.trim();
    
    if (!trimmedName || !trimmedKey) {
      setError(t.errorRequired);
      return;
    }

    if (!trimmedKey.startsWith('AIza')) {
      setError(t.errorInvalid);
      return;
    }

    if (apiKeys.some(k => k.key === trimmedKey)) {
      setError(t.errorExists);
      return;
    }

    try {
      const { addApiKey } = await import('../utils/apiKeyStorage');
      addApiKey(trimmedName, trimmedKey, apiKeys.length === 0);
      setNewKeyName('');
      setNewKeyValue('');
      setError('');
      onKeysChange();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { deleteApiKey } = await import('../utils/apiKeyStorage');
      deleteApiKey(id);
      onKeysChange();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      const { setActiveApiKey } = await import('../utils/apiKeyStorage');
      setActiveApiKey(id);
      onKeysChange();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    
    try {
      const { updateApiKey } = await import('../utils/apiKeyStorage');
      updateApiKey(id, { name: editName.trim() });
      setEditingId(null);
      setEditName('');
      onKeysChange();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t.never;
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const maskKey = (key: string) => {
    if (key.length <= 12) return key;
    return `${key.slice(0, 8)}...${key.slice(-4)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-800 shadow-2xl animate-slideUp">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Key className="text-blue-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t.title}</h2>
              <p className="text-sm text-slate-400 mt-0.5">{t.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-2 hover:bg-slate-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Existing Keys List */}
          {apiKeys.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">
                {lang === 'tr' ? 'Kayıtlı API Key\'ler' : 'Saved API Keys'} ({apiKeys.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
                {apiKeys.map((keyItem) => (
                  <div 
                    key={keyItem.id}
                    className={`p-4 rounded-lg border transition ${
                      keyItem.isActive 
                        ? 'bg-blue-900/20 border-blue-500/50' 
                        : 'bg-slate-800/50 border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {editingId === keyItem.id ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={() => handleSaveEdit(keyItem.id)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(keyItem.id)}
                            className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white">{keyItem.name}</h4>
                            {keyItem.isActive && (
                              <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/50 rounded text-green-400 text-xs font-medium flex items-center gap-1">
                                <Check size={12} />
                                {t.active}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-slate-400 font-mono mt-1">{maskKey(keyItem.key)}</p>
                        <div className="flex gap-4 text-xs text-slate-500 mt-2">
                          <span>{t.created}: {formatDate(keyItem.createdAt)}</span>
                          {keyItem.lastUsed && (
                            <span>{t.lastUsed}: {formatDate(keyItem.lastUsed)}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {!keyItem.isActive && (
                          <button
                            onClick={() => handleSetActive(keyItem.id)}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition"
                            title={t.setActive}
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(keyItem.id, keyItem.name)}
                          className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded transition"
                          title={t.edit}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(keyItem.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition"
                          title={t.delete}
                          disabled={apiKeys.length === 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {apiKeys.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Key size={48} className="mx-auto mb-3 opacity-30" />
              <p>{t.noKeys}</p>
            </div>
          )}

          {/* Add New Key Form */}
          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <Plus size={16} className="text-blue-400" />
              {t.addNew}
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  {t.keyName}
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => {
                    setNewKeyName(e.target.value);
                    setError('');
                  }}
                  placeholder={t.keyNamePlaceholder}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  {t.apiKey}
                </label>
                <input
                  type="text"
                  value={newKeyValue}
                  onChange={(e) => {
                    setNewKeyValue(e.target.value);
                    setError('');
                  }}
                  placeholder={t.placeholder}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleAdd}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
              >
                <Plus size={18} />
                {t.add}
              </button>
            </div>
          </div>

          {/* How to Get API Key */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <ExternalLink size={16} className="text-blue-400" />
              {t.howTo}
            </h3>
            <ol className="space-y-2 text-sm text-slate-300 mb-4">
              {t.instructions.map((instruction, idx) => (
                <li key={idx}>{instruction}</li>
              ))}
            </ol>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition"
            >
              <ExternalLink size={16} />
              {t.getKey}
            </a>
          </div>

          {/* Security Note */}
          <div className="text-xs text-slate-400 bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
            {t.security}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow-lg hover:shadow-xl"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
