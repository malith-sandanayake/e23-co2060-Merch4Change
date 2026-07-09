import React, { useState, useEffect } from 'react';
import './SaveToCollectionModal.css';
import { getUserCollections, createCollection, saveStoryToCollection } from '../../api/storyService';
import { useAuth } from '../../context/Context';
import { toast } from 'react-hot-toast';

function SaveToCollectionModal({ image, onClose }) {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        if (!user?.userName) return;
        const res = await getUserCollections(user.userName);
        if (res?.data?.collections) {
          setCollections(res.data.collections);
        }
      } catch (error) {
        console.error("Failed to fetch collections", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollections();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const res = await createCollection(newTitle, image);
      if (res.success) {
        toast.success('Collection created and story saved!');
        onClose();
      }
    } catch (error) {
      toast.error('Failed to create collection');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveToExisting = async (collectionId) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const res = await saveStoryToCollection(collectionId, image);
      if (res.success) {
        toast.success('Story saved to collection!');
        onClose();
      }
    } catch (error) {
      toast.error('Failed to save story');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="stc-modal-overlay" onClick={onClose}>
      <div className="stc-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="stc-modal-header">
          <h3>Save to Collection</h3>
          <button className="stc-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="stc-modal-body">
          {isLoading ? (
            <p className="stc-loading">Loading collections...</p>
          ) : (
            <div className="stc-collections-list">
              {collections.length === 0 ? (
                <p className="stc-empty">You don't have any collections yet.</p>
              ) : (
                collections.map((col) => {
                  const alreadySaved = col.stories.some(s => s.image === image);
                  return (
                    <div key={col._id} className="stc-collection-item">
                      <div className="stc-col-info">
                        <div 
                          className="stc-col-thumb"
                          style={{ backgroundImage: `url(${col.stories[0]?.image || ''})` }}
                        />
                        <span>{col.title}</span>
                      </div>
                      <button 
                        className={`stc-save-btn ${alreadySaved ? 'saved' : ''}`}
                        onClick={() => handleSaveToExisting(col._id)}
                        disabled={alreadySaved || isSaving}
                      >
                        {alreadySaved ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          <div className="stc-create-section">
            <h4>Create New Collection</h4>
            <form onSubmit={handleCreate} className="stc-create-form">
              <input 
                type="text" 
                placeholder="Collection Name" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={60}
              />
              <button type="submit" disabled={!newTitle.trim() || isSaving}>
                Create & Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaveToCollectionModal;
