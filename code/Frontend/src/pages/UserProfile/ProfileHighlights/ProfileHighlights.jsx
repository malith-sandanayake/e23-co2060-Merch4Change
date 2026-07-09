import React, { useEffect, useState } from 'react';
import './ProfileHighlights.css';
import { getUserCollections } from '../../../api/storyService';
import CollectionViewer from './CollectionViewer';

function ProfileHighlights({ profileData }) {
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState(null);

  useEffect(() => {
    if (!profileData?.userName) return;
    
    const fetchCollections = async () => {
      try {
        const res = await getUserCollections(profileData.userName);
        if (res?.data?.collections) {
          setCollections(res.data.collections);
        }
      } catch (error) {
        console.error("Failed to fetch collections", error);
      }
    };
    fetchCollections();
  }, [profileData?.userName]);

  if (!collections || collections.length === 0) return null;

  return (
    <>
      <div className="lum-highlights">
        {collections.map((col) => (
          <div 
            key={col._id} 
            className="lum-highlight"
            onClick={() => setActiveCollection(col)}
            style={{ cursor: 'pointer' }}
          >
            <div className="highlight-ring">
              <div 
                className="highlight-img" 
                style={{ 
                  backgroundImage: `url(${col.stories[0]?.image || ''})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} 
              />
            </div>
            <p>{col.title}</p>
          </div>
        ))}
      </div>
      
      {activeCollection && (
        <CollectionViewer 
          collection={activeCollection} 
          onClose={() => setActiveCollection(null)} 
        />
      )}
    </>
  );
}

export default ProfileHighlights;
