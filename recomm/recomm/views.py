from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
from pathlib import Path

csv_path = Path(__file__).resolve().parent / 'books.csv'

# View function to handle book recommendations
@csrf_exempt
def recommendbooks(request):
    try:
        genre = request.GET.get('genres')
        title = request.GET.get('title')

        # Debug input
        print("Received genres:", genre)
        print("Received title:", title)

        # Load dataset
        df = pd.read_csv(csv_path)

        if genre:
            # Split received genres into a list and normalize to lowercase
            selected_genres = [g.strip().lower() for g in genre.split(',')]
            print("Selected genres (processed):", selected_genres)
            
            # Normalize dataset genres
            df['genres'] = df['genres'].str.lower().apply(lambda x: [g.strip() for g in x.split(',')])

            # Filter rows by checking if any selected genre matches any book genre
            df = df[df['genres'].apply(lambda book_genres: any(g in book_genres for g in selected_genres))]

        if title:
            # Filter rows by title
            df = df[df['title'].str.contains(title, case=False, na=False)]

        # Debug filtered data
        print("Filtered DataFrame:", df[['title', 'genres']].head())

        # Prepare response
        recommended_books = df[['title', 'genres', 'text']].to_dict(orient='records')
        books_text = [book['text'] for book in recommended_books]

        return JsonResponse({
            'books': recommended_books,
            'book_text': books_text
        })
    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({'error': str(e)}, status=500)


# Function to extract the text of a specific book
def textextractor(request):
    try:
        book_title = request.GET.get('title')
        if not book_title:
            raise ValueError("Missing required parameter: 'title'")
        df = pd.read_csv(csv_path)
        book = df[df['title'].str.contains(book_title, case=False, na=False)]
        if book.empty:
            raise ValueError(f"Book with title '{book_title}' not found.")
        book_text = book['text'].iloc[0]
        return JsonResponse({
            'book_title': book_title,
            'book_text': book_text
        })
    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({'error': str(e)}, status=400)
