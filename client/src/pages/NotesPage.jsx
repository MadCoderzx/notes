import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { useNotes } from '../hooks/useNotes';
import { useDebounce } from '../hooks/useDebounce';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';

const NotesPage = () => {
  const { notes, loading, pagination, fetchNotes } = useNotes();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const loadNotes = useCallback(() => {
    fetchNotes({ search: debouncedSearch, category, sort, page, limit: 12 });
  }, [debouncedSearch, category, sort, page, fetchNotes]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleCategory = (val) => { setCategory(val); setPage(1); };
  const handleSort = (val) => { setSort(val); setPage(1); };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>My Notes</h1>
            <p className="page-subtitle">{pagination.total} notes total</p>
          </div>
          <Link to="/notes/new" className="btn btn-primary">
            <FiPlus /> New Note
          </Link>
        </div>

        <div className="notes-toolbar">
          <SearchBar value={search} onChange={handleSearch} />
          <div className="notes-filters">
            <input
              type="text"
              value={category}
              onChange={(e) => handleCategory(e.target.value)}
              placeholder="Filter by category"
              className="filter-input"
            />
            <select value={sort} onChange={(e) => handleSort(e.target.value)} className="filter-select">
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <p>No notes found</p>
            <Link to="/notes/new" className="btn btn-primary">Create your first note</Link>
          </div>
        ) : (
          <>
            <div className="notes-grid">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default NotesPage;
