from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pickle
import os

# Initialize the Sentence Transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Correct the path to the faq_embeddings.pkl file
faq_embeddings_path = os.path.join(os.getcwd(), 'server', 'ai-faq', 'faq_embeddings.pkl')

# Debugging: Print the resolved path to ensure it's correct
print(f"Resolved path to faq_embeddings.pkl: {faq_embeddings_path}")

try:
    with open(faq_embeddings_path, "rb") as f:
        embeddings, answers = pickle.load(f)
except Exception as e:
    print(f"Error loading the embeddings: {e}")
    embeddings, answers = None, None  # Set to None in case of error

def get_faq_answer(query):
    if embeddings is None or answers is None:
        return "Error: FAQ data not loaded correctly."
    
    query_vec = model.encode([query.lower()])
    similarities = cosine_similarity(query_vec, embeddings)
    best_idx = np.argmax(similarities)
    return answers[best_idx]
