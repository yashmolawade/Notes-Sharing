import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Share2,
  LogOut,
  User,
  Crown,
} from "lucide-react";
import NoteModal from "./NoteModal";
import ShareModal from "./ShareModal";

const Dashboard = ({ user, onLogout }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("my-notes");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [sharingNote, setSharingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowNoteModal(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowNoteModal(true);
  };

  const handleShareNote = (note) => {
    setSharingNote(note);
    setShowShareModal(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/notes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "my-notes") {
      return note.user._id === user._id && matchesSearch;
    } else {
      return note.user._id !== user._id && matchesSearch;
    }
  });

  const myNotes = notes.filter((note) => note.user._id === user._id);
  const sharedNotes = notes.filter((note) => note.user._id !== user._id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Notes App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <User className="h-5 w-5 mr-2" />
                {user.name}
                {user.role === "admin" && (
                  <Crown className="h-4 w-4 ml-1 text-yellow-500" />
                )}
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={onLogout}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600">
              Manage your notes and shared content
            </p>
          </div>
          <button
            onClick={handleCreateNote}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Note
          </button>
        </div>

        {/* Search and Tabs */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setActiveTab("my-notes")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "my-notes"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                My Notes ({myNotes.length})
              </button>
              <button
                onClick={() => setActiveTab("shared")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "shared"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Shared with Me ({sharedNotes.length})
              </button>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {activeTab === "my-notes" ? "No notes yet" : "No shared notes"}
            </div>
            {activeTab === "my-notes" && (
              <button
                onClick={handleCreateNote}
                className="mt-4 text-blue-600 hover:text-blue-500"
              >
                Create your first note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {note.title}
                  </h3>
                  <div className="flex space-x-2">
                    {note.user._id === user._id && (
                      <>
                        <button
                          onClick={() => handleEditNote(note)}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleShareNote(note)}
                          className="text-gray-400 hover:text-green-600"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {note.user._id !== user._id && user.role === "admin" && (
                      <>
                        <button
                          onClick={() => handleEditNote(note)}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {note.description}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>By: {note.user.name}</span>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                {note.sharedWith && note.sharedWith.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Shared with {note.sharedWith.length} user(s)
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showNoteModal && (
        <NoteModal
          note={editingNote}
          onClose={() => {
            setShowNoteModal(false);
            setEditingNote(null);
          }}
          onSave={() => {
            setShowNoteModal(false);
            setEditingNote(null);
            fetchNotes();
          }}
        />
      )}

      {showShareModal && (
        <ShareModal
          note={sharingNote}
          onClose={() => {
            setShowShareModal(false);
            setSharingNote(null);
          }}
          onShare={() => {
            setShowShareModal(false);
            setSharingNote(null);
            fetchNotes();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
