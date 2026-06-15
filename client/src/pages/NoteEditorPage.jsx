import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { useNotes } from '../hooks/useNotes';
import { useDebounce } from '../hooks/useDebounce';
import RichTextEditor from '../components/RichTextEditor';
import TagInput from '../components/TagInput';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const DRAFT_KEY = 'note_draft';

const getDraft = () => {
  try {
    const draft = localStorage.getItem(DRAFT_KEY);
    return draft ? JSON.parse(draft) : {};
  } catch { return {}; }
};

const NoteEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { fetchNote, createNote, updateNote, loading } = useNotes();

  const draft = !isEditing ? getDraft() : {};
  const [title, setTitle] = useState(draft.title || '');
  const [content, setContent] = useState(draft.content || '');
  const [category, setCategory] = useState(draft.category || 'General');
  const [tags, setTags] = useState(draft.tags || []);
  const [saving, setSaving] = useState(false);

  const debouncedContent = useDebounce(content, 2000);
  const debouncedTitle = useDebounce(title, 2000);

  useEffect(() => {
    if (isEditing) {
      fetchNote(id).then((note) => {
        if (note) {
          setTitle(note.title);
          setContent(note.content || '');
          setCategory(note.category || 'General');
          setTags(note.tags || []);
        }
      });
    }
  }, [id, isEditing, fetchNote]);

  useEffect(() => {
    if (!isEditing && (debouncedTitle || debouncedContent)) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ title: debouncedTitle, content: debouncedContent, category, tags }));
    }
  }, [debouncedTitle, debouncedContent, category, tags, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    setSaving(true);
    try {
      const noteData = { title, content, category, tags };
      if (isEditing) {
        await updateNote(id, noteData);
        toast.success('Note updated successfully');
      } else {
        await createNote(noteData);
        localStorage.removeItem(DRAFT_KEY);
        toast.success('Note created successfully');
      }
      navigate('/notes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  if (isEditing && loading) return <Loader fullScreen />;

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="editor-page">
          <div className="editor-header">
            <Link to={isEditing ? `/notes/${id}` : '/notes'} className="btn btn-ghost">
              <FiArrowLeft /> Back
            </Link>
            <div className="editor-header-actions">
              {!isEditing && (
                <span className="auto-save-indicator">Drafts are auto-saved</span>
              )}
              <button onClick={handleSubmit} className="btn btn-primary" disabled={saving}>
                <FiSave /> {saving ? 'Saving...' : isEditing ? 'Update Note' : 'Create Note'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="editor-form">
            <div className="form-group">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="editor-title"
                required
              />
            </div>

            <div className="editor-meta">
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="General"
                  className="filter-input"
                />
              </div>
              <div className="form-group">
                <label>Tags</label>
                <TagInput tags={tags} onChange={setTags} />
              </div>
            </div>

            <RichTextEditor value={content} onChange={setContent} />
          </form>
        </div>
      </main>
    </div>
  );
};

export default NoteEditorPage;
