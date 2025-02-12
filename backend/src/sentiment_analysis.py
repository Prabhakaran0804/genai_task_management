from transformers import pipeline

# Load the sentiment analysis pipeline
sentiment_analyzer = pipeline("sentiment-analysis")

description = "The server is down and needs urgent attention!"

# Analyze sentiment
result = sentiment_analyzer(description)
print(result)  # Output will be something like [{'label': 'NEGATIVE', 'score': 0.99}]
