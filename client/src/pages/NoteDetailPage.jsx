import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiArrowLeft, FiHeart } from 'react-icons/fi';
import { format } from 'date-fns';
import { useNotes } from '../hooks/useNotes';
import Loader from '../components/Loader';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNote, fetchNote, deleteNote, toggleFavorite, loading } = useNotes();

  useEffect(() => {
    fetchNote(id);
  }, [id, fetchNote]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(id);
      toast.success('Note deleted');
      navigate('/notes');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const handleFavorite = async () => {
    try {
      await toggleFavorite(id);
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  if (loading || !currentNote) return <Loader fullScreen />;

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="note-detail">
          <div className="note-detail-nav">
            <Link to="/notes" className="btn btn-ghost"><FiArrowLeft /> Back to Notes</Link>
            <div className="note-detail-actions">
              <button onClick={handleFavorite} className={`btn btn-ghost ${currentNote.is_favorite ? 'favorite' : ''}`}>
                <FiHeart fill={currentNote.is_favorite ? 'currentColor' : 'none'} />
                {currentNote.is_favorite ? 'Unfavorite' : 'Favorite'}
              </button>
              <Link to={`/notes/edit/${id}`} className="btn btn-secondary"><FiEdit2 /> Edit</Link>
              <button onClick={handleDelete} className="btn btn-danger"><FiTrash2 /> Delete</button>
            </div>
          </div>

          <article className="note-detail-content">
            <header>
              <h1>{currentNote.title}</h1>
              <div className="note-detail-meta">
                <span className="note-card-category">{currentNote.category}</span>
                <span>Created: {format(new Date(currentNote.created_at), 'MMMM d, yyyy h:mm a')}</span>
                {currentNote.updated_at !== currentNote.created_at && (
                  <span>Updated: {format(new Date(currentNote.updated_at), 'MMMM d, yyyy h:mm a')}</span>
                )}
              </div>
              {currentNote.tags && currentNote.tags.length > 0 && (
                <div className="note-detail-tags">
                  {currentNote.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </header>
            <div className="note-body" dangerouslySetInnerHTML={{ __html: currentNote.content }} />
          </article>
        </div>
      </main>
    </div>
  );
};

export default NoteDetailPage;
