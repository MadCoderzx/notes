import { Link } from 'react-router-dom';
import { FiHeart, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';
import { useNotes } from '../hooks/useNotes';
import toast from 'react-hot-toast';

const NoteCard = ({ note }) => {
  const { deleteNote, toggleFavorite } = useNotes();

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(note.id);
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavorite(note.id);
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  const plainText = note.content ? note.content.replace(/<[^>]*>/g, '').slice(0, 100) : '';

  return (
    <Link to={`/notes/${note.id}`} className="note-card">
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title}</h3>
        <div className="note-card-actions" onClick={(e) => e.stopPropagation()}>
          <button onClick={handleFavorite} className={`btn-icon ${note.is_favorite ? 'favorite' : ''}`}>
            <FiHeart fill={note.is_favorite ? 'currentColor' : 'none'} />
          </button>
          <Link to={`/notes/edit/${note.id}`} className="btn-icon" onClick={(e) => e.stopPropagation()}>
            <FiEdit2 />
          </Link>
          <button onClick={handleDelete} className="btn-icon danger">
            <FiTrash2 />
          </button>
        </div>
      </div>
      <p className="note-card-content">{plainText}</p>
      <div className="note-card-footer">
        <span className="note-card-category">{note.category}</span>
        {note.tags && note.tags.length > 0 && (
          <div className="note-card-tags">
            {note.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
        )}
        <span className="note-card-date">{format(new Date(note.created_at), 'MMM d, yyyy')}</span>
      </div>
    </Link>
  );
};

export default NoteCard;
