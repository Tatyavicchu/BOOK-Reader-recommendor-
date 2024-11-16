from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
from pathlib import Path

# Path to the CSV file
csv_path = Path(__file__).resolve().parent / 'books.csv'

# Function to filter and retrieve books in chunks
def getbookschunk(start=0, limit=5000, genre=None, title=None):
    chunkgenerator = pd.read_csv(csv_path, chunksize=500)
    filtered_books = []
    if genre:
        genres = genre.split(',')
    
    for chunk in chunkgenerator:
        if genre:
            chunk = chunk[chunk['genres'].apply(lambda x: any(g.lower() in x.lower() for g in genres))]
        
        if title:
            chunk = chunk[chunk['title'].str.contains(title, case=False, na=False)]
        
        filtered_books.extend(chunk[['title', 'genres', 'text']].to_dict(orient='records'))
    books_text = [book['text'] for book in filtered_books[start:start + limit]]
    
    return books_text, filtered_books

# View function to handle recommendation requests
@csrf_exempt
def recommendbooks(request):
    try:
        genre = request.GET.get('genres')
        title = request.GET.get('title')
        book_start = int(request.GET.get('book_start', 0))
        print(f"Received genres: {genre}")
        print(f"Received title: {title}")
        books_text, recommended_books = getbookschunk(start=book_start, genre=genre, title=title)
        print(f"Fetched recommended books: {recommended_books}")
        return JsonResponse({
            'books': recommended_books,
            'book_text': books_text
        })
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)
    
# function to extract 'text'block
def textextractor(request):
    try:
        booktitle = request.GET.get('title')
        start = int(request.GET.get('start', 0))
        
        if not booktitle:
            raise ValueError("Missing required parameter: 'title'")

        df = pd.read_csv(csv_path)
        book = df[df['title'].str.contains(booktitle, case=False, na=False)]
        if book.empty:
            raise ValueError(f"Book with title '{booktitle}' not found.")
        book_text = book['text'].iloc[0]
        text_chunk = book_text[start:start + 500]

        return JsonResponse({
            'book_title': booktitle,
            'book_text': text_chunk
        })

    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({'error': str(e)}, status=400)

    
    
