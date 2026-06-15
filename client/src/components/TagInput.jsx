import { useState } from 'react';
import { FiX } from 'react-icons/fi';

const TagInput = ({ tags = [], onChange }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = input.trim();
      if (tag && !tags.includes(tag)) {
        onChange([...tags, tag]);
      }
      setInput('');
    }
  };

  const removeTag = (index) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="tag-input">
      <div className="tag-list">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="tag-remove">
              <FiX />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tags (press Enter)"
        className="tag-field"
      />
    </div>
  );
};

export default TagInput;
