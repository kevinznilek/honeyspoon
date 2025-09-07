import React, { useState } from 'react';
import { Video } from 'lucide-react';

const ContentPage = ({ user, isMobile }) => {
  const [contentList, setContentList] = useState([]);
  const [showContentCreator, setShowContentCreator] = useState(false);
  const [contentFilter, setContentFilter] = useState('all');
  const [contentType, setContentType] = useState('blog');

  const addNewContent = (newContent) => {
    const newId = Math.max(...contentList.map(content => content.id), 0) + 1;
    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const content = {
      id: newId,
      type: newContent.type,
      title: newContent.title,
      tags: newContent.tags || [],
      date: currentDate,
      ...(newContent.type === 'blog' ? {
        excerpt: newContent.excerpt,
        readTime: newContent.readTime || 'TBD'
      } : {
        duration: newContent.duration || 'TBD',
        views: '0'
      })
    };
    
    setContentList(prev => [content, ...prev]);
  };

  const getFilteredContent = () => {
    if (contentFilter === 'all') return contentList;
    return contentList.filter(content => content.type === contentFilter);
  };

  const ContentCreatorModal = () => {
    const [selectedVideoFile, setSelectedVideoFile] = useState(null);
    
    if (!showContentCreator) return null;

    const handleVideoFileChange = (e) => {
      const file = e.target.files[0];
      setSelectedVideoFile(file);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const tagsString = formData.get('tags') || '';
      const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const newContent = {
        type: contentType,
        title: formData.get('title'),
        tags: tags,
        ...(contentType === 'blog' ? {
          excerpt: formData.get('excerpt'),
          readTime: formData.get('readTime')
        } : {
          duration: formData.get('duration'),
          videoFile: formData.get('videoFile') // Store video file reference
        })
      };
      
      addNewContent(newContent);
      setShowContentCreator(false);
      setSelectedVideoFile(null); // Reset video file selection
    };

    // Reset video file when modal closes
    const handleModalClose = () => {
      setShowContentCreator(false);
      setSelectedVideoFile(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto ${isMobile ? 'p-5' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Create Content</h3>
            <button 
              onClick={handleModalClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button 
                  type="button"
                  onClick={() => setContentType('blog')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    contentType === 'blog' ? 'text-white' : 'text-gray-600'
                  }`}
                  style={contentType === 'blog' ? {backgroundColor: '#F79101'} : {}}
                >
                  📝 Blog Post
                </button>
                <button 
                  type="button"
                  onClick={() => setContentType('video')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    contentType === 'video' ? 'text-white' : 'text-gray-600'
                  }`}
                  style={contentType === 'video' ? {backgroundColor: '#F79101'} : {}}
                >
                  🎥 Video
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="Enter content title"
                required
              />
            </div>

            {contentType === 'blog' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                  <textarea
                    name="excerpt"
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Brief description or excerpt"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                  <input
                    type="text"
                    name="readTime"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="e.g., 5 min read"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video *</label>
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    selectedVideoFile 
                      ? 'border-orange-400 bg-orange-50' 
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="text-2xl mb-2">🎥</div>
                      {selectedVideoFile ? (
                        <>
                          <p className="mb-2 text-sm text-orange-600 font-semibold">{selectedVideoFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(selectedVideoFile.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload video</span>
                          </p>
                          <p className="text-xs text-gray-500">MP4, MOV, AVI (MAX. 100MB)</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      name="videoFile"
                      accept="video/*"
                      className="hidden"
                      capture="environment"
                      onChange={handleVideoFileChange}
                      required
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="e.g., 10:30"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="meal planning, quick meals, family"
              />
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={handleModalClose}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors text-white"
                style={{backgroundColor: '#F79101'}}
              >
                Create Content
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>
          Content
        </h2>
        <button 
          onClick={() => setShowContentCreator(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors text-white ${isMobile ? 'py-3 rounded-xl touch-manipulation' : ''}`} 
          style={{backgroundColor: '#F79101', ...(isMobile ? {minHeight: '44px'} : {})}}
        >
          {isMobile ? '+ Create' : '+ Create Content'}
        </button>
      </div>

      {/* Content Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
        <button 
          onClick={() => setContentFilter('all')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            contentFilter === 'all' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
          }`}
          style={contentFilter === 'all' ? {backgroundColor: '#F79101'} : {}}
        >
          All Content
        </button>
        <button 
          onClick={() => setContentFilter('blog')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            contentFilter === 'blog' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
          }`}
          style={contentFilter === 'blog' ? {backgroundColor: '#F79101'} : {}}
        >
          📝 Blog Posts
        </button>
        <button 
          onClick={() => setContentFilter('video')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            contentFilter === 'video' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
          }`}
          style={contentFilter === 'video' ? {backgroundColor: '#F79101'} : {}}
        >
          🎥 Videos
        </button>
      </div>

      {/* Content Grid */}
      {getFilteredContent().length === 0 ? (
        <div className={`bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center ${isMobile ? 'rounded-2xl p-10' : ''}`}>
          <div className="text-4xl mb-4">📝</div>
          <p className="text-gray-500 mb-4">No content created yet</p>
          <p className="text-sm text-gray-400 mb-6">Start creating blog posts and videos to share your meal planning journey</p>
          <button
            onClick={() => setShowContentCreator(true)}
            className={`px-6 py-2 text-white rounded-lg font-medium ${isMobile ? 'px-8 py-3 rounded-xl' : ''}`}
            style={{backgroundColor: '#F79101'}}
          >
            Create Your First Content
          </button>
        </div>
      ) : (
        <div className={`${isMobile ? 'space-y-4' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
          {getFilteredContent().map((content, index) => (
            <div key={index} className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer ${isMobile ? 'rounded-2xl active:scale-95 transition-transform touch-manipulation' : 'hover:shadow-md transition-shadow'}`}>
              {content.type === 'video' ? (
                <div className="h-40 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #FCF4E8, #FFF2C7)'}}>
                  <Video size={isMobile ? 40 : 32} className="text-gray-400" />
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #FEF7ED, #FED7AA)'}}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">📝</div>
                    <div className="text-sm text-gray-600 font-medium">Blog Post</div>
                  </div>
                </div>
              )}
              
              <div className={`p-4 ${isMobile ? 'p-5' : ''}`}>
                <h4 className={`font-semibold text-gray-800 mb-2 ${isMobile ? 'text-lg mb-3' : ''}`}>{content.title}</h4>
                
                {content.type === 'blog' && content.excerpt && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content.excerpt}</p>
                )}
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {content.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{content.date}</span>
                  <span>
                    {content.type === 'video' 
                      ? `${content.duration} • ${content.views} views`
                      : content.readTime
                    }
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ContentCreatorModal />
    </div>
  );
};

export default ContentPage;