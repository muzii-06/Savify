# server/ai-faq/query.py
import sys
from faq_chatbot import get_faq_answer

query = sys.argv[1]
print(get_faq_answer(query))
