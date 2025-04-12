from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from collections import Counter

# from config import DevelopmentConfig, TestingConfig, ProductionConfig

app = Flask(__name__)
CORS(app)

# # Load configuration based on the FLASK_ENV environment variable
# if os.environ.get("FLASK_ENV") == "development":
#     app.config.from_object(DevelopmentConfig)
# elif os.environ.get("FLASK_ENV") == "testing":
#     app.config.from_object(TestingConfig)
# else:
#     app.config.from_object(ProductionConfig)


# Predefined skills and frameworks (extend as needed)
TECH_SKILLS = {"python", "java", "javascript", "typescript", "react", "flask", "django", "sql", "aws", "docker"}
SOFT_SKILLS = {"communication", "teamwork", "leadership", "problem-solving", "adaptability"}
FRAMEWORKS = {"react", "django", "flask", "angular", "vue"}

# Ensure nltk data downloaded
nltk.data.path.append('nltk_data')
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)


@app.route('/', methods=['GET'])
def home():
    return "Hello from Flask with Config!!!"

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '')

    tokens = word_tokenize(text.lower())

    words = [w for w in tokens if w.isalpha() and w not in stopwords.words('english')]

    word_freq = Counter(words)
    common_words = [word for word, _ in word_freq.most_common(10)]

    tech = list(set(words) & TECH_SKILLS)
    soft = list(set(words) & SOFT_SKILLS)
    frameworks = list(set(words) & FRAMEWORKS)

    response = {
        "skills": tech + soft,
        "frameworks": frameworks,
        "soft_skills": soft,
        "common_words": common_words
    }

    return jsonify(response)


if __name__ == '__main__':
    app.run(port=3000, debug=True)
