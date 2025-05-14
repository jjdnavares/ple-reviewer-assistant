from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with a secure key in production

# Sample questions for demonstration (replace with DB or file in production)
QUESTIONS = [
    {
        'id': 1,
        'question': 'What is the normal range of adult heart rate?',
        'choices': ['60-100 bpm', '40-60 bpm', '100-120 bpm', '120-140 bpm'],
        'answer': '60-100 bpm',
        'explanation': 'The normal adult heart rate is 60-100 beats per minute.'
    },
    {
        'id': 2,
        'question': 'Which vitamin is synthesized by the skin?',
        'choices': ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'],
        'answer': 'Vitamin D',
        'explanation': 'Vitamin D is synthesized in the skin upon exposure to sunlight.'
    },
    {
        'id': 3,
        'question': 'What is the first line treatment for hypertension?',
        'choices': ['Beta blockers', 'ACE inhibitors', 'Diuretics', 'Calcium channel blockers'],
        'answer': 'ACE inhibitors',
        'explanation': 'ACE inhibitors are recommended as first-line therapy for hypertension in many guidelines.'
    },
]

@app.route('/')
def index():
    return render_template('index.html')

from flask import flash

@app.route('/review', methods=['GET', 'POST'])
def review():
    q_index = int(request.args.get('q', 1)) - 1  # zero-based index
    show_answer = request.args.get('show_answer') == '1'
    answers = session.get('answers', {})

    if request.method == 'POST':
        selected = request.form.get('choice')
        if selected:
            answers[str(q_index)] = selected
            session['answers'] = answers
        # Next question or results
        if q_index + 1 < len(QUESTIONS):
            return redirect(url_for('review', q=q_index+2))
        else:
            return redirect(url_for('results'))

    question = QUESTIONS[q_index]
    user_answer = answers.get(str(q_index))
    return render_template(
        'review.html',
        question=question,
        q_num=q_index+1,
        total=len(QUESTIONS),
        user_answer=user_answer,
        show_answer=show_answer
    )

@app.route('/results')
def results():
    answers = session.get('answers', {})
    score = 0
    results_list = []
    for idx, q in enumerate(QUESTIONS):
        user_answer = answers.get(str(idx))
        correct = user_answer == q['answer']
        if correct:
            score += 1
        results_list.append({
            'question': q['question'],
            'user_answer': user_answer,
            'correct_answer': q['answer'],
            'is_correct': correct,
            'explanation': q['explanation']
        })
    return render_template('results.html', results=results_list, score=score, total=len(QUESTIONS))

if __name__ == '__main__':
    app.run(debug=True)
