# PLE Reviewer Assistant

A lightweight Flask web application for reviewing Physician Licensure Examination questions.

## Features
- Home page
- Review page with multiple-choice questions
- Results page with scoring and feedback

## Setup
1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
2. Run the app:
   ```sh
   python app.py
   ```

## Customization
- Edit `app.py` to add or update questions.
- Replace the secret key in `app.py` for production use.

## Directory Structure
- `app.py` — Main application
- `templates/` — HTML templates (index, review, results)
- `requirements.txt` — Python dependencies
- `README.md` — Instructions
