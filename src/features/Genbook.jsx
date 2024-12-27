import React, { useState } from 'react';
import ExtractedText from './ExtractedText';

function Genbook() {
  const genres = [
    "Fiction",
    "Romance",
    "Fantasy",
    "Mystery",
    "Science Fiction",
    "Thriller",
    "Horror",
    "Historical Fiction",
    "Crime Fiction",
    "Young Adult Literature",
    "Adventure",
    "Biography",
    "Autobiography",
    "Comedy",
    "Drama",
    "Poetry",
    "Spirituality",
    "Psychology",
    "Science",
    "History",
    "Travel",
    "Suspense",
    "Detective Fiction",
    "Historical Romance",
    "Paranormal Romance",
    "Contemporary Fantasy",
    "High Fantasy",
    "Dark Fantasy",
    "Urban Fantasy",
    "Dystopia",
    "Utopian and Dystopian Fiction",
    "True Crime",
    "Graphic Novel",
    "Science Fantasy",
    "Short Story",
    "Gothic Fiction",
    "Military Science Fiction",
    "Social Science Fiction",
    "Inspirational",
    "Coming of Age"
]



  const [selectedGenres, setSelectedGenres] = useState([]);
  const [bookName, setBookName] = useState('');
  const [bookText, setBookText] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [bookStart, setBookStart] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAllGenres, setShowAllGenres] = useState(false);

  const handleGenreChange = (genre) => {
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genre)
        ? prevSelectedGenres.filter((g) => g !== genre)
        : [...prevSelectedGenres, genre]
    );
  };

  const handleBookNameChange = (e) => {
    setBookName(e.target.value);
  };

  const fetchBooks = async () => {
    try {
      const genresParam = selectedGenres.join(',');
      const response = await fetch(`http://localhost:8000/recommend-books/?genres=${genresParam}&title=${bookName}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched recommended books:', data.books); // Debug log
      setRecommendedBooks(data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchBookText = async (book) => {
    try {
      const response = await fetch(`http://localhost:8000/get-book-text/?title=${book.title}&start=${bookStart}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched book text:', data.book_text); // Debug log
      setBookText((prevText) => [...prevText, ...data.book_text]);
      setSelectedBook(book.title);
    } catch (error) {
      console.error("Error fetching book text:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form with selected genres:', selectedGenres, 'and book name:', bookName);
    fetchBooks();
  };

  const loadMoreText = () => {
    setBookStart((prevBookStart) => prevBookStart + 500);
    if (selectedBook) fetchBookText({ title: selectedBook });
  };

  return (
    <div className="flex-col justify-center items-center p-4">
      <h2 className="text-xl font-bold">Filter by Genre</h2>
      <div className="grid grid-cols-4 gap-2  mb-4">
        {(showAllGenres ? genres : genres.slice(0,8)).map((genre) => (
          <label key={genre} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={genre}
              onChange={() => handleGenreChange(genre)}
              checked={selectedGenres.includes(genre)}
            />
            <span>{genre}</span>
          </label>
        ))}
      </div>

      {/* see-less and more */}

      <button onClick={() => setShowAllGenres(!showAllGenres)} className="text-blue-500 underline">
        {showAllGenres ? 'See Less' : 'See More'}
      </button>

      {/* BOOK-NAME INPUT */}

      <h2 className="text-xl font-bold mt-6">Filter by Book Name</h2>
      <input
        type="text"
        placeholder="Enter book name"
        value={bookName}
        onChange={handleBookNameChange}
        className="px-3 py-2 border rounded-md mb-4"
      />

      {/* SUBMIT */}
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>

      {/* RECOMMENDED BOOKS */}
      {!selectedBook && (
        <div className="mt-6">
        <h3 className="text-2xl font-bold">Recommended Books</h3>
        <div className='flex-row'>
        <ul>
          {recommendedBooks.map((book, index) => (
            <li key={index} className="my-2 cursor-pointer" onClick={() => fetchBookText(book)}>
              <p className='font-semibold text-xl'><strong>Title:</strong> {book.title}</p>
              <p><strong>Genre:</strong> {book.genres}</p>
            </li>
          ))}
        </ul>
        </div>
      </div>)}
      

      <div className="mt-6">
        <h3 className="text-xl font-bold">Book Text</h3>
       {bookText && selectedBook && (<div>
          <ExtractedText extText={bookText}/>
        </div>)} 
      </div>

      <button onClick={loadMoreText} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
        Load More Text
      </button>
    </div>
  );
}

export default Genbook;
